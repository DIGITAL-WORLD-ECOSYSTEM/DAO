import { Box, Alert, Typography } from '@mui/material';

import { CONFIG } from 'src/global-config';

const metadata = { title: `WhatsApp - ${CONFIG.appName}` };

export default function WhatsAppPage() {
  return (
    <>
      <title>{metadata.title}</title>
      <Box sx={{ p: 5 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          WhatsApp (Disparos e Atendimento)
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>Arquitetura ASoT:</strong> Esta página é um STUB estrutural (Feature Creep evitado no MVP). Será desenvolvida em fase posterior (Integração Meta).
        </Alert>
      </Box>
    </>
  );
}
