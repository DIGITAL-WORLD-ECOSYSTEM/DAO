'use client';

import { useState } from 'react';
import { m } from 'framer-motion';

// ✅ Importação do tipo para garantir a integridade
import type { IPostItem } from 'src/types/blog';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';

import { varFade, MotionViewport } from 'src/components/animate';

import { PostItem } from './item';

// ----------------------------------------------------------------------

type Props = {
  posts?: IPostItem[];
};

export function PostRecent({ posts: postsFromProps }: Props) {
  const theme = useTheme();
  const [viewLimit, setViewLimit] = useState(4);

  const handleLoadMore = () => {
    setViewLimit((prev) => prev + 4);
  };

  // ✅ Prioriza os posts da API e usa estáticos como fallback
  const posts = (postsFromProps && postsFromProps.length > 0) 
    ? postsFromProps 
    : staticRecentPosts;

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 10 },
        bgcolor: 'transparent', // 🟢 TRANSPARÊNCIA ESTRATÉGICA
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container component={MotionViewport}>
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
                Artigos Recentes
              </Typography>
            </m.div>
          </Grid>

          {posts.slice(0, viewLimit).map((post) => (
            <Grid key={post.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <m.div variants={varFade('inUp')}>
                <PostItem post={post as any} detailsHref={paths.post.details(post.title)} />
              </m.div>
            </Grid>
          ))}
        </Grid>

        {posts.length > viewLimit && (
          <Stack sx={{ mt: 8, alignItems: 'center' }}>
            <m.div variants={varFade('inUp')}>
              <Button
                size="large"
                variant="outlined"
                onClick={handleLoadMore}
                sx={{
                  height: 56,
                  px: 5,
                  fontSize: 15,
                  fontWeight: 700,
                  fontFamily: "'Orbitron', sans-serif",
                  color: 'common.white',
                  borderRadius: 1.5,
                  textTransform: 'uppercase',
                  // 🟢 ESTILO NEON GLASS
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  borderColor: alpha(theme.palette.primary.main, 0.4),
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  transition: theme.transitions.create(['all']),
                  boxShadow: `0 0 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                  '&:hover': {
                    borderColor: theme.palette.primary.main,
                    bgcolor: alpha(theme.palette.primary.main, 0.15),
                    boxShadow: `0 0 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Carregar mais artigos
              </Button>
            </m.div>
          </Stack>
        )}
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

const staticRecentPosts = [
  { id: 'rec-1', title: 'Governança em DAOs: Lições aprendidas com os maiores protocolos', category: 'Tecnologia', coverUrl: '/assets/images/mock/cover/cover-12.webp', author: { name: 'Equipe DEX', avatarUrl: '/assets/images/mock/avatar/avatar-12.webp' }, createdAt: new Date(), duration: '10 min de leitura' },
  { id: 'rec-2', title: 'Staking de Ethereum: Riscos e Recompensas após a atualização Shanghai', category: 'Economia', coverUrl: '/assets/images/mock/cover/cover-13.webp', author: { name: 'Equipe DEX', avatarUrl: '/assets/images/mock/avatar/avatar-13.webp' }, createdAt: new Date(), duration: '8 min de leitura' },
  { id: 'rec-3', title: 'Criptomoedas e privacidade: Uma análise de Monero, Zcash e Grin', category: 'Tecnologia', coverUrl: '/assets/images/mock/cover/cover-14.webp', author: { name: 'Equipe DEX', avatarUrl: '/assets/images/mock/avatar/avatar-14.webp' }, createdAt: new Date(), duration: '9 min de leitura' },
  { id: 'rec-4', title: 'O impacto da Web3 na indústria da música e direitos autorais', category: 'Economia', coverUrl: '/assets/images/mock/cover/cover-15.webp', author: { name: 'Equipe DEX', avatarUrl: '/assets/images/mock/avatar/avatar-15.webp' }, createdAt: new Date(), duration: '7 min de leitura' },
  { id: 'rec-5', title: 'Ameaças de segurança em contratos inteligentes: Hacks e Prevenção', category: 'Tecnologia', coverUrl: '/assets/images/mock/cover/cover-16.webp', author: { name: 'Equipe DEX', avatarUrl: '/assets/images/mock/avatar/avatar-16.webp' }, createdAt: new Date(), duration: '11 min de leitura' },
  { id: 'rec-6', title: 'Finanças Regenerativas (ReFi): Um novo paradigma para o desenvolvimento sustentável', category: 'Meio Ambiente', coverUrl: '/assets/images/mock/cover/cover-17.webp', author: { name: 'Equipe DEX', avatarUrl: '/assets/images/mock/avatar/avatar-17.webp' }, createdAt: new Date(), duration: '10 min de leitura' },
  { id: 'rec-7', title: 'A competição entre as soluções de Camada 2: Optimism vs. Arbitrum', category: 'Tecnologia', coverUrl: '/assets/images/mock/cover/cover-18.webp', author: { name: 'Equipe DEX', avatarUrl: '/assets/images/mock/avatar/avatar-18.webp' }, createdAt: new Date(), duration: '12 min de leitura' },
  { id: 'rec-8', title: 'A geopolítica da mineração de Bitcoin: Onde estão os maiores players?', category: 'Geopolítica', coverUrl: '/assets/images/mock/cover/cover-19.webp', author: { name: 'Equipe DEX', avatarUrl: '/assets/images/mock/avatar/avatar-19.webp' }, createdAt: new Date(), duration: '9 min de leitura' },
];