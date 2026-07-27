import { useState } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type PriorityAlert = {
  id: string;
  severity: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  actionRoute?: string;
};

const _mockAlerts: PriorityAlert[] = [
  {
    id: 'alt-1',
    severity: 'error',
    title: 'Manutenção Programada',
    message: 'O sistema de saques Pix ficará indisponível no sábado das 02h às 04h.',
  },
  {
    id: 'alt-2',
    severity: 'warning',
    title: 'Assembleia Extraordinária',
    message: 'Faltam apenas 2 dias para o fechamento de pautas da próxima assembleia.',
  },
];

export function AppPriorityAlerts() {
  const [alerts, setAlerts] = useState<PriorityAlert[]>(_mockAlerts);

  const handleDismiss = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  if (!alerts.length) return null;

  return (
    <Stack spacing={2} sx={{ mb: 3 }}>
      {alerts.map((alert) => (
        <Collapse key={alert.id} in>
          <Alert
            severity={alert.severity}
            onClose={() => handleDismiss(alert.id)}
            action={
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button color="inherit" size="small" onClick={() => handleDismiss(alert.id)}>
                  Marcar Lida
                </Button>
              </Box>
            }
            sx={{
              display: 'flex',
              alignItems: 'center',
              '& .MuiAlert-message': {
                flexGrow: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
            }}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                {alert.title}
              </Typography>
              <Typography variant="body2">{alert.message}</Typography>
            </Box>
          </Alert>
        </Collapse>
      ))}
    </Stack>
  );
}
