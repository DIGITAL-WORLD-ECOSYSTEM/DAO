'use client';

import * as z from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { SentIcon } from 'src/assets/icons';
import axios, { endpoints } from 'src/lib/axios';

// CORREÇÃO: Juntamos o 'toast' aqui com os outros componentes para evitar o erro de duplicata
import { 
  Form,
  toast, 
  Field, 
  Iconify, 
  FormHead, 
  schemaUtils, 
  FormResendCode, 
  FormReturnLink 
} from '../components';

// ----------------------------------------------------------------------

export type UpdatePasswordSchemaType = z.infer<typeof UpdatePasswordSchema>;

export const UpdatePasswordSchema = z
  .object({
    code: z
      .string()
      .min(1, { message: 'O código é obrigatório!' })
      .min(6, { message: 'O código deve ter pelo menos 6 caracteres!' }),
    email: schemaUtils.email(),
    password: z
      .string()
      .min(1, { message: 'A senha é obrigatória!' })
      .min(6, { message: 'A senha deve ter pelo menos 6 caracteres!' }),
    confirmPassword: z.string().min(1, { message: 'Confirme a nova senha!' }),
  })
  .refine((val) => val.password === val.confirmPassword, {
    message: 'As senhas não coincidem!',
    path: ['confirmPassword'],
  });

// ----------------------------------------------------------------------

export function CenteredUpdatePasswordView() {
  const router = useRouter();
  const showPassword = useBoolean();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: UpdatePasswordSchemaType = {
    code: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const methods = useForm<UpdatePasswordSchemaType>({
    resolver: zodResolver(UpdatePasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Mantivemos a correção de tipagem que fizemos antes
  const onSubmit = handleSubmit(async (data: UpdatePasswordSchemaType) => {
    try {
      setErrorMessage(null);

      // Chamada real para o endpoint de reset/update de senha no seu Worker
      await axios.post(endpoints.auth.updatePassword || '/api/core/auth/update-password', {
        email: data.email,
        code: data.code,
        password: data.password,
      });

      toast.success('Senha atualizada com sucesso!');
      router.push(paths.auth.signIn);
      
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || 'Erro ao atualizar senha. Verifique o código enviado.');
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      
      {!!errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <Field.Text
        name="email"
        label="Endereço de e-mail"
        placeholder="exemplo@asppibra.com.br"
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <Field.Code name="code" />

      <Field.Text
        name="password"
        label="Nova Senha"
        placeholder="Mínimo 6 caracteres"
        type={showPassword.value ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showPassword.onToggle} edge="end">
                  <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Field.Text
        name="confirmPassword"
        label="Confirmar nova senha"
        type={showPassword.value ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={showPassword.onToggle} edge="end">
                  <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Atualizar Senha
      </Button>
    </Box>
  );

  return (
    <>
      <FormHead
        icon={<SentIcon />}
        title="Solicitação enviada!"
        description={`Enviamos um e-mail de confirmação com 6 dígitos. \nInsira o código abaixo para validar sua nova senha.`}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <FormResendCode onResendCode={() => {}} value={0} disabled={false} />

      <FormReturnLink href={paths.auth.signIn} />
    </>
  );
}