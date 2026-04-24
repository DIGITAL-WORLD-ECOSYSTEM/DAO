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

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { CONFIG } from 'src/global-config';
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useAuthContext } from '../hooks';
import { SignInWeb3Button } from './sign-in-web3-button';
import { Form, Field, Iconify, schemaUtils } from '../components';

// ----------------------------------------------------------------------

// Definição do tipo baseado no Schema para garantir Type-Safety
export type SignInSchemaType = z.infer<typeof SignInSchema>;

/**
 * SCHEMA DE VALIDAÇÃO (ZOD)
 * Utiliza utilitários globais para manter consistência com o Backend.
 */
export const SignInSchema = z.object({
  email: schemaUtils.email(), // Validação rigorosa de formato de e-mail
  password: z.string().min(1, { message: 'A senha é obrigatória!' }),
});

// ----------------------------------------------------------------------

export function CenteredSignInView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /** * 🟢 REDIRECIONAMENTO INTELIGENTE
   * Recupera o parâmetro 'returnTo' injetado pelo Middleware se o usuário
   * tentou acessar uma rota protegida sem estar logado.
   */
  const returnTo = searchParams.get('returnTo');

  const { signIn } = useAuthContext();
  const showPassword = useBoolean();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Valores iniciais do formulário
  const defaultValues: SignInSchemaType = {
    email: '',
    password: '',
  };

  const methods = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  /**
   * HANDLER DE SUBMISSÃO
   * Integra com o Contexto de Autenticação para gerar Cookies e Sessão.
   */
  const onSubmit = handleSubmit(async (data: SignInSchemaType) => {
    try {
      setErrorMessage(null);

      // Chamada ao serviço de autenticação (Configura Axios + Cookies)
      const user = await signIn(data.email, data.password);

      // 🟢 REDIRECIONAMENTO INTELIGENTE (RBAC)
      // Se houver uma rota de retorno, prioriza ela; caso contrário, usa o padrão do cargo
      const defaultPath =
        CONFIG.auth.defaultPathByRole[user.role as keyof typeof CONFIG.auth.defaultPathByRole] ||
        paths.dashboard.root;

      router.push(returnTo || defaultPath);
    } catch (error: any) {
      console.error('🔥 Login Error:', error);
      // Extrai mensagem de erro vinda do Interceptor do Axios (backend)
      setErrorMessage(error.message || 'E-mail ou senha incorretos.');
    }
  });

  const renderForm = (
    <Stack spacing={3}>
      {/* Exibição de Erros do Backend */}
      {!!errorMessage && (
        <Alert severity="error" variant="filled" sx={{ borderRadius: 1 }}>
          {errorMessage}
        </Alert>
      )}

      <Field.Text
        name="email"
        label="E-mail"
        placeholder="usuario@mundodigital.com"
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

      <Field.Text
        name="password"
        label="Senha"
        type={showPassword.value ? 'text' : 'password'}
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

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 0, mb: 1 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: 11 }}>
          Novo na DAO?{' '}
          <Button
            component={RouterLink}
            href={paths.auth.signUp}
            variant="text"
            color="primary"
            sx={{
              p: 0,
              minWidth: 'auto',
              fontFamily: 'var(--font-orbitron), sans-serif',
              fontWeight: 700,
              fontSize: 14, // Slightly larger than plain text
              textDecoration: 'none',
              '&:hover': {
                bgcolor: 'transparent',
                textDecoration: 'underline',
                color: 'primary.light',
              },
            }}
          >
            SOLICITAR
          </Button>
        </Typography>

        <Button
          component={RouterLink}
          href={paths.auth.reset}
          variant="text"
          color="primary"
          sx={{
            p: 0,
            minWidth: 'auto',
            fontFamily: 'var(--font-orbitron), sans-serif',
            fontWeight: 700,
            textDecoration: 'none',
            textTransform: 'uppercase',
            letterSpacing: 1.2,
            fontSize: 10,
            '&:hover': {
              bgcolor: 'transparent',
              textDecoration: 'underline',
              color: 'primary.light',
            },
          }}
        >
          ESQUECEU A SENHA?
        </Button>
      </Stack>

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{
          height: 60, // Aumentado para mais destaque
          fontSize: 18, // Aumentado conforme solicitado
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
          transition: (theme) => theme.transitions.create(['all']),
          '&:hover': {
            bgcolor: '#00B8D919', // equivalent to alpha(theme.palette.primary.main, 0.1)
            transform: 'scale(1.03)',
            boxShadow: '0 0 25px rgba(0, 184, 217, 0.4)',
          },
        }}
      >
        Entrar no Portal
      </Button>
    </Stack>
  );

  return (
    <>
      {/* Logotipo removido conforme solicitado */}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>

      <Divider sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed', opacity: 0.15 } }}>
        <Typography
          variant="overline"
          sx={{
            color: 'text.disabled', // Mais sutil
            fontFamily: 'var(--font-orbitron), sans-serif',
            fontWeight: 700,
            letterSpacing: 2.5,
          }}
        >
          OU CONTINUE COM
        </Typography>
      </Divider>

      <Stack direction="row" spacing={2} justifyContent="center">
        <Button
          fullWidth
          variant="soft"
          color="inherit"
          startIcon={<Iconify icon={"logos:google-icon" as any} />}
          href={`${process.env.NEXT_PUBLIC_HOST_API || 'https://api.asppibra.com'}/api/core/identity/oauth/google/login`}
          sx={{
            height: 48,
            fontFamily: 'var(--font-orbitron), sans-serif',
            fontWeight: 700,
            color: 'common.white', // Mais contraste
            bgcolor: alpha('#020817', 0.5),
            border: (theme) => `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
            '&:hover': { bgcolor: alpha('#020817', 0.7), borderColor: 'info.main' },
          }}
        >
          Google
        </Button>

        <Button
          fullWidth
          variant="soft"
          color="inherit"
          startIcon={<Iconify icon={"mdi:github" as any} />}
          href={`${process.env.NEXT_PUBLIC_HOST_API || 'https://api.asppibra.com'}/api/core/identity/oauth/github/login`}
          sx={{
            height: 48,
            fontFamily: 'var(--font-orbitron), sans-serif',
            fontWeight: 700,
            color: 'common.white', // Mais contraste
            bgcolor: alpha('#020817', 0.5),
            border: (theme) => `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
            '&:hover': { bgcolor: alpha('#020817', 0.7), borderColor: 'info.main' },
          }}
        >
          GitHub
        </Button>
      </Stack>

      <SignInWeb3Button />
    </>
  );
}
