import { Box, Alert, Typography } from '@mui/material';

import { CONFIG } from 'src/global-config';

const metadata = { title: `Configurações - ${CONFIG.appName}` };

export default function SettingsPage() {
  return (
    <>
      <title>{metadata.title}</title>
      <Box sx={{ p: 5 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Configurações (Preferências e LGPD)
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>Arquitetura ASoT:</strong> Esta página é um STUB estrutural aguardando a criação da tabela `notification_preferences` no banco de dados.
        </Alert>
      </Box>
    </>
  );
}
