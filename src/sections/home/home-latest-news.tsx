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
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------
// APP
// ----------------------------------------------------------------------
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';

import { _mock } from 'src/_mock';
import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export function HomeLatestNews({ sx, ...other }: BoxProps) {
  const theme = useTheme();
  const { t } = useTranslate();

  const displayPosts = useMemo(
    () => [
      {
        id: 'post-1',
        title: t('news.posts.post1.title'),
        coverUrl: _mock.image.cover(4),
        createdAt: new Date().toISOString(),
      },
      {
        id: 'post-2',
        title: t('news.posts.post2.title'),
        coverUrl: _mock.image.cover(5),
        createdAt: new Date().toISOString(),
      },
      {
        id: 'post-3',
        title: t('news.posts.post3.title'),
        coverUrl: _mock.image.cover(6),
        createdAt: new Date().toISOString(),
      },
    ],
    [t]
  );

  return (
    <Box
      component="section"
      sx={[
        {
          py: { xs: 8, md: 15 },
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'transparent',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <MotionViewport>
        <Container sx={{ position: 'relative', zIndex: 9 }}>

          {/* HEADER: TÍTULO À ESQUERDA + BOTÃO À DIREITA */}
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
                    sx={{
                      fontFamily: "'Orbitron', sans-serif",
                      fontWeight: 700,
                      fontSize: 12,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'info.main',
                    }}
                  >
                    {t('news.badge')}
                  </Typography>
                </Box>
              </m.div>

              <m.div variants={varFade('inUp')}>
                <Typography
                  sx={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontWeight: 900,
                    fontSize: { xs: '2.2rem', md: '3rem' },
                    lineHeight: 1.1,
                    textTransform: 'uppercase',
                  }}
                >
                  <Box component="span" sx={{ color: 'common.white' }}>
                    {t('news.title')}
                  </Box>
                  <br />
                  <Box component="span" sx={{ color: alpha(theme.palette.common.white, 0.5), mr: 1.5 }}>
                    {t('news.title_bridge')}
                  </Box>
                  <Box component="span" sx={{ color: 'warning.main' }}>
                    {t('news.title_highlight')}
                  </Box>
                </Typography>
              </m.div>
            </Box>

            {/* BOTÃO CRYSTAL ATUALIZADO */}
            <m.div variants={varFade('inRight')}>
              <Button
                component={RouterLink}
                href={paths.post.root}
                endIcon={<Iconify icon="solar:double-alt-arrow-right-bold-duotone" />}
                sx={{
                  height: 56,
                  px: 4,
                  borderRadius: 1.5,
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'common.white',
                  border: 'none', // Remove borda padrão
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
                  }
                }}
              >
                {t('news.button_view_all')}
              </Button>
            </m.div>
          </Stack>

          {/* GRID COM BORDAS REATIVAS NOS CARDS */}
          <Grid container spacing={4}>
            {displayPosts.map((post, index) => (
              <Grid
                key={post.id}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                  lg: index === 0 ? 6 : 3,
                }}
              >
                <m.div variants={varFade('inUp')} transition={{ delay: index * 0.2 }}>
                  <Card
                    sx={{
                      position: 'relative',
                      height: 420,
                      borderRadius: 3,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      bgcolor: alpha('#020817', 0.8),
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      transition: theme.transitions.create(['all'], {
                        duration: theme.transitions.duration.standard,
                      }),
                      
                      // BORDA REATIVA (CIANO -> ÂMBAR)
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 'inherit',
                        padding: '1px',
                        background: `linear-gradient(180deg, 
                          ${alpha(theme.palette.info.main, 0.8)} 0%, 
                          ${alpha(theme.palette.common.white, 0.05)} 50%, 
                          ${alpha(theme.palette.warning.main, 0.8)} 100%
                        )`,
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                        zIndex: 3,
                        pointerEvents: 'none',
                      },

                      boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.5)}`,

                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 0 25px 0 ${alpha(theme.palette.info.main, 0.2)}`,
                        '& img': { transform: 'scale(1.1)' },
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={post.coverUrl}
                      alt={post.title}
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        width: 1,
                        height: 1,
                        objectFit: 'cover',
                        transition: 'transform 0.6s ease',
                      }}
                    />

                    {/* Overlay para profundidade e legibilidade */}
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 1,
                        background: `linear-gradient(180deg, transparent 40%, ${alpha('#020817', 0.95)} 100%)`,
                      }}
                    />

                    <Stack
                      spacing={1.5}
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        p: 4,
                        width: 1,
                        zIndex: 4,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#919EAB', // Texto Secundário padronizado
                          fontFamily: "'Public Sans', sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        {fDate(post.createdAt)}
                      </Typography>

                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: index === 0 ? 24 : 18,
                          color: 'common.white',
                          lineHeight: 1.2,
                          fontFamily: "'Orbitron', sans-serif",
                          textTransform: 'uppercase', // Estética Scifi
                        }}
                      >
                        {post.title}
                      </Typography>
                    </Stack>
                  </Card>
                </m.div>
              </Grid>
            ))}
          </Grid>

        </Container>
      </MotionViewport>
    </Box>
  );
}