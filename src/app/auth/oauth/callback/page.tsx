'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { setSession } from 'src/auth/context/utils';

// ----------------------------------------------------------------------

/**
 * Inner component isolado para uso de useSearchParams() com Suspense.
 * Em Next.js App Router, useSearchParams() exige Suspense boundary.
 */
function OAuthCallbackInner() {
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

    // 1. Salva token: localStorage + cookie + Axios headers
    setSession(token);

    // 2. Força reload completo — o AuthProvider reinicia do zero e lê o
    //    token do localStorage, transitando para 'authenticated' corretamente.
    //    (router.replace() causa race condition com o AuthProvider)
    window.location.href = paths.dashboard.root;
  }, [searchParams]);

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

// ----------------------------------------------------------------------

/**
 * /auth/oauth/callback
 *
 * Recebe o JWT do Worker após autenticação Google/GitHub:
 *   ?token=<JWT>          → salva sessão e recarrega para o dashboard
 *   ?error=<description>  → exibe mensagem de erro
 */
export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size={48} />
        </Box>
      }
    >
      <OAuthCallbackInner />
    </Suspense>
  );
}
