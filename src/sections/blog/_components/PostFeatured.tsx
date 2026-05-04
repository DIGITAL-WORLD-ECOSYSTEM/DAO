'use client';

import type { Theme, SxProps } from '@mui/material/styles';

import type { IPostItem } from 'src/types/blog';

import Autoplay from 'embla-carousel-autoplay';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';

import { Image } from 'src/components/image';
import { varFade, MotionViewport } from 'src/components/animate';
import {
  Carousel,
  useCarousel,
  CarouselDotButtons,
  CarouselArrowBasicButtons,
} from 'src/components/carousel';

// ----------------------------------------------------------------------

export function PostFeatured({ posts, sx }: { posts: IPostItem[]; sx?: SxProps<Theme> }) {
  const theme = useTheme();

  // Filtrar posts em destaque ou pegar os primeiros 4 como fallback
  const featuredPosts = posts.filter((post) => post.featured).length > 0
    ? posts.filter((post) => post.featured)
    : posts.slice(0, 4);

  const carousel = useCarousel(
    {
      loop: true,
    },
    [Autoplay({ delay: 6000, stopOnInteraction: false })]
  );

  // 🛠 SOLUÇÃO PARA O ERRO: Extraímos _dotCount para não vazar para o DOM
  const { dotCount: _dotCount, ...dotsProps } = carousel.dots;

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: 'transparent', ...sx }}>
      <Carousel carousel={carousel}>
        {featuredPosts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </Carousel>

      <CarouselArrowBasicButtons
        {...carousel.arrows}
        options={carousel.options}
        sx={{
          top: '50%',
          width: 1,
          zIndex: 9,
          px: { xs: 1, md: 5 },
          position: 'absolute',
          color: theme.palette.primary.main,
          justifyContent: 'space-between',
          transform: 'translateY(-50%)',
          '& button': {
            bgcolor: alpha('#000', 0.5),
            backdropFilter: 'blur(8px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.8),
              color: '#fff',
              boxShadow: `0 0 15px ${theme.palette.primary.main}`,
            },
          },
        }}
      />

      <CarouselDotButtons
        {...dotsProps}
        sx={{
          width: 1,
          bottom: 40,
          zIndex: 9,
          display: 'flex',
          position: 'absolute',
          justifyContent: 'center',
          color: theme.palette.primary.main,
          '& .MuiButtonBase-root': {
            width: 8,
            height: 8,
            transition: 'all 0.3s',
            bgcolor: alpha('#fff', 0.2),
            '&.Mui-selected': {
              width: 24,
              borderRadius: 8,
              bgcolor: theme.palette.primary.main,
              boxShadow: `0 0 10px ${theme.palette.primary.main}`,
            },
          },
        }}
      />
    </Box>
  );
}

// ----------------------------------------------------------------------

function PostItem({ post }: { post: any }) {
  const theme = useTheme();
  const { coverUrl, title, slug, author, createdAt, description, content } = post;

  // Cálculo de leitura (média de 200 palavras por minuto)
  const wordCount = content ? content.replace(/<[^>]*>/g, '').split(/\s+/).length : 100;
  const duration = post.duration || `${Math.max(1, Math.round(wordCount / 200))} min de leitura`;

  return (
    <Box
      sx={{
        pt: { xs: 4, md: 5 },
        pb: { xs: 8, md: 15 },
        display: 'flex',
        minHeight: { xs: 720, md: 640 },
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'transparent',
      }}
    >
      <Card
        sx={{
            width: 1,
            display: 'flex',
            overflow: 'hidden',
            flexDirection: { xs: 'column', md: 'row' },
            position: 'relative',
            // 🟢 ESTILO DEEP SPACE
            bgcolor: alpha('#020817', 0.6),
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            // 💎 BORDA REATIVA DE 1PX
            '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            padding: '1px',
            background: `linear-gradient(180deg, 
              ${alpha(theme.palette.primary.main, 0.8)} 0%, 
              ${alpha(theme.palette.common.white, 0.05)} 50%, 
              ${alpha(theme.palette.primary.main, 0.4)} 100%
            )`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            zIndex: 2,
          },
          boxShadow: `0 0 40px ${alpha(theme.palette.common.black, 0.4)}`,
        }}
      >
        {/* Lado da Imagem */}
        <Box sx={{ width: { xs: 1, md: 0.6 }, position: 'relative', zIndex: 1 }}>
          <Image alt={title} src={coverUrl} ratio="4/3" sx={{ height: 1 }} />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              background: {
                xs: `linear-gradient(to bottom, transparent, ${alpha('#020817', 0.8)})`,
                md: `linear-gradient(to right, transparent, ${alpha('#020817', 0.2)})`,
              },
            }}
          />
        </Box>

        {/* Lado do Conteúdo */}
        <Stack
          sx={{ width: { xs: 1, md: 0.4 }, p: { xs: 3, md: 6 }, color: 'common.white', zIndex: 3 }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{
              mb: 3,
              typography: 'caption',
              color: 'primary.main',
              fontWeight: 800,
              fontFamily: "'Public Sans', sans-serif",
            }}
          >
            {fDate(createdAt)}
            <Box
              component="span"
              sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'currentColor' }}
            />
            {duration}
          </Stack>

          <Typography
            component={RouterLink}
            href={paths.post.details(slug || title)}
            variant="h3"
            sx={{
              mb: 3,
              fontWeight: 900,
              fontFamily: "'Orbitron', sans-serif",
              textTransform: 'uppercase',
              color: 'common.white',
              textDecoration: 'none',
              letterSpacing: '0.02em',
              textShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.35)}`,
              transition: theme.transitions.create(['color']),
              '&:hover': { color: 'primary.main' },
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              mb: 5,
              color: 'grey.400',
              fontFamily: "'Public Sans', sans-serif",
              lineHeight: 1.8,
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 'auto' }}>
            <Avatar
              src={author?.avatarUrl}
              alt={author?.name}
              sx={{
                border: `2px solid ${theme.palette.primary.main}`,
                boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            />
            <Stack spacing={0.5}>
              <Typography
                variant="subtitle2"
                sx={{ color: 'common.white', fontFamily: "'Orbitron', sans-serif", fontSize: 12 }}
              >
                {author?.name}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: 1 }}
              >
                EQUIPE EDITORIAL
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
}
