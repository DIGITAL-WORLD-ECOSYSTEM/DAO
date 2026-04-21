'use client';

import type { IPostItem } from 'src/types/blog';

// ----------------------------------------------------------------------
// Imports — Tipos e Motion
// ----------------------------------------------------------------------
import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';

import { varFade, MotionViewport } from 'src/components/animate';

import { PostItem, PostItemLatest } from './item';

// ----------------------------------------------------------------------

type Props = {
  posts: IPostItem[];
};

export function Geopolitica({ posts }: Props) {
  const theme = useTheme();
  
  const viewPosts = posts.filter(post => post.category === 'Geopolítica');

  if (viewPosts.length === 0) return null;

  // Estilização Crystal Padronizada para os Cards
  const cardWrapperStyle = {
    position: 'relative',
    borderRadius: 2,
    overflow: 'hidden',
    bgcolor: alpha('#020817', 0.8),
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    transition: theme.transitions.create(['all']),

    // Borda Reativa de 1px (Assinatura 2026)
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
      zIndex: 2,
    },
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: `0 0 25px 0 ${alpha(theme.palette.info.main, 0.25)}`,
    },
  };

  return (
    <Box
      id="geopolitica"
      component="section"
      sx={{
        position: 'relative',
        bgcolor: 'transparent',
        py: { xs: 10, md: 15 },
        overflow: 'hidden',
        // Injeção da fonte Public Sans para leitura técnica
        '& .MuiTypography-root:not(h2)': {
          fontFamily: "'Public Sans', sans-serif",
        },
      }}
    >
      <Container component={MotionViewport}>
        {/* Título com Orbitron + Glow */}
        <m.div variants={varFade('inDown')}>
          <Typography
            variant="h2"
            sx={{
              mb: 8,
              textAlign: 'center',
              fontWeight: 900,
              fontFamily: "'Orbitron', sans-serif",
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'common.white',
              textShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.35)}`,
            }}
          >
            Geopolítica
          </Typography>
        </m.div>

        <Grid container spacing={4}>
          {/* Desktop: Destaques (Primeiros 3) */}
          {viewPosts.slice(0, 3).map((post, index) => (
            <Grid
              key={`geo-top-${post.id}-${index}`}
              sx={{ display: { xs: 'none', lg: 'block' } }}
              size={{
                xs: 12,
                sm: 6,
                md: 4,
                lg: index === 0 ? 6 : 3,
              }}
            >
              <m.div variants={varFade('inUp')}>
                <Box sx={cardWrapperStyle}>
                  <PostItemLatest
                    post={post as any}
                    index={index}
                    detailsHref={paths.post.details(post.title)}
                  />
                </Box>
              </m.div>
            </Grid>
          ))}

          {/* Mobile/Tablet: Destaques (Primeiros 3) */}
          {viewPosts.slice(0, 3).map((post, index) => (
            <Grid
              key={`geo-mb-${post.id}-${index}`}
              sx={{ display: { lg: 'none' } }}
              size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
            >
              <m.div variants={varFade('inUp')}>
                <Box sx={cardWrapperStyle}>
                  <PostItem post={post as any} detailsHref={paths.post.details(post.title)} />
                </Box>
              </m.div>
            </Grid>
          ))}

          {/* Lista Restante (Posts 4 a 7) */}
          {viewPosts.slice(3, 7).map((post, index) => (
            <Grid key={`geo-list-${post.id}-${index}`} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <m.div variants={varFade('inUp')}>
                <Box sx={cardWrapperStyle}>
                  <PostItem post={post as any} detailsHref={paths.post.details(post.title)} />
                </Box>
              </m.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
