import { useState } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type NuclearModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionName: string;
  expectedText: string;
};

export function NuclearModal({
  open,
  onClose,
  onConfirm,
  actionName,
  expectedText,
}: NuclearModalProps) {
  const [inputText, setInputText] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isTextMatch = inputText === expectedText;
  const isMfaValid = mfaCode.length === 6;

  const handleConfirm = async () => {
    if (!isTextMatch || !isMfaValid) return;

    setLoading(true);
    setError('');

    try {
      // Simula um leve delay de checagem do OTP no backend
      await new Promise((resolve) => setTimeout(resolve, 800));
      onConfirm();
      handleClose();
    } catch {
      setError('Código MFA Inválido ou Expirado.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setInputText('');
    setMfaCode('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
        <Iconify icon={'eva:shield-fill' as any} width={24} />
        Ação Nuclear Detectada: {actionName}
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <Alert
            severity="error"
            variant="filled"
            icon={<Iconify icon={'eva:alert-triangle-fill' as any} />}
          >
            Você está prestes a realizar uma operação destrutiva no Cofre. Isso pode afetar serviços
            em produção (Explosion Radius).
          </Alert>

          <Box>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Para confirmar sua ciência, digite{' '}
              <Box
                component="span"
                sx={{ fontWeight: 'bold', userSelect: 'all', color: 'error.main' }}
              >
                {expectedText}
              </Box>{' '}
              abaixo:
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder={expectedText}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              error={inputText.length > 0 && !isTextMatch}
            />
          </Box>

          <Box>
            <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
              Autenticação de Passo-Elevado (MFA / 2FA):
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="000000"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              disabled={!isTextMatch}
              type="text"
              inputMode="numeric"
              slotProps={{
                input: {
                  startAdornment: (
                    <Iconify
                      icon={'eva:smartphone-outline' as any}
                      sx={{ color: 'text.disabled', mr: 1 }}
                    />
                  ),
                },
              }}
            />
          </Box>

          {error && (
            <Typography color="error" variant="caption">
              {error}
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button variant="outlined" color="inherit" onClick={handleClose} disabled={loading}>
          Abortar
        </Button>
        <Button
          variant="contained"
          color="error"
          disabled={!isTextMatch || !isMfaValid || loading}
          onClick={handleConfirm}
          startIcon={
            loading ? (
              <Iconify
                icon={'eva:loader-outline' as any}
                sx={{ animation: 'spin 2s linear infinite' }}
              />
            ) : null
          }
        >
          {loading ? 'Verificando MFA...' : 'Confirmar Execução Nuclear'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
