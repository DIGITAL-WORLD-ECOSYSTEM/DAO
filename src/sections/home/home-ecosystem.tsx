'use client';

// ----------------------------------------------------------------------
// Imports — tipos e react/motion
// ----------------------------------------------------------------------
import type { BoxProps } from '@mui/material/Box';

import { useMemo } from 'react';
import { m } from 'framer-motion';

// ----------------------------------------------------------------------
// Imports — MUI
// ----------------------------------------------------------------------
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------
// Imports — App
// ----------------------------------------------------------------------
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export function HomeEcosystem({ sx, ...other }: BoxProps) {
  const theme = useTheme();
  const { t } = useTranslate();

  const ITEMS = useMemo(
    () => [
      {
        id: 'tech',
        title: t('ecosystem.items.tech.title'),
        description: t('ecosystem.items.tech.description'),
        icon: 'solar:programming-2-bold-duotone',
        color: theme.palette.primary.main,
      },
      {
        id: 'gov',
        title: t('ecosystem.items.gov.title'),
        description: t('ecosystem.items.gov.description'),
        icon: 'solar:shield-check-bold-duotone',
        color: theme.palette.info.main,
      },
      {
        id: 'business',
        title: t('ecosystem.items.business.title'),
        description: t('ecosystem.items.business.description'),
        icon: 'solar:lightbulb-bold-duotone',
        color: theme.palette.secondary.main,
      },
      {
        id: 'rwa',
        title: t('ecosystem.items.rwa.title'),
        description: t('ecosystem.items.rwa.description'),
        icon: 'solar:graph-up-bold-duotone',
        color: theme.palette.warning.main,
      },
    ],
    [theme, t]
  );

  return (
    <Box
      id="ecosystem"
      component="section"
      sx={[
        {
          position: 'relative',
          py: { xs: 8, md: 15 },
          overflow: 'hidden',
          bgcolor: 'transparent',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <MotionViewport>
        <Container sx={{ position: 'relative', zIndex: 1 }}>
          
          {/* HEADER: TÍTULO E BOTÃO CRYSTAL */}
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ md: 'flex-end' }}
            justifyContent="space-between"
            sx={{ mb: 10, gap: 3 }}
          >
            <Box>
              <m.div variants={varFade('inUp')}>
                <Box
                  sx={{
                    display: 'inline-block',
                    border: `1px solid ${theme.palette.info.main}`,
                    borderRadius: 2,
                    px: 1.5,
                    py: 0.5,
                    mb: 4,
                  }}
                >
                  <Typography
                    component="span"
                    sx={{
                      fontFamily: "'Orbitron', sans-serif",
                      fontWeight: 700,
                      fontSize: 12,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'info.main',
                    }}
                  >
                    {t('ecosystem.badge') || 'ECOSYSTEM'}
                  </Typography>
                </Box>
              </m.div>

              <m.div variants={varFade('inUp')}>
                <Typography
                  component="h2"
                  sx={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontWeight: 900,
                    fontSize: { xs: '2.2rem', md: '3rem' },
                    letterSpacing: '0.05em',
                    lineHeight: 1.1,
                    textTransform: 'uppercase',
                  }}
                >
                  <Box component="span" sx={{ color: 'common.white' }}>
                    {t('ecosystem.title')}
                  </Box>
                  <br />
                  <Box component="span" sx={{ color: alpha(theme.palette.common.white, 0.5) }}>
                    {t('ecosystem.title_bridge')}
                  </Box>
                  <br />
                  <Box component="span" sx={{ color: 'warning.main' }}>
                    {t('ecosystem.title_highlight')}
                  </Box>
                </Typography>
              </m.div>
            </Box>

            {/* BOTÃO CRYSTAL / CIANO */}
            <m.div variants={varFade('inRight')}>
              <Button
                component={RouterLink}
                href={paths.dashboard.root}
                endIcon={<Iconify icon="solar:double-alt-arrow-right-bold-duotone" />}
                sx={{
                  height: 56,
                  px: 4,
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 700,
                  borderRadius: 1.5,
                  color: 'common.white',
                  textTransform: 'uppercase',
                  border: 'none',
                  position: 'relative',
                  bgcolor: alpha('#020817', 0.6),
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  transition: theme.transitions.create(['all']),
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 'inherit',
                    padding: '1px',
                    background: `linear-gradient(180deg, 
                      ${alpha(theme.palette.info.main, 1)} 0%, 
                      ${alpha(theme.palette.info.main, 0.1)} 50%, 
                      ${alpha(theme.palette.info.main, 0.6)} 100%
                    )`,
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  },
                  '&:hover': {
                    bgcolor: alpha(theme.palette.info.main, 0.08),
                    transform: 'scale(1.05)',
                    boxShadow: `0 0 20px 0 ${alpha(theme.palette.info.main, 0.3)}`,
                  },
                }}
              >
                {t('hero.buttons.ecossistema')}
              </Button>
            </m.div>
          </Stack>

          {/* GRID DE CARDS COM BORDAS REATIVAS POR ITEM */}
          <Grid container spacing={3}>
            {ITEMS.map((item) => (
              <Grid key={item.id} size={{ xs: 12, sm: 6, md: 3 }}>
                <m.div variants={varFade('inUp')} style={{ height: '100%' }}>
                  <Stack
                    spacing={3}
                    sx={{
                      p: 4,
                      height: 1,
                      borderRadius: 2.5,
                      position: 'relative',
                      bgcolor: alpha('#020817', 0.8),
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      transition: theme.transitions.create(['all']),
                      
                      // BORDA REATIVA (Stroke Colorizada por Item)
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 'inherit',
                        padding: '1px',
                        background: `linear-gradient(180deg, 
                          ${alpha(item.color, 0.8)} 0%, 
                          ${alpha(theme.palette.common.white, 0.05)} 50%, 
                          ${alpha(item.color, 0.8)} 100%
                        )`,
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                        zIndex: 2,
                      },

                      boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.4)}`,

                      '&:hover': {
                        transform: 'translateY(-8px)',
                        bgcolor: alpha('#020817', 0.95),
                        boxShadow: `0 0 25px 0 ${alpha(item.color, 0.25)}`,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 52,
                        height: 52,
                        borderRadius: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: item.color,
                        bgcolor: alpha(item.color, 0.12),
                        border: `1px solid ${alpha(item.color, 0.3)}`,
                        zIndex: 3,
                      }}
                    >
                      <Iconify icon={item.icon as any} width={28} />
                    </Box>

                    <Typography 
                      variant="h6" 
                      sx={{ 
                        color: 'common.white', 
                        fontFamily: "'Orbitron', sans-serif",
                        fontWeight: 800,
                        zIndex: 3 
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#919EAB', 
                        fontFamily: "'Public Sans', sans-serif",
                        lineHeight: 1.7,
                        zIndex: 3
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Stack>
                </m.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </MotionViewport>
    </Box>
  );
}