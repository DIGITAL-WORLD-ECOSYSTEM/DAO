'use client';

import type { ReactNode } from 'react';
import type { IPostItem } from 'src/types/blog';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import { PostRecent } from '../item/recent';
import { PostVideo } from '../components/video';
import { PostTrending } from '../item/trending';
import { PostAuthors } from '../components/authors';
import { PostNewsletter } from '../forms/newsletter';
import { PostFeatured } from '../components/featured';
import { PostCommunity } from '../components/community';
import { PostAdvertisement } from '../components/advertisement';

// ----------------------------------------------------------------------

type Props = {
  posts: IPostItem[];
  economiaSection: ReactNode;
  tecnologiaSection: ReactNode;
  meioAmbienteSection: ReactNode;
  geopoliticaSection: ReactNode;
};

export function PostListHomeView({ 
  posts, 
  economiaSection, 
  tecnologiaSection, 
  meioAmbienteSection, 
  geopoliticaSection 
}: Props) {
  return (
    <Stack 
      spacing={0} 
      sx={{ 
        pb: 10,
        bgcolor: 'transparent', // Libera a visão para o SpaceScene (zIndex -1)
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* 1. HERO PRINCIPAL */}
      <Box key="view-featured">
        <PostFeatured {...({ posts } as any)} />
      </Box>

      {/* 2. DESTAQUES SECUNDÁRIOS */}
      <Container key="view-trending" sx={{ mt: { xs: 4, md: 8 } }}>
        <PostTrending {...({ posts } as any)} />
      </Container>

      {/* 3. PROVA SOCIAL */}
      <Container key="view-community" sx={{ my: 10 }}>        
        <PostCommunity />
      </Container>

      {/* 4. O "AGORA" */}
      <Box key="view-recent">
        <PostRecent posts={posts} />
      </Box>

      {/* 5. ECONOMIA - Slot dinâmico com Key única */}
      <Box key="view-section-economia" sx={{ bgcolor: 'transparent' }}>
        {economiaSection}
      </Box>

      {/* 6. QUEBRA VISUAL: Vídeos */}
      <Container key="view-video" sx={{ my: 10 }}>
        <PostVideo />
      </Container>

      {/* 7. TECNOLOGIA - Foco da transparência */}
      <Box key="view-section-tecnologia" sx={{ bgcolor: 'transparent' }}>
        {tecnologiaSection}
      </Box>

      {/* 8. CONVERSÃO: Banner de Anúncio */}
      <Container key="view-ads" sx={{ my: 10 }}>
        <PostAdvertisement />
      </Container>

      {/* 9. GEOPOLÍTICA - Slot dinâmico com Key única */}
      <Box key="view-section-geopolitica" sx={{ bgcolor: 'transparent' }}>
        {geopoliticaSection}
      </Box>

      {/* 10. MEIO AMBIENTE - Slot dinâmico com Key única */}
      <Box key="view-section-meio-ambiente" sx={{ bgcolor: 'transparent' }}>
        {meioAmbienteSection}
      </Box>

      {/* 11. HUMANIZAÇÃO: Autores */}
      <Container key="view-authors" sx={{ my: 10 }}>        
        <PostAuthors />
      </Container>

      {/* 12. RETENÇÃO FINAL: Newsletter */}
      <Box key="view-newsletter">
        <PostNewsletter />
      </Box>

    </Stack>
  );
}