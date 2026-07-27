import { Box, Alert, Typography } from '@mui/material';

import { CONFIG } from 'src/global-config';

const metadata = { title: `E-mail - ${CONFIG.appName}` };

export default function EmailPage() {
  return (
    <>
      <title>{metadata.title}</title>
      <Box sx={{ p: 5 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          E-mail (Transacional e Marketing)
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>Arquitetura ASoT:</strong> Esta página é um STUB estrutural. A interface de disparo de e-mails será acoplada quando o backend for expandido.
        </Alert>
      </Box>
    </>
  );
}
