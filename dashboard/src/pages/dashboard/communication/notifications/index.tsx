import { Box, Alert, Typography } from '@mui/material';

import { CONFIG } from 'src/global-config';

const metadata = { title: `Central de Notificações - ${CONFIG.appName}` };

export default function NotificationsPage() {
  return (
    <>
      <title>{metadata.title}</title>
      <Box sx={{ p: 5 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Central de Notificações
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>Arquitetura ASoT:</strong> Esta página é um STUB estrutural. O banco de dados (P0) de Notificações ainda não foi implementado.
        </Alert>
      </Box>
    </>
  );
}
