import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  actionTitle?: string;
  requireKeyword?: string;
};

export function BankingStepUpModal({
  open,
  onClose,
  onSuccess,
  actionTitle = 'Confirme sua Identidade',
  requireKeyword,
}: Props) {
  const [password, setPassword] = useState('');
  const [keyword, setKeyword] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const handleReset = useCallback(() => {
    setPassword('');
    setKeyword('');
    setAttempts(0);
    setIsLocked(false);
  }, []);

  const handleClose = useCallback(() => {
    handleReset();
    onClose();
  }, [handleReset, onClose]);

  const handleSubmit = useCallback(() => {
    if (isLocked) return;

    // Simulate validation
    const isPasswordValid = password === 'admin' || password === '1234';
    const isKeywordValid = requireKeyword ? keyword === requireKeyword : true;

    if (isPasswordValid && isKeywordValid) {
      handleReset();
      onSuccess();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      if (newAttempts >= 5) {
        setIsLocked(true);
      }
    }
  }, [password, keyword, attempts, isLocked, requireKeyword, handleReset, onSuccess]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Iconify
          icon={'solar:shield-warning-bold-duotone' as any}
          width={24}
          sx={{ color: 'warning.main' }}
        />
        {actionTitle}
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Para continuar com esta ação sensível, precisamos confirmar sua identidade através de
          Step-Up Authentication (MOCK).
        </Typography>

        {isLocked ? (
          <Box
            sx={{
              p: 2,
              bgcolor: 'error.lighter',
              color: 'error.darker',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Iconify icon={'solar:danger-circle-bold' as any} width={24} />
            Rate Limit Excedido: Muitas tentativas falhas. Conta bloqueada temporariamente.
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              fullWidth
              autoFocus
              type="password"
              label="Senha de Administrador (mock: admin)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={attempts > 0}
              helperText={attempts > 0 ? `Senha incorreta. Tentativa ${attempts} de 5.` : ''}
            />

            {requireKeyword && (
              <TextField
                fullWidth
                label={`Digite "${requireKeyword}" para confirmar`}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                error={attempts > 0 && keyword !== requireKeyword}
              />
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isLocked || !password || (!!requireKeyword && !keyword)}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
