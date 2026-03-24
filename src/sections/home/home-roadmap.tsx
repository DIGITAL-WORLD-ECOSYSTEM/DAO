'use client';

// ----------------------------------------------------------------------
import type { BoxProps } from '@mui/material/Box';

import { useMemo } from 'react';
import { m } from 'framer-motion';

// ----------------------------------------------------------------------
// MUI
// ----------------------------------------------------------------------
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------
// APP
// ----------------------------------------------------------------------
import { useTranslate } from 'src/locales';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

type RoadmapPhase = {
  phase: string;
  time: string;
  title: string;
  description: string;
  color: 'info' | 'secondary' | 'error' | 'warning';
};

export function HomeRoadmap({ sx, ...other }: BoxProps) {
  const theme = useTheme();
  const { t } = useTranslate();

  const ROADMAP_PHASES: RoadmapPhase[] = useMemo(
    () => [
      {
        phase: t('roadmap.phases.p1.label'),
        time: t('roadmap.phases.p1.time'),
        title: t('roadmap.phases.p1.title'),
        description: t('roadmap.phases.p1.description'),
        color: 'info',
      },
      {
        phase: t('roadmap.phases.p2.label'),
        time: t('roadmap.phases.p2.time'),
        title: t('roadmap.phases.p2.title'),
        description: t('roadmap.phases.p2.description'),
        color: 'secondary',
      },
      {
        phase: t('roadmap.phases.p3.label'),
        time: t('roadmap.phases.p3.time'),
        title: t('roadmap.phases.p3.title'),
        description: t('roadmap.phases.p3.description'),
        color: 'error',
      },
      {
        phase: t('roadmap.phases.p4.label'),
        time: t('roadmap.phases.p4.time'),
        title: t('roadmap.phases.p4.title'),
        description: t('roadmap.phases.p4.description'),
        color: 'warning',
      },
    ],
    [t]
  );

  return (
    <Box
      id="roadmap"
      component="section"
      sx={[
        {
          py: { xs: 10, md: 15 },
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'transparent',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <MotionViewport>
        <Container sx={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          
          {/* Badge Padronizada */}
          <m.div variants={varFade('inUp')}>
            <Box
              sx={{
                display: 'inline-block',
                border: `1px solid ${theme.palette.info.main}`,
                borderRadius: 2,
                px: 1.5,
                py: 0.5,
                mb: 5,
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'info.main',
                }}
              >
                {t('roadmap.badge')}
              </Typography>
            </Box>
          </m.div>

          {/* Título Scifi */}
          <m.div variants={varFade('inUp')}>
            <Typography
              component="h2"
              sx={{
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 900,
                fontSize: { xs: '2.2rem', md: '3rem' },
                letterSpacing: '0.08em',
                lineHeight: 1.2,
                textTransform: 'uppercase',
              }}
            >
              <Box component="span" sx={{ color: 'common.white' }}>
                {t('roadmap.title')}
              </Box>
              <Box component="span" sx={{ color: 'warning.main', ml: { xs: 0, md: 1.5 }, display: { xs: 'block', md: 'inline' } }}>
                {t('roadmap.title_highlight')}
              </Box>
            </Typography>
          </m.div>

          {/* Subtítulo Técnico */}
          <m.div variants={varFade('inUp')}>
            <Typography
              sx={{
                mt: 3,
                mx: 'auto',
                maxWidth: 560,
                fontFamily: "'Public Sans', sans-serif",
                fontSize: { xs: 16, md: 18 },
                lineHeight: 1.7,
                color: '#919EAB',
              }}
            >
              {t('roadmap.description')}
            </Typography>
          </m.div>

          {/* Grid de Fases com Bordas Reativas */}
          <Grid
            container
            display="grid"
            gridTemplateColumns={{ xs: '1fr', md: '1fr 64px 1fr' }}
            rowGap={{ xs: 6, md: 8 }}
            columnGap={6}
            sx={{ mt: { xs: 8, md: 10 } }}
          >
            {ROADMAP_PHASES.map((item, index) => {
              const isEven = index % 2 === 0;
              const cardColor = theme.palette[item.color].main;

              return (
                <Grid
                  key={item.title}
                  gridColumn={{ xs: '1 / -1', md: isEven ? '1 / 2' : '3 / 4' }}
                  gridRow={{ md: index + 1 }}
                  sx={{ textAlign: { xs: 'center', md: isEven ? 'right' : 'left' } }}
                >
                  <m.div variants={isEven ? varFade('inRight') : varFade('inLeft')}>
                    <Card
                      sx={{
                        p: 4,
                        borderRadius: 3,
                        display: 'inline-block',
                        width: '100%',
                        maxWidth: 400,
                        position: 'relative',
                        bgcolor: alpha('#020817', 0.8),
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        transition: theme.transitions.create(['all']),
                        
                        // BORDA REATIVA COLORIDA (BASEADA NA FASE)
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          inset: 0,
                          borderRadius: 'inherit',
                          padding: '1px',
                          background: `linear-gradient(180deg, 
                            ${alpha(cardColor, 0.8)} 0%, 
                            ${alpha(theme.palette.common.white, 0.05)} 50%, 
                            ${alpha(cardColor, 0.8)} 100%
                          )`,
                          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          WebkitMaskComposite: 'xor',
                          maskComposite: 'exclude',
                          zIndex: 2,
                        },

                        boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.4)}`,

                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: `0 0 25px 0 ${alpha(cardColor, 0.3)}`,
                          bgcolor: alpha('#020817', 0.95),
                        },
                      }}
                    >
                      {/* Phase + Time: Orbitron */}
                      <Typography
                        component="div"
                        sx={{
                          fontFamily: "'Orbitron', sans-serif",
                          fontSize: 12,
                          fontWeight: 700,
                          letterSpacing: '0.14em',
                          textTransform: 'uppercase',
                          color: cardColor,
                          zIndex: 3,
                          position: 'relative'
                        }}
                      >
                        {item.phase} • {item.time}
                      </Typography>

                      {/* Title: Orbitron */}
                      <Typography
                        component="h3"
                        sx={{
                          mt: 1,
                          mb: 2,
                          fontFamily: "'Orbitron', sans-serif",
                          fontWeight: 800,
                          fontSize: { xs: 18, md: 22 },
                          letterSpacing: '0.04em',
                          color: 'common.white',
                          zIndex: 3,
                          position: 'relative'
                        }}
                      >
                        {item.title}
                      </Typography>

                      {/* Description: Public Sans */}
                      <Typography
                        sx={{
                          fontFamily: "'Public Sans', sans-serif",
                          fontSize: 15,
                          lineHeight: 1.75,
                          color: '#919EAB',
                          zIndex: 3,
                          position: 'relative'
                        }}
                      >
                        {item.description}
                      </Typography>
                    </Card>
                  </m.div>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </MotionViewport>
    </Box>
  );
}