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
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { signUp } from '../context/action';
import {
  Form,
  Field,
  Iconify,
  FormHead,
  SignUpTerms,
  schemaUtils,
  AnimateLogoRotate,
} from '../components';

// ----------------------------------------------------------------------

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;

export const SignUpSchema = z.object({
  firstName: z.string().min(1, { message: 'Nome é obrigatório!' }),
  lastName: z.string().min(1, { message: 'Sobrenome é obrigatório!' }),
  email: schemaUtils.email(),
  password: z
    .string()
    .min(1, { message: 'Senha é obrigatória!' })
    .min(8, { message: 'A senha deve ter pelo menos 8 caracteres!' }),
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

      <Box
        sx={{ display: 'flex', gap: { xs: 3, sm: 2 }, flexDirection: { xs: 'column', sm: 'row' } }}
      >
        <Field.Text
          name="firstName"
          label="Nome"
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
          name="lastName"
          label="Sobrenome"
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
      </Box>

      <Field.Text
        name="email"
        label="E-mail"
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
        placeholder="Mínimo 8 caracteres"
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
        CRIAR LOGIN
      </Button>
    </Box>
  );

  return (
    <>
      <FormHead title="" sx={{ display: 'none' }} />

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <Box sx={{ mt: 3, textAlign: 'center', typography: 'body2', color: 'text.secondary' }}>
        {`Já possui uma conta? `}
        <Button
          component={RouterLink}
          href={paths.auth.signIn}
          variant="text"
          color="primary"
          sx={{
            p: 0,
            ml: 0.5,
            minWidth: 'auto',
            fontFamily: 'var(--font-orbitron), sans-serif',
            fontWeight: 700,
            fontSize: 14,
            textDecoration: 'none',
            '&:hover': {
              bgcolor: 'transparent',
              textDecoration: 'underline',
              color: 'primary.light',
            },
          }}
        >
          ENTRAR
        </Button>
      </Box>

      <SignUpTerms sx={{ mt: 3, opacity: 0.6 }} />
    </>
  );
}
