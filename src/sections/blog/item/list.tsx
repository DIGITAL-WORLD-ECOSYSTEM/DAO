'use client';

import { m } from 'framer-motion';
import type { IPostItem } from 'src/types/blog';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import { varFade, MotionViewport } from 'src/components/animate';
import { paths } from 'src/routes/paths';

import { PostItem } from './item';

// ----------------------------------------------------------------------

type Props = {
  posts: IPostItem[];
};

export function PostList({ posts }: Props) {
  return (
    <Box 
      component={MotionViewport} 
      sx={{ 
        bgcolor: 'transparent', // 🟢 Garante a visibilidade do SpaceScene
        position: 'relative' 
      }}
    >
      <Grid container spacing={4}>
        {posts.map((post, index) => (
          <Grid
            key={post.id}
            // 🟢 Sintaxe Grid v2: 'size' em vez de props separadas (xs, sm, md)
            size={{ xs: 12, sm: 6, md: 4 }}
          >
            <m.div variants={varFade('inUp')}>
              <PostItem 
                post={post} 
                // 🟢 Uso do helper de caminhos para manter a consistência das rotas
                detailsHref={paths.post.details(post.title)} 
              />
            </m.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}