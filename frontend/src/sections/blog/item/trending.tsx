'use client';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';

import { varFade, MotionViewport } from 'src/components/animate';

import { PostItem, PostItemLatest } from './item';

// ----------------------------------------------------------------------

const staticTrendingPosts = [
  {
    id: 'trend-1',
    title: 'Como a Prova de Conhecimento Zero (ZKP) está revolucionando a privacidade',
    category: 'Tecnologia',
    coverUrl: '/assets/images/mock/cover/cover-5.webp',
    createdAt: new Date(),
    duration: '10 min de leitura',
    author: { name: 'Equipe DEX', avatarUrl: '/assets/images/mock/avatar/avatar-5.webp' },
  },
  {
    id: 'trend-2',
    title: 'Adoção institucional de cripto: O que esperar em 2026?',
    category: 'Economia',
    coverUrl: '/assets/images/mock/cover/cover-6.webp',
    createdAt: new Date(),
    duration: '12 min de leitura',
    author: { name: 'Equipe DEX', avatarUrl: '/assets/images/mock/avatar/avatar-6.webp' },
  },
  {
    id: 'trend-3',
    title: 'NFTs Dinâmicos: A próxima evolução dos colecionáveis digitais',
    category: 'Tecnologia',
    coverUrl: '/assets/images/mock/cover/cover-7.webp',
    createdAt: new Date(),
    duration: '8 min de leitura',
    author: { name: 'Equipe DEX', avatarUrl: '/assets/images/mock/avatar/avatar-7.webp' },
  },
  {
    id: 'trend-4',
    title: 'A tokenização de ativos do mundo real (RWA) e o futuro do mercado',
    category: 'Economia',
    coverUrl: '/assets/images/mock/cover/cover-8.webp',
    createdAt: new Date(),
    duration: '9 min de leitura',
    author: { name: 'Equipe DEX', avatarUrl: '/assets/images/mock/avatar/avatar-8.webp' },
  },
  {
    id: 'trend-5',
    title: 'BRICS e a desdolarização: O papel das moedas digitais',
    category: 'Geopolítica',
    coverUrl: '/assets/images/mock/cover/cover-9.webp',
    createdAt: new Date(),
    duration: '11 min de leitura',
    author: { name: 'Equipe DEX', avatarUrl: '/assets/images/mock/avatar/avatar-9.webp' },
  },
  {
    id: 'trend-6',
    title: 'Redes de energia descentralizadas e o impacto no meio ambiente',
    category: 'Meio Ambiente',
    coverUrl: '/assets/images/mock/cover/cover-10.webp',
    createdAt: new Date(),
    duration: '10 min de leitura',
    author: { name: 'Equipe DEX', avatarUrl: '/assets/images/mock/avatar/avatar-10.webp' },
  },
  {
    id: 'trend-7',
    title: 'A Regulamentação da IA na União Europeia e seus impactos globais',
    category: 'Geopolítica',
    coverUrl: '/assets/images/mock/cover/cover-11.webp',
    createdAt: new Date(),
    duration: '12 min de leitura',
    author: { name: 'Equipe DEX', avatarUrl: '/assets/images/mock/avatar/avatar-11.webp' },
  },
];

// ----------------------------------------------------------------------

export function PostTrending() {
  const theme = useTheme();
  const viewPosts = staticTrendingPosts;

  return (
    <Box
      component={MotionViewport}
      sx={{
        py: { xs: 8, md: 10 },
        position: 'relative',
        bgcolor: 'transparent', // 🟢 TRANSPARÊNCIA ESTRATÉGICA
        overflow: 'hidden',
      }}
    >
      <Grid container spacing={4}>
        <Grid size={12}>
          <m.div variants={varFade('inDown')}>
            <Typography
              variant="h3"
              sx={{
                mb: 6,
                fontWeight: 900,
                fontFamily: "'Orbitron', sans-serif",
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: 'common.white',
                textAlign: { xs: 'center', md: 'left' },
                // 🟢 EFEITO GLOW PADRONIZADO
                textShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.35)}`,
              }}
            >
              Artigos em Alta
            </Typography>
          </m.div>
        </Grid>

        {/* Desktop: Destaques (Primeiros 3) */}
        {viewPosts.slice(0, 3).map((post, index) => (
          <Grid
            key={`${post.id}-${index}-lg`}
            sx={{ display: { xs: 'none', lg: 'block' } }}
            size={{
              xs: 12,
              sm: 6,
              md: 4,
              lg: index === 0 ? 6 : 3,
            }}
          >
            <m.div variants={varFade('inUp')}>
              <PostItemLatest
                post={post as any}
                index={index}
                detailsHref={paths.post.details(post.title)}
              />
            </m.div>
          </Grid>
        ))}

        {/* Mobile/Tablet: Destaques (Primeiros 3) */}
        {viewPosts.slice(0, 3).map((post, index) => (
          <Grid
            key={`${post.id}-${index}-mb`}
            sx={{ display: { lg: 'none' } }}
            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
          >
            <m.div variants={varFade('inUp')}>
              <PostItem
                post={post as any}
                detailsHref={paths.post.details(post.title)}
              />
            </m.div>
          </Grid>
        ))}

        {/* Lista Restante (Posts 4 a 7) */}
        {viewPosts.slice(3, 7).map((post, index) => (
          <Grid
            key={`${post.id}-${index}-rest`}
            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
          >
            <m.div variants={varFade('inUp')}>
              <PostItem
                post={post as any}
                detailsHref={paths.post.details(post.title)}
              />
            </m.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}