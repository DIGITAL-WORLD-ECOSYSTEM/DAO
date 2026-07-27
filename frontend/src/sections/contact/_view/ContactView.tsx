'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';

import { HomeBackground } from 'src/components/background';

// ----------------------------------------------------------------------

export function ContactView() {
  return (
    <>
      <HomeBackground />

      <Box component="main" sx={{ position: 'relative', zIndex: 1, py: 10 }}>
        <Container>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="h1" sx={{ mb: 2 }}>Entre em Contato</Typography>
            <Typography variant="h5" sx={{ color: 'text.secondary' }}>
              Estamos prontos para ouvir suas propostas e tirar suas dúvidas sobre a governança ASPPIBRA.
            </Typography>
          </Box>

          <Grid container spacing={5}>
            {/* CONTACT FORM */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{ p: 4, borderRadius: 3, bgcolor: (theme) => alpha(theme.palette.grey[900], 0.4), backdropFilter: 'blur(10px)', border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                <Stack spacing={3}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth label="Nome Completo" variant="outlined" />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField fullWidth label="E-mail" variant="outlined" />
                    </Grid>
                  </Grid>
                  <TextField fullWidth label="Assunto" variant="outlined" />
                  <TextField fullWidth label="Sua Mensagem" multiline rows={4} variant="outlined" />
                  <Button variant="contained" size="large" color="primary" sx={{ py: 2 }}>
                    Enviar Mensagem
                  </Button>
                </Stack>
              </Box>
            </Grid>

            {/* INFO & CHANNELS */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack spacing={4}>
                <Box>
                  <Typography variant="h4" sx={{ mb: 1 }}>Escritório Paraty</Typography>
                  <Typography variant="body1" color="text.secondary">
                    Centro Histórico, Paraty - RJ, Brasil<br />
                    Atendimento à Governança Local.
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ mb: 1 }}>E-mail Institucional</Typography>
                  <Typography variant="body1" color="text.secondary">
                    contato@asppibra.com
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4" sx={{ mb: 1 }}>Comunidade On-Chain</Typography>
                  <Typography variant="body1" color="text.secondary">
                    Participe das discussões técnicas em nosso Discord e Telegram oficiais.
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
