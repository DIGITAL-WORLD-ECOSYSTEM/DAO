'use client';

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

const staticEconomiaPosts = [
  {
    id: 'e1',
    title: 'Bitcoin rompe barreira histórica: O que esperar para o próximo trimestre?',
    category: 'Economia',
    coverUrl: '/assets/images/mock/cover/cover-1.webp',
    createdAt: new Date(),
    duration: '8 min de leitura',
    author: { name: 'Equipe DEX', avatarUrl: '/assets/images/mock/avatar/avatar-1.webp' },
  },
  {
    id: 'e2',
    title: 'Inflação Global e Bitcoin: A reserva de valor definitiva?',
    category: 'Economia',
    coverUrl: '/assets/images/mock/cover/cover-2.webp',
    createdAt: new Date(),
    duration: '5 min de leitura',
    author: { name: 'Equipe DEX', avatarUrl: '/assets/images/mock/avatar/avatar-2.webp' },
  },
  {
    id: 'e3',
    title: 'O impacto das taxas de juros do FED no mercado cripto',
    category: 'Economia',
    coverUrl: '/assets/images/mock/cover/cover-3.webp',
    createdAt: new Date(),
    duration: '12 min de leitura',
    author: { name: 'Equipe DEX', avatarUrl: '/assets/images/mock/avatar/avatar-3.webp' },
  },
  {
    id: 'e4',
    title: 'Tokenização de Ativos Reais (RWA): O futuro da economia global',
    category: 'Economia',
    coverUrl: '/assets/images/mock/cover/cover-4.webp',
    createdAt: new Date(),
    duration: '7 min de leitura',
    author: { name: 'Equipe DEX', avatarUrl: '/assets/images/mock/avatar/avatar-4.webp' },
  },
  {
    id: 'e5',
    title: 'Dólar Digital vs. Euro Digital: A corrida das CBDCs',
    category: 'Economia',
    coverUrl: '/assets/images/mock/cover/cover-5.webp',
    createdAt: new Date(),
    duration: '9 min de leitura',
    author: { name: 'Equipe DEX', avatarUrl: '/assets/images/mock/avatar/avatar-5.webp' },
  },
  {
    id: 'e6',
    title: 'Análise Macro: Como a recessão técnica afeta o DeFi',
    category: 'Economia',
    coverUrl: '/assets/images/mock/cover/cover-6.webp',
    createdAt: new Date(),
    duration: '6 min de leitura',
    author: { name: 'Equipe DEX', avatarUrl: '/assets/images/mock/avatar/avatar-6.webp' },
  },
  {
    id: 'e7',
    title: 'A Web3 pode resolver a crise da cadeia de suprimentos global?',
    category: 'Economia',
    coverUrl: '/assets/images/mock/cover/cover-7.webp',
    createdAt: new Date(),
    duration: '10 min de leitura',
    author: { name: 'Equipe DEX', avatarUrl: '/assets/images/mock/avatar/avatar-7.webp' },
  },
];

// ----------------------------------------------------------------------

export function Economia() {
  const theme = useTheme();
  const viewPosts = staticEconomiaPosts;

  const cardStyle = {
    position: 'relative',
    borderRadius: 2,
    overflow: 'hidden',
    bgcolor: alpha('#020817', 0.8),
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    transition: theme.transitions.create(['all']),
    // BORDA REATIVA PADRONIZADA (Ciano -> Âmbar)
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
      boxShadow: `0 0 25px 0 ${alpha(theme.palette.info.main, 0.2)}`,
    },
  };

  return (
    <Box
      id="economia"
      component="section"
      sx={{
        position: 'relative',
        bgcolor: 'transparent',
        py: { xs: 10, md: 15 },
        overflow: 'hidden',
      }}
    >
      <Container component={MotionViewport}>
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
            Economia
          </Typography>
        </m.div>

        <Grid container spacing={4}>
          {/* Desktop: Destaques (Primeiros 3) */}
          {viewPosts.slice(0, 3).map((post: any, index: number) => (
            <Grid
              key={`eco-top-${post.id}-${index}`}
              sx={{ display: { xs: 'none', lg: 'block' } }}
              size={{
                xs: 12,
                sm: 6,
                md: 4,
                lg: index === 0 ? 6 : 3,
              }}
            >
              <m.div variants={varFade('inUp')}>
                <Box sx={cardStyle}>
                  <PostItemLatest
                    post={post}
                    index={index}
                    detailsHref={paths.post.details(post.title)}
                  />
                </Box>
              </m.div>
            </Grid>
          ))}

          {/* Mobile/Tablet: Destaques (Primeiros 3) */}
          {viewPosts.slice(0, 3).map((post: any, index: number) => (
            <Grid
              key={`eco-mb-${post.id}-${index}`}
              sx={{ display: { lg: 'none' } }}
              size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
            >
              <m.div variants={varFade('inUp')}>
                <Box sx={cardStyle}>
                  <PostItem post={post} detailsHref={paths.post.details(post.title)} />
                </Box>
              </m.div>
            </Grid>
          ))}

          {/* Lista Restante (Posts 4 a 7) */}
          {viewPosts.slice(3, 7).map((post: any, index: number) => (
            <Grid
              key={`eco-list-${post.id}-${index}`}
              size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
            >
              <m.div variants={varFade('inUp')}>
                <Box sx={cardStyle}>
                  <PostItem post={post} detailsHref={paths.post.details(post.title)} />
                </Box>
              </m.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}