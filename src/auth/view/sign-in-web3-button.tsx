/**
 * SignInWeb3Button — Botão de autenticação SIWE
 *
 * Exibe estado visual durante o fluxo Web3:
 *   idle → connecting → signing → verifying → (redirect) ou error
 */

'use client';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

import { Iconify } from '../components';
import { useSiwe } from '../hooks/use-siwe';

// ---------------------------------------------------------------------------

const LABELS: Record<string, string> = {
  idle: 'Web3 Wallet (SIWE)',
  connecting: 'Conectando carteira…',
  signing: 'Aguardando assinatura…',
  verifying: 'Verificando identidade…',
  error: 'Web3 Wallet (SIWE)',
};

// ---------------------------------------------------------------------------

export function SignInWeb3Button() {
  const { status, error, signInWithWallet } = useSiwe();

  const isLoading = status === 'connecting' || status === 'signing' || status === 'verifying';

  return (
    <>
      <Button
        fullWidth
        variant="soft"
        color="primary"
        size="large"
        disabled={isLoading}
        onClick={signInWithWallet}
        startIcon={
          isLoading ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            <Iconify icon={"logos:metamask-icon" as any} />
          )
        }
        sx={{
          mt: 2,
          height: 52,
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
          color: 'primary.main',
          position: 'relative',
          border: 'none',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            padding: '1.5px',
            background: (theme) => `linear-gradient(135deg, 
              ${alpha(theme.palette.primary.main, 1)} 0%, 
              ${alpha(theme.palette.primary.main, 0.1)} 50%, 
              ${alpha(theme.palette.primary.main, 0.6)} 100%
            )`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          },
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            boxShadow: (theme) => `0 0 15px ${alpha(theme.palette.primary.main, 0.3)}`,
          },
        }}
      >
        {LABELS[status]}
      </Button>

      {status === 'error' && error && (
        <Alert
          severity="error"
          variant="outlined"
          sx={{ mt: 1.5, borderRadius: 1, fontSize: '0.8rem' }}
        >
          {error}
        </Alert>
      )}
    </>
  );
}
