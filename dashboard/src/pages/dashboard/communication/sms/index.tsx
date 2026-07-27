import { Box, Alert, Typography } from '@mui/material';

import { CONFIG } from 'src/global-config';

const metadata = { title: `SMS - ${CONFIG.appName}` };

export default function SmsPage() {
  return (
    <>
      <title>{metadata.title}</title>
      <Box sx={{ p: 5 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          SMS (OTP e Alertas Críticos)
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>Arquitetura ASoT:</strong> Esta página é um STUB estrutural. O ASoT define que SMS não é mandatório para o lançamento inicial do app.
        </Alert>
      </Box>
    </>
  );
}
