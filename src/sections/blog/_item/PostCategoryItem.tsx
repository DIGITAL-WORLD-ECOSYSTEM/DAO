'use client';

import type { IPostItem } from 'src/types/blog';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';

import { varFade, MotionViewport } from 'src/components/animate';

import { PostCard, PostItemLatest } from './PostCard';

// ----------------------------------------------------------------------

type Props = {
  category: string;
  posts: IPostItem[];
};

export function PostCategoryItem({ category, posts }: Props) {
  const theme = useTheme();
  
  const viewPosts = posts.filter(post => post.category === category);

  // Se não houver posts, o grid não renderizará a seção.
  if (viewPosts.length === 0) return null;

  const categoryId = category.toLowerCase().replace(/\s+/g, '-');

  const cardStyle = {
    position: 'relative',
    borderRadius: 2,
    overflow: 'hidden',
    bgcolor: alpha('#020817', 0.8),
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    transition: theme.transitions.create(['all']),
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
      id={categoryId}
      component={MotionViewport}
      sx={{
        position: 'relative',
        bgcolor: 'transparent',
        py: { xs: 10, md: 15 },
        overflow: 'hidden',
      }}
    >
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
            {category}
          </Typography>
        </m.div>

        <Grid container spacing={4}>
          {/* Desktop: Destaques (Primeiros 3) */}
          {viewPosts.slice(0, 3).map((post: any, index: number) => (
            <Grid
              key={`${categoryId}-top-${post.id}-${index}`}
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
                    detailsHref={paths.post.details(post.slug)}
                  />
                </Box>
              </m.div>
            </Grid>
          ))}

          {/* Mobile/Tablet: Destaques (Primeiros 3) */}
          {viewPosts.slice(0, 3).map((post: any, index: number) => (
            <Grid
              key={`${categoryId}-mb-${post.id}-${index}`}
              sx={{ display: { lg: 'none' } }}
              size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
            >
              <m.div variants={varFade('inUp')}>
                <Box sx={cardStyle}>
                  <PostCard post={post} detailsHref={paths.post.details(post.slug)} />
                </Box>
              </m.div>
            </Grid>
          ))}

          {/* Lista Restante */}
          {viewPosts.slice(3, 7).map((post: any, index: number) => (
            <Grid key={`${categoryId}-list-${post.id}-${index}`} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <m.div variants={varFade('inUp')}>
                <Box sx={cardStyle}>
                  <PostCard post={post} detailsHref={paths.post.details(post.slug)} />
                </Box>
              </m.div>
            </Grid>
          ))}
        </Grid>
    </Box>
  );
}
