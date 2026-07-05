'use client';

import type { IPostItem } from 'src/types/blog';

import { m } from 'framer-motion';
import { kebabCase } from 'es-toolkit';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';

import { GlassCard } from 'src/components/glass-card';
import { varFade, MotionViewport } from 'src/components/animate';

import { Label } from 'src/components/label';

import { PostCard, PostItemLatest } from './PostCard';

// ----------------------------------------------------------------------

type Props = {
  category: string;
  posts: IPostItem[];
};

export function PostCategoryItem({ category, posts }: Props) {
  const theme = useTheme();

  const viewPosts = posts.filter(
    (post) => post.category.toLowerCase() === category.toLowerCase()
  );

  // Se não houver posts, o grid não renderizará a seção.
  if (viewPosts.length === 0) return null;

  const categoryId = category
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-');

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
        {viewPosts.slice(0, 3).map((post: any, index: number) => {
          const isEconomy = category.toLowerCase() === 'economia';
          const economyLabels = ['Ignorar', 'Criptomoedas', 'Moedas Fiat'];

          return (
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
              <m.div variants={varFade('inUp')} style={{ height: '100%' }}>
                <GlassCard>
                  {/* Badge apenas para os cards menores de Economia (índice 1 e 2) */}
                  {isEconomy && index > 0 && (
                    <Label
                      variant="filled"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        zIndex: 30,
                        fontWeight: 900,
                        fontSize: '0.65rem',
                        fontFamily: "'Orbitron', sans-serif",
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        borderRadius: 0.75,
                        bgcolor: alpha(theme.palette[index === 1 ? 'secondary' : 'success'].main, 0.15),
                        color: theme.palette[index === 1 ? 'secondary' : 'success'].light,
                        border: `1px solid ${alpha(theme.palette[index === 1 ? 'secondary' : 'success'].main, 0.5)}`,
                        backdropFilter: 'blur(8px)',
                        boxShadow: `0 0 10px ${alpha(theme.palette[index === 1 ? 'secondary' : 'success'].main, 0.2)}`,
                      }}
                    >
                      {economyLabels[index]}
                    </Label>
                  )}
                  <PostItemLatest
                    post={post}
                    index={index}
                    detailsHref={paths.post.details(post.slug || kebabCase(post.title))}
                  />
                </GlassCard>
              </m.div>
            </Grid>
          );
        })}

        {/* Mobile/Tablet: Destaques (Primeiros 3) */}
        {viewPosts.slice(0, 3).map((post: any, index: number) => (
          <Grid
            key={`${categoryId}-mb-${post.id}-${index}`}
            sx={{ display: { lg: 'none' } }}
            size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
          >
            <m.div variants={varFade('inUp')}>
              <GlassCard>
                <PostCard 
                  post={post} 
                  detailsHref={paths.post.details(post.slug || kebabCase(post.title))} 
                />
              </GlassCard>
            </m.div>
          </Grid>
        ))}

        {/* Lista Restante */}
        {viewPosts.slice(3, 7).map((post: any, index: number) => {
          const isEconomy = category.toLowerCase() === 'economia';
          const economyLabels = ['Commodities', 'Metais', 'Petróleo', 'Mercado Imobiliário'];
          const economyColors: any[] = ['warning', 'info', 'error', 'primary'];

          return (
            <Grid key={`${categoryId}-list-${post.id}-${index}`} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <m.div variants={varFade('inUp')} style={{ height: '100%' }}>
                <GlassCard>
                  {/* Badge para os 4 cards da lista de Economia */}
                  {isEconomy && (
                    <Label
                      variant="filled"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        zIndex: 30,
                        fontWeight: 900,
                        fontSize: '0.65rem',
                        fontFamily: "'Orbitron', sans-serif",
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        borderRadius: 0.75,
                        bgcolor: alpha(theme.palette[economyColors[index] as 'success' | 'warning' | 'info' | 'error' | 'primary'].main, 0.15),
                        color: theme.palette[economyColors[index] as 'success' | 'warning' | 'info' | 'error' | 'primary'].light,
                        border: `1px solid ${alpha(theme.palette[economyColors[index] as 'success' | 'warning' | 'info' | 'error' | 'primary'].main, 0.5)}`,
                        backdropFilter: 'blur(8px)',
                        boxShadow: `0 0 10px ${alpha(theme.palette[economyColors[index] as 'success' | 'warning' | 'info' | 'error' | 'primary'].main, 0.2)}`,
                      }}
                    >
                      {economyLabels[index]}
                    </Label>
                  )}
                  <PostCard 
                    post={post} 
                    detailsHref={paths.post.details(post.slug || kebabCase(post.title))} 
                  />
                </GlassCard>
              </m.div>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
