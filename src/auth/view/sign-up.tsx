'use client';

import * as z from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { signUp } from '../context/action';
import { Form, Field, Iconify, FormHead, SignUpTerms, schemaUtils, AnimateLogoRotate } from '../components';

// ----------------------------------------------------------------------

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;

export const SignUpSchema = z.object({
  firstName: z.string().min(1, { message: 'Nome é obrigatório!' }),
  lastName: z.string().min(1, { message: 'Sobrenome é obrigatório!' }),
  email: schemaUtils.email(),
  password: z
    .string()
    .min(1, { message: 'Senha é obrigatória!' })
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres!' }),
});

// ----------------------------------------------------------------------

export function CenteredSignUpView() {
  const router = useRouter();
  const showPassword = useBoolean();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: SignUpSchemaType = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const methods = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // CORREÇÃO AQUI: Adicionamos o tipo explícito ": SignUpSchemaType" para evitar erros de build
  const onSubmit = handleSubmit(async (data: SignUpSchemaType) => {
    try {
      setErrorMessage(null);

      // Chamada real para o seu Worker na Cloudflare
      await signUp({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      // Redireciona para o dashboard após o sucesso
      router.push(paths.dashboard.root);
      
    } catch (error: any) {
      console.error(error);
      // Exibe a mensagem de erro vinda da API (ex: "Este email já está em uso")
      setErrorMessage(error.message || 'Erro ao criar conta. Tente novamente.');
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      
      {!!errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <Box sx={{ display: 'flex', gap: { xs: 3, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' } }}>
        <Field.Text name="firstName" label="Nome" slotProps={{ inputLabel: { shrink: true } }} />
        <Field.Text name="lastName" label="Sobrenome" slotProps={{ inputLabel: { shrink: true } }} />
      </Box>

      <Field.Text name="email" label="E-mail" slotProps={{ inputLabel: { shrink: true } }} />

      <Field.Text
        name="password"
        label="Senha"
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

      <Button
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Criar conta institucional
      </Button>
    </Box>
  );

  return (
    <>
      <AnimateLogoRotate sx={{ mb: 3, mx: 'auto' }} />

      <FormHead
        title="Comece agora gratuitamente"
        description={
          <>
            {`Já possui uma conta? `}
            <Link component={RouterLink} href={paths.auth.signIn} variant="subtitle2">
              Entrar
            </Link>
          </>
        }
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <SignUpTerms />
    </>
  );
}