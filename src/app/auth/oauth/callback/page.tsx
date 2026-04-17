'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { setSession } from 'src/auth/context/utils';

/**
 * /auth/oauth/callback
 *
 * After Google / GitHub OAuth the backend redirects here with:
 *   ?token=<JWT>          → success
 *   ?error=<description>  → failure
 *
 * This page reads the token, calls setSession() to persist it in
 * localStorage + Axios headers, then sends the user to the dashboard.
 */
export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (error) {
      setErrorMsg(decodeURIComponent(error));
      return;
    }

    if (!token) {
      setErrorMsg('Token não recebido. Tente novamente.');
      return;
    }

    // Persist session and redirect to dashboard
    setSession(token);
    router.replace(paths.dashboard.root);
  }, [router, searchParams]);

  if (errorMsg) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          p: 4,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 480, width: '100%' }}>
          <Typography variant="subtitle2" gutterBottom>
            Falha na autenticação via OAuth
          </Typography>
          {errorMsg}
        </Alert>

        <Typography
          component="a"
          href={paths.auth.signIn}
          variant="body2"
          sx={{ color: 'primary.main', cursor: 'pointer', textDecoration: 'underline' }}
        >
          ← Voltar para o Login
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <CircularProgress size={48} />
      <Typography variant="body2" color="text.secondary">
        Autenticando… aguarde.
      </Typography>
    </Box>
  );
}
