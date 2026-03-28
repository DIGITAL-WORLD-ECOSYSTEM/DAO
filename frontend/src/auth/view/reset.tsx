'use client';

import * as z from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { PasswordIcon } from 'src/assets/icons';
import axios, { endpoints } from 'src/lib/axios';

import { Form , toast, Field, FormHead, schemaUtils, FormReturnLink } from 'src/auth/components';


// ----------------------------------------------------------------------

export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;

export const ResetPasswordSchema = z.object({
  email: schemaUtils.email(),
});

// ----------------------------------------------------------------------

export function CenteredResetPasswordView() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: ResetPasswordSchemaType = {
    email: '',
  };

  const methods = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // CORREÇÃO AQUI: Adicionamos o tipo explícito ": ResetPasswordSchemaType"
  const onSubmit = handleSubmit(async (data: ResetPasswordSchemaType) => {
    try {
      setErrorMessage(null);

      // Chamada real para o seu Worker na Cloudflare
      await axios.post(endpoints.auth.resetPassword || '/api/core/auth/reset-password', {
        email: data.email,
      });

      toast.success('Solicitação enviada! Verifique seu e-mail.');
      
      // Redireciona para a tela de atualização onde o usuário insere o código recebido
      router.push(paths.auth.updatePassword);
      
    } catch (error: any) {
      console.error(error);
      setErrorMessage(error.message || 'Erro ao processar solicitação. Verifique se o e-mail está correto.');
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      
      {!!errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <Field.Text
        name="email"
        label="Endereço de e-mail"
        placeholder="exemplo@asppibra.com.br"
        autoFocus
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Enviar Solicitação
      </Button>
    </Box>
  );

  return (
    <>
      <FormHead
        icon={<PasswordIcon />}
        title="Esqueceu sua senha?"
        description="Insira o endereço de e-mail associado à sua conta institucional e enviaremos um código para redefinição."
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <FormReturnLink href={paths.auth.signIn} />
    </>
  );
}