import * as z from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';
import { Form, Field, schemaUtils } from 'src/components/hook-form';

import { useAuthContext } from '../../hooks';
import { getErrorMessage } from '../../utils';
import { signInWithWeb3, signInWithPassword } from '../../context/jwt';

// ----------------------------------------------------------------------

export type SignInSchemaType = z.infer<typeof SignInSchema>;

export const SignInSchema = z.object({
  email: schemaUtils.email(),
  password: z
    .string()
    .min(1, { message: 'A senha é obrigatória!' })
    .min(6, { message: 'A senha deve ter pelo menos 6 caracteres!' }),
});

// ----------------------------------------------------------------------

export function JwtSignInView() {
  const theme = useTheme();

  const router = useRouter();

  const showPassword = useBoolean();

  const { checkUserSession } = useAuthContext();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const defaultValues: SignInSchemaType = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signInWithPassword({ email: data.email, password: data.password });
      await checkUserSession?.();

      const redirectUrl = returnTo || paths.dashboard.root;

      router.push(redirectUrl);
    } catch (error) {
      console.error(error);
      const feedbackMessage = getErrorMessage(error);
      setErrorMessage(feedbackMessage);
    }
  });

  const handleWeb3Login = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Instale a MetaMask para continuar.');
      }
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const address = accounts[0];
      await signInWithWeb3(address);
      await checkUserSession?.();

      const redirectUrl = returnTo || paths.dashboard.root;

      router.push(redirectUrl);
    } catch (error) {
      console.error(error);
      setErrorMessage(getErrorMessage(error));
    }
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    const { serverUrl } = CONFIG;
    window.location.href = `${serverUrl}/api/core/identity/oauth/${provider}/login`;
  };

  const renderForm = () => (
    <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
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
              color: 'info.main',
            },
          },
          input: {
            sx: {
              borderRadius: 1,
              '& input': {
                fontFamily: 'var(--font-orbitron), sans-serif',
                color: 'info.main',
                '&:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 100px #020817 inset',
                  WebkitTextFillColor: theme.palette.info.main,
                  transition: 'background-color 5000s ease-in-out 0s',
                },
              },
              '& fieldset': { borderColor: alpha(theme.palette.info.main, 0.2) },
              '&:hover fieldset': { borderColor: `${theme.palette.info.main} !important` },
              '&.Mui-focused fieldset': { borderColor: `${theme.palette.info.main} !important` },
            },
          },
        }}
      />

      <Box sx={{ gap: 1.5, display: 'flex', flexDirection: 'column' }}>
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
                color: 'info.main',
              },
            },
            input: {
              sx: {
                borderRadius: 1,
                '& input': {
                  fontFamily: 'var(--font-orbitron), sans-serif',
                  color: 'info.main',
                  '&:-webkit-autofill': {
                    WebkitBoxShadow: '0 0 0 100px #020817 inset',
                    WebkitTextFillColor: theme.palette.info.main,
                    transition: 'background-color 5000s ease-in-out 0s',
                  },
                },
                '& fieldset': { borderColor: alpha(theme.palette.info.main, 0.2) },
                '&:hover fieldset': { borderColor: `${theme.palette.info.main} !important` },
                '&.Mui-focused fieldset': { borderColor: `${theme.palette.info.main} !important` },
              },
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={showPassword.onToggle}
                    edge="end"
                    sx={{ color: 'info.main' }}
                  >
                    <Iconify
                      icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" sx={{ color: 'grey.500', fontSize: 11 }}>
          Novo na DAO?{' '}
          <Link
            component={RouterLink}
            href={paths.auth.jwt.signUp}
            sx={{
              color: 'info.main',
              fontFamily: 'var(--font-orbitron), sans-serif',
              fontWeight: 800,
              textDecoration: 'none',
            }}
          >
            SOLICITAR
          </Link>
        </Typography>
        <Link
          component={RouterLink}
          href={paths.auth.jwt.resetPassword}
          variant="caption"
          sx={{
            color: 'info.main',
            fontFamily: 'var(--font-orbitron), sans-serif',
            fontWeight: 800,
            textDecoration: 'none',
            fontSize: 10,
          }}
        >
          ESQUECEU A SENHA?
        </Link>
      </Box>

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="outlined"
        loading={isSubmitting}
        sx={{
          height: 60,
          fontSize: 18,
          fontFamily: 'var(--font-orbitron), sans-serif',
          fontWeight: 900,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          bgcolor: alpha('#020817', 0.6),
          backdropFilter: 'blur(8px)',
          color: 'info.main',
          borderColor: alpha(theme.palette.info.main, 0.5),
          boxShadow: `0 0 15px ${alpha(theme.palette.info.main, 0.2)}`,
          transition: theme.transitions.create(['all']),
          '&:hover': {
            bgcolor: alpha(theme.palette.info.main, 0.1),
            borderColor: 'info.main',
            transform: 'translateY(-2px)',
            boxShadow: `0 5px 25px ${alpha(theme.palette.info.main, 0.5)}`,
          },
        }}
      >
        ENTRAR NO PORTAL
      </Button>
    </Box>
  );

  return (
    <Box
      sx={{
        width: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      {!!errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm()}
      </Form>

      <Divider sx={{ my: 2, '&::before, &::after': { borderTopStyle: 'dashed', opacity: 0.15 } }}>
        <Typography
          variant="caption"
          sx={{
            color: 'grey.500',
            letterSpacing: 2.5,
            fontWeight: 700,
            fontFamily: 'var(--font-orbitron), sans-serif',
          }}
        >
          OU CONTINUE COM
        </Typography>
      </Divider>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => handleSocialLogin('google')}
          startIcon={<Iconify icon="logos:google-icon" />}
          sx={{
            color: 'white',
            borderColor: alpha(theme.palette.info.main, 0.1),
            fontFamily: 'var(--font-orbitron), sans-serif',
            fontWeight: 700,
            fontSize: 13,
            '&:hover': {
              borderColor: 'info.main',
              bgcolor: alpha(theme.palette.info.main, 0.05),
              transform: 'translateY(-2px)',
              boxShadow: `0 5px 15px ${alpha(theme.palette.info.main, 0.2)}`,
            },
          }}
        >
          Google
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={() => handleSocialLogin('github')}
          startIcon={<Iconify icon="logos:github-icon" />}
          sx={{
            color: 'white',
            borderColor: alpha(theme.palette.info.main, 0.1),
            fontFamily: 'var(--font-orbitron), sans-serif',
            fontWeight: 700,
            fontSize: 13,
            '&:hover': {
              borderColor: 'info.main',
              bgcolor: alpha(theme.palette.info.main, 0.05),
              transform: 'translateY(-2px)',
              boxShadow: `0 5px 15px ${alpha(theme.palette.info.main, 0.2)}`,
            },
          }}
        >
          GitHub
        </Button>
      </Box>

      <Button
        fullWidth
        variant="soft"
        onClick={handleWeb3Login}
        startIcon={
          <Box
            component="img"
            src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
            sx={{ width: 24, height: 24 }}
          />
        }
        sx={{
          height: 54,
          fontFamily: 'var(--font-orbitron), sans-serif',
          fontWeight: 900,
          letterSpacing: 1.5,
          color: 'info.main',
          bgcolor: alpha('#020817', 0.8),
          border: `1px solid ${alpha(theme.palette.info.main, 0.4)}`,
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            borderColor: 'info.main',
            backgroundColor: alpha('#020817', 0.9),
            boxShadow: `0 0 30px ${alpha(theme.palette.info.main, 0.6)}`,
            transform: 'scale(1.02)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: `linear-gradient(45deg, transparent, ${alpha(theme.palette.info.main, 0.1)}, transparent)`,
            transform: 'rotate(45deg)',
            animation: 'shimmer 3s infinite',
          },
          '@keyframes shimmer': {
            '0%': { transform: 'translateX(-100%) rotate(45deg)' },
            '100%': { transform: 'translateX(100%) rotate(45deg)' },
          },
        }}
      >
        WALLET
      </Button>
    </Box>
  );
}
