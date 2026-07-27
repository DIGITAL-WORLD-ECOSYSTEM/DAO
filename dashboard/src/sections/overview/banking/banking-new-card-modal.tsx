import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: () => void;
  onEmit: (type: 'physical' | 'virtual_recurring' | 'virtual_disposable') => void;
};

export function BankingNewCardModal({ open, onClose, onEmit }: Props) {
  const [selectedType, setSelectedType] = useState<
    'physical' | 'virtual_recurring' | 'virtual_disposable' | null
  >(null);

  const OPTIONS = [
    {
      value: 'physical',
      label: 'Cartão Físico',
      description: 'Cartão de plástico entregue no seu endereço. Ideal para compras presenciais.',
      icon: 'solar:card-bold-duotone',
      color: 'info',
    },
    {
      value: 'virtual_recurring',
      label: 'Virtual Recorrente',
      description: 'Múltiplos usos. Perfeito para assinaturas, Netflix, AWS e compras online.',
      icon: 'solar:monitor-smartphone-bold-duotone',
      color: 'primary',
    },
    {
      value: 'virtual_disposable',
      label: 'Virtual Descartável',
      description: 'Uso único. O número se autodestrói após a primeira compra. Foco em segurança.',
      icon: 'solar:shield-warning-bold-duotone',
      color: 'warning',
    },
  ] as const;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Qual tipo de cartão você precisa?</DialogTitle>

      <DialogContent sx={{ pb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          {OPTIONS.map((opt) => (
            <Card
              key={opt.value}
              onClick={() => setSelectedType(opt.value)}
              sx={{
                p: 2.5,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                cursor: 'pointer',
                border: (theme) =>
                  `2px solid ${selectedType === opt.value ? theme.palette[opt.color].main : 'transparent'}`,
                bgcolor: (theme) =>
                  selectedType === opt.value ? theme.palette.action.selected : 'background.paper',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: (theme) => theme.customShadows.z8,
                },
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: `${opt.color}.lighter`,
                  color: `${opt.color}.darker`,
                }}
              >
                <Iconify icon={opt.icon as any} width={24} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1">{opt.label}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {opt.description}
                </Typography>
              </Box>
            </Card>
          ))}
        </Box>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button color="inherit" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!selectedType}
            onClick={() => {
              if (selectedType) {
                onEmit(selectedType);
                onClose();
              }
            }}
          >
            Emitir Cartão
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
