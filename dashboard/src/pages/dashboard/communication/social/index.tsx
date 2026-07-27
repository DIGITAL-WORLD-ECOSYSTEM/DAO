import { Box, Alert, Typography } from '@mui/material';

import { CONFIG } from 'src/global-config';

const metadata = { title: `Redes Sociais - ${CONFIG.appName}` };

export default function SocialPage() {
  return (
    <>
      <title>{metadata.title}</title>
      <Box sx={{ p: 5 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Redes Sociais (Social Hub)
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>Arquitetura ASoT:</strong> Esta página é um STUB estrutural aguardando integração OAuth2.0 para publicação externa.
        </Alert>
      </Box>
    </>
  );
}
