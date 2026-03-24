'use client';

// ----------------------------------------------------------------------
// Imports — Motion e Tipos
// ----------------------------------------------------------------------
import { m } from 'framer-motion';

// ----------------------------------------------------------------------
// Imports — MUI
// ----------------------------------------------------------------------
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------
// Imports — App
// ----------------------------------------------------------------------
import { paths } from 'src/routes/paths';
import { varFade, MotionViewport } from 'src/components/animate';

import { PostItem, PostItemLatest } from './item';

// ----------------------------------------------------------------------

const staticMeioAmbientePosts = [
  {
    id: 'm1',
    title: 'DeFi e Créditos de Carbono: Uma Nova Economia Verde',
    category: 'Meio Ambiente',
    coverUrl: '/assets/images/mock/cover/cover-15.webp',
    createdAt: new Date(),
    duration: '12 min de leitura',
    author: { name: 'Equipe DEX', avatarUrl: '/assets/images/mock/avatar/avatar-15.webp' },
  },
  {
    id: 'm2',
    title: 'Rastreabilidade de Cadeias de Suprimentos com Blockchain',
    category: 'Meio Ambiente',
    coverUrl: '/assets/images/mock/cover/cover-16.webp',
    createdAt: new Date(),
    duration: '8 min de leitura',
    author: { name: 'Equipe DEX', avatarUrl: '/assets/images/mock/avatar/avatar-16.webp' },
  },
  {
    id: 'm3',
    title: 'Tokenização de Ativos Ambientais na Amazônia',
    category: 'Meio Ambiente',
    coverUrl: '/assets/images/mock/cover/cover-17.webp',
    createdAt: new Date(),
    duration: '10 min de leitura',
    author: { name: 'Equipe DEX', avatarUrl: '/assets/images/mock/avatar/avatar-17.webp' },
  },
  {
    id: 'm4',
    title: 'Como a IoT está ajudando a monitorar a qualidade do ar',
    category: 'Meio Ambiente',
    coverUrl: '/assets/images/mock/cover/cover-18.webp',
    createdAt: new Date(),
    duration: '7 min de leitura',
    author: { name: 'Equipe DEX', avatarUrl: '/assets/images/mock/avatar/avatar-18.webp' },
  },
  {
    id: 'm5',
    title: 'Energias Renováveis e Redes de Energia Descentralizadas',
    category: 'Meio Ambiente',
    coverUrl: '/assets/images/mock/cover/cover-19.webp',
    createdAt: new Date(),
    duration: '9 min de leitura',
    author: { name: 'Equipe DEX', avatarUrl: '/assets/images/mock/avatar/avatar-19.webp' },
  },
  {
    id: 'm6',
    title: 'O Futuro da Agricultura Sustentável com Drones e Blockchain',
    category: 'Meio Ambiente',
    coverUrl: '/assets/images/mock/cover/cover-20.webp',
    createdAt: new Date(),
    duration: '11 min de leitura',
    author: { name: 'Equipe DEX', avatarUrl: '/assets/images/mock/avatar/avatar-20.webp' },
  },
  {
    id: 'm7',
    title: 'Cidades Inteligentes: Como a tecnologia pode reduzir o impacto ambiental',
    category: 'Meio Ambiente',
    coverUrl: '/assets/images/mock/cover/cover-21.webp',
    createdAt: new Date(),
    duration: '10 min de leitura',
    author: { name: 'Equipe DEX', avatarUrl: '/assets/images/mock/avatar/avatar-21.webp' },
  },
];

// ----------------------------------------------------------------------

export function MeioAmbiente() {
  const theme = useTheme();
  const viewPosts = staticMeioAmbientePosts;

  // Estilização Crystal Padronizada (Assinatura SocialFi 2026)
  const cardWrapperStyle = {
    position: 'relative',
    borderRadius: 2,
    overflow: 'hidden',
    bgcolor: alpha('#020817', 0.8),
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    transition: theme.transitions.create(['all']),
    
    // Borda Reativa Scifi de 1px
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
      id="meio-ambiente"
      component="section"
      sx={{
        position: 'relative',
        bgcolor: 'transparent',
        py: { xs: 10, md: 15 },
        overflow: 'hidden',
        // Injeção de tipografia via Theme (Seguro contra erros de build)
        '& .MuiTypography-root:not(h2)': {
          fontFamily: theme.typography.fontFamily,
        }
      }}
    >
      <Container component={MotionViewport}>
        {/* Título Orbitron com Glow Neon */}
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
            Meio Ambiente
          </Typography>
        </m.div>

        <Grid container spacing={4}>
          {/* Desktop: Destaques (Posts 1-3) */}
          {viewPosts.slice(0, 3).map((post, index) => (
            <Grid
              key={`env-top-${post.id}-${index}`}
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

          {/* Mobile/Tablet: Destaques (Posts 1-3) */}
          {viewPosts.slice(0, 3).map((post, index) => (
            <Grid
              key={`env-mb-${post.id}-${index}`}
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

          {/* Lista Restante (Posts 4-7) */}
          {viewPosts.slice(3, 7).map((post, index) => (
            <Grid
              key={`env-list-${post.id}-${index}`}
              size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
            >
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