'use client';

import type { IPostItem } from 'src/types/blog';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';

import { varFade, MotionViewport } from 'src/components/animate';

import { PostRecent } from '../../_item/PostRecent';
import { PostVideo } from '../../_components/PostVideo';
import { PostTrending } from '../../_item/PostTrending';
import { PostAuthors } from '../../_components/PostAuthors';
import { PostNewsletter } from '../../_forms/PostNewsletter';
import { PostFeatured } from '../../_components/PostFeatured';
import { PostCommunity } from '../../_components/PostCommunity';
import { PostCategoryItem } from '../../_item/PostCategoryItem';
import { PostAdvertisement } from '../../_components/PostAdvertisement';

// ----------------------------------------------------------------------

type Props = {
  posts: IPostItem[];
};

export function BlogHomeView({ posts }: Props) {
  return (
    <Stack
      spacing={0}
      sx={{
        pb: 10,
        bgcolor: 'transparent', 
        position: 'relative',
        zIndex: 1,
        overflowX: 'hidden', 
      }}
    >
      <Container maxWidth="lg">
        {/* 1. HERO PRINCIPAL */}
        <Box key="view-featured">
          <PostFeatured posts={posts} />
        </Box>

        {/* 2. DESTAQUES SECUNDÁRIOS */}
        <Box key="view-trending" sx={{ mt: { xs: 4, md: 8 } }}>
          <PostTrending posts={posts} />
        </Box>

        {/* 3. PROVA SOCIAL */}
        <Box key="view-community" sx={{ my: 10 }}>
          <PostCommunity />
        </Box>

        {/* 4. O "AGORA" */}
        <Box key="view-recent">
          <PostRecent posts={posts} />
        </Box>

        {/* 5. ECONOMIA */}
        <Box key="view-section-economia" sx={{ bgcolor: 'transparent' }}>
          <PostCategoryItem category="Economia" posts={posts} />
        </Box>

        {/* 6. VÍDEOS */}
        <Box key="view-video" sx={{ my: 10 }}>
          <PostVideo />
        </Box>

        {/* 7. TECNOLOGIA */}
        <Box key="view-section-tecnologia" sx={{ bgcolor: 'transparent' }}>
          <PostCategoryItem category="Tecnologia" posts={posts} />
        </Box>

        {/* 8. ANÚNCIO */}
        <Box key="view-ads" sx={{ my: 10 }}>
          <PostAdvertisement />
        </Box>

        {/* 9. GEOPOLÍTICA */}
        <Box key="view-section-geopolitica" sx={{ bgcolor: 'transparent' }}>
          <PostCategoryItem category="Geopolítica" posts={posts} />
        </Box>

        {/* 10. MEIO AMBIENTE */}
        <Box key="view-section-meio-ambiente" sx={{ bgcolor: 'transparent' }}>
          <PostCategoryItem category="Meio Ambiente" posts={posts} />
        </Box>

        {/* 11. AUTORES */}
        <Box key="view-authors" sx={{ my: 10 }}>
          <PostAuthors posts={posts} />
        </Box>

        {/* 12. NEWSLETTER */}
        <Box key="view-newsletter">
          <PostNewsletter />
        </Box>
      </Container>
    </Stack>
  );
}
