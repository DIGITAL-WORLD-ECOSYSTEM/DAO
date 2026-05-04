'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';

import { useTranslate } from 'src/locales';
import { HomeBackground } from 'src/components/background';

// ----------------------------------------------------------------------

export function AboutView() {
  const { t } = useTranslate();

  const values = (t('about.values', { returnObjects: true }) as {
    title: string;
    description: string;
  }[]) || [];
  return (
    <>
      <HomeBackground />

      <Box component="main" sx={{ position: 'relative', zIndex: 1, py: 10 }}>
        <Container>
          {/* HERO SECTION */}
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography variant="h1" sx={{ mb: 3, fontWeight: 900 }}>
              Sobre a <Box component="span" sx={{ color: 'primary.main' }}>ASPPIBRA DAO</Box>
            </Typography>
            <Typography variant="h4" sx={{ color: 'text.secondary', maxWidth: 800, mx: 'auto' }}>
              Transformando a relação entre a terra e o capital através da tecnologia Blockchain.
            </Typography>
          </Box>

          {/* MISSION / VISION / VALUES */}
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  p: 5,
                  borderRadius: 3,
                  bgcolor: (theme) => alpha(theme.palette.grey[900], 0.4),
                  backdropFilter: 'blur(10px)',
                  border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                <Typography variant="h3" sx={{ mb: 2, color: 'primary.main' }}>
                  {t('about.mission.title')}
                </Typography>
                <Typography variant="body1" sx={{ fontSize: 18 }}>
                  {t('about.mission.content')}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  p: 5,
                  borderRadius: 3,
                  bgcolor: (theme) => alpha(theme.palette.grey[900], 0.4),
                  backdropFilter: 'blur(10px)',
                  border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                <Typography variant="h3" sx={{ mb: 2, color: 'secondary.main' }}>
                  {t('about.vision.title')}
                </Typography>
                <Typography variant="body1" sx={{ fontSize: 18 }}>
                  {t('about.vision.content')}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* VALUES GRID */}
          <Box sx={{ mt: 10 }}>
            <Typography variant="h2" sx={{ textAlign: 'center', mb: 6 }}>
              Nossos Valores
            </Typography>
            <Grid container spacing={3}>
              {values.map((value) => (
                <Grid key={value.title} size={{ xs: 12, sm: 4 }}>
                  <Card
                    sx={{
                      p: 4,
                      height: 1,
                      textAlign: 'center',
                      bgcolor: 'transparent',
                      border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                  >
                    <Typography variant="h5" sx={{ mb: 2 }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {value.description}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
}
