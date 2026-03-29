'use client';

import { m } from 'framer-motion';
import type { ISoFiItem } from 'src/types/blog';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import { varFade, MotionViewport } from 'src/components/animate';
import { paths } from 'src/routes/paths';

import { SoFiItem } from './item';

// ----------------------------------------------------------------------

type Props = {
  sofi: ISoFiItem[];
};

export function SoFiList({ sofi }: Props) {
  return (
    <Box 
      component={MotionViewport} 
      sx={{ 
        bgcolor: 'transparent', // 🟢 Garante a visibilidade do SpaceScene
        position: 'relative' 
      }}
    >
      <Grid container spacing={4}>
        {sofi.map((post, index) => (
          <Grid
            key={post.id}
            // 🟢 Sintaxe Grid v2: 'size' em vez de props separadas (xs, sm, md)
            size={{ xs: 12, sm: 6, md: 4 }}
          >
            <m.div variants={varFade('inUp')}>
              <SoFiItem 
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