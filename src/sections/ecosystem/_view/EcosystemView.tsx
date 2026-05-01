'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { alpha } from '@mui/material/styles';

import { HomeBackground } from 'src/components/background';

// ----------------------------------------------------------------------

export function EcosystemView() {
  return (
    <>
      <HomeBackground />

      <Box component="main" sx={{ position: 'relative', zIndex: 1, py: 12 }}>
        <Container>
          <Box sx={{ mb: 10, textAlign: 'center' }}>
            <Typography variant="h1" sx={{ mb: 3 }}>Ecossistema ASPPIBRA</Typography>
            <Typography variant="h4" sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto' }}>
              Uma infraestrutura completa que conecta o mundo físico à liquidez global da Web3.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ p: 4, borderRadius: 3, bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05), border: (theme) => `1px solid ${theme.palette.primary.main}` }}>
                <Typography variant="h3" color="primary.main" sx={{ mb: 2 }}>RWA Tokenization</Typography>
                <Typography variant="body1">Transformação de ativos reais do agronegócio em representações digitais fracionadas e líquidas.</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ p: 4, borderRadius: 3, bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.05), border: (theme) => `1px solid ${theme.palette.secondary.main}` }}>
                <Typography variant="h3" color="secondary.main" sx={{ mb: 2 }}>DAO Governance</Typography>
                <Typography variant="body1">Decisões democráticas e transparentes tomadas pelos detentores de governança on-chain.</Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ p: 4, borderRadius: 3, bgcolor: (theme) => alpha(theme.palette.info.main, 0.05), border: (theme) => `1px solid ${theme.palette.info.main}` }}>
                <Typography variant="h3" color="info.main" sx={{ mb: 2 }}>DeFi Integration</Typography>
                <Typography variant="body1">Conexão direta com protocolos de empréstimo e liquidez no ecossistema Arbitrum/Polygon.</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
