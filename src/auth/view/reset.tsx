'use client';

import * as z from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import axios, { endpoints } from 'src/lib/axios';

import { Form, toast, Field, Iconify, FormHead, schemaUtils } from 'src/auth/components';

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
      setErrorMessage(
        error.message || 'Erro ao processar solicitação. Verifique se o e-mail está correto.'
      );
    }
  });

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
      {!!errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <Field.Text
        name="email"
        label="E-mail"
        placeholder="exemplo@asppibra.com.br"
        autoFocus
        slotProps={{
          inputLabel: {
            shrink: true,
            sx: {
              fontFamily: 'var(--font-orbitron), sans-serif',
              fontWeight: 600,
              color: 'primary.main',
              transform: 'translate(14px, -10px) scale(0.75)',
            },
          },
          input: {
            sx: {
              '& input': {
                fontFamily: 'var(--font-orbitron), sans-serif',
                color: '#00B8D9',
                '&:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 100px #020817 inset !important',
                  WebkitTextFillColor: '#00B8D9 !important',
                  transition: 'background-color 5000s ease-in-out 0s',
                },
              },
            },
          },
        }}
      />

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{
          height: 60,
          fontSize: 18,
          fontFamily: 'var(--font-orbitron), sans-serif',
          fontWeight: 900,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          bgcolor: alpha('#020817', 0.9),
          color: 'common.white',
          position: 'relative',
          border: 'none',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            padding: '1.5px',
            background: `linear-gradient(180deg, 
              #00B8D9 0%, 
              rgba(0, 184, 217, 0.1) 50%, 
              rgba(0, 184, 217, 0.8) 100%
            )`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          },
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            bgcolor: '#00B8D919',
            transform: 'scale(1.03)',
            boxShadow: '0 0 25px rgba(0, 184, 217, 0.4)',
          },
        }}
      >
        ENVIAR SOLICITAÇÃO
      </Button>
    </Box>
  );

  return (
    <>
      <FormHead title="" sx={{ display: 'none' }} />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <Button
        component={RouterLink}
        href={paths.auth.signIn}
        color="primary"
        variant="text"
        startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        sx={{
          mt: 3,
          mx: 'auto',
          display: 'flex',
          fontFamily: 'var(--font-orbitron), sans-serif',
          fontWeight: 700,
          color: 'primary.main',
          fontSize: 14,
          '&:hover': {
            bgcolor: 'transparent',
            textDecoration: 'underline',
            color: 'primary.light',
          },
        }}
      >
        VOLTAR PARA LOGIN
      </Button>
    </>
  );
}
