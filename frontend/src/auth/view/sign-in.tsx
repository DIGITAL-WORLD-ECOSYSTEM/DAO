/**
 * Copyright 2026 ASPPIBRA – Associação dos Proprietários e Possuidores de Imóveis no Brasil.
 * Project: Governance System (ASPPIBRA DAO)
 * Role: Authentication View (Sign In)
 * Version: 1.2.0 - Smart Redirect & UX Hardened
 */

'use client';

import * as z from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useAuthContext } from '../hooks';
import { Form, Field, Iconify, FormHead, schemaUtils, AnimateLogoRotate } from '../components';

// ----------------------------------------------------------------------

// Definição do tipo baseado no Schema para garantir Type-Safety
export type SignInSchemaType = z.infer<typeof SignInSchema>;

/**
 * SCHEMA DE VALIDAÇÃO (ZOD)
 * Utiliza utilitários globais para manter consistência com o Backend.
 */
export const SignInSchema = z.object({
  email: schemaUtils.email(), 
  password: z.string().min(1, { message: 'A senha é obrigatória!' }),
  otpCode: z.string().optional(),
});

// ----------------------------------------------------------------------

export function CenteredSignInView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mfaRequired, setMfaRequired] = useState(false);
  
  const returnTo = searchParams.get('returnTo');

  const { signIn } = useAuthContext();
  const showPassword = useBoolean();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: SignInSchemaType = {
    email: '',
    password: '',
    otpCode: '',
  };
  const methods = useForm<SignInSchemaType>({
    // @ts-ignore - Conflito de versão Zod v4 vs Resolver v3 (Handshake 2026)
    resolver: zodResolver(SignInSchema) as any,
    defaultValues,
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data: SignInSchemaType) => {
    try {
      setErrorMessage(null);
      
      const result = await signIn(data.email, data.password, data.otpCode);

      if (result?.mfaRequired) {
        setMfaRequired(true);
        return;
      }

      router.push(returnTo || paths.dashboard.root);
      
    } catch (error: any) {
      console.error('🔥 Login Error:', error);
      setErrorMessage(error.message || 'E-mail ou senha incorretos.');
    }
  });

  const renderForm = (
    <Stack spacing={3}>
      {!!errorMessage && (
        <Alert severity="error" variant="filled" sx={{ borderRadius: 1 }}>
          {errorMessage}
        </Alert>
      )}

      {!mfaRequired ? (
        <>
          <Field.Text 
            name="email" 
            label="E-mail" 
            placeholder="sandro_ceo@asppibra.com.br"
            slotProps={{ inputLabel: { shrink: true } }} 
          />

          <Field.Text
            name="password"
            label="Senha"
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
        </>
      ) : (
        <Stack spacing={2}>
          <Alert severity="info" variant="outlined">
            MFA Habilitado. Digite o código do seu autenticador.
          </Alert>
          <Field.Code name="otpCode" />
        </Stack>
      )}

      <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
        <Link
          component={RouterLink}
          href={paths.auth.reset}
          variant="body2"
          color="inherit"
          underline="hover"
          sx={{ fontWeight: '600' }}
        >
          Esqueceu a senha?
        </Link>

        <Link
          component={RouterLink}
          href={paths.auth.recovery}
          variant="body2"
          color="primary"
          underline="hover"
          sx={{ fontWeight: '600' }}
        >
          Recuperar Identidade
        </Link>
      </Stack>

      <Button
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{ 
          bgcolor: 'text.primary', 
          color: 'background.paper',
          '&:hover': { bgcolor: 'text.secondary' } 
        }}
      >
        {mfaRequired ? 'Verificar Identidade' : 'Entrar no Portal'}
      </Button>
    </Stack>
  );

  return (
    <>
      {/* Logotipo com animação de entrada */}
      <AnimateLogoRotate sx={{ mb: 3, mx: 'auto' }} />

      <FormHead
        title="Login ASPPIBRA"
        description={
          <>
            {`Novo na DAO? `}
            <Link component={RouterLink} href={paths.auth.signUp} variant="subtitle2" color="primary">
              Solicitar Acesso
            </Link>
          </>
        }
        sx={{ textAlign: 'center' }}
      />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </>
  );
}