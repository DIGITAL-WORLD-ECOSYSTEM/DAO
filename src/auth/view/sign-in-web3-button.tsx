/**
 * SignInWeb3Button — Botão de autenticação SIWE
 *
 * Exibe estado visual durante o fluxo Web3:
 *   idle → connecting → signing → verifying → (redirect) ou error
 */

'use client';

import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { useSiwe } from '../hooks/use-siwe';
import { Iconify } from '../components';

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
        sx={{ mt: 2, fontFamily: "'Orbitron', sans-serif" }}
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
