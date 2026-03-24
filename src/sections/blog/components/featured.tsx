'use client';

import type { Theme, SxProps } from '@mui/material/styles';
import Autoplay from 'embla-carousel-autoplay';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDate } from 'src/utils/format-time';

import { Image } from 'src/components/image';
import { Carousel, useCarousel, CarouselDotButtons, CarouselArrowBasicButtons } from 'src/components/carousel';

// ----------------------------------------------------------------------

const staticFeaturedPosts = [
  {
    id: 'feat-1',
    title: 'Revolução Silenciosa: Como a Prova de Conhecimento Zero (ZKP) está redefinindo a privacidade em blockchains e além',
    category: 'Tecnologia',
    coverUrl: '/assets/images/marketing/marketing_post_01.jpg',
    description: 'Mergulhe na tecnologia que permite transações e interações verificáveis sem revelar dados sensíveis, abrindo portas para uma nova era de segurança e confiança digital.',
    author: { name: 'Equipe DEX', avatarUrl: '/assets/images/avatar/avatar_01.jpg' },
    createdAt: new Date(),
    duration: '15 min de leitura',
  },
  {
    id: 'feat-2',
    title: 'Adoção Institucional de Cripto: O catalisador silencioso que pode levar o Bitcoin a US$ 250.000 em 2026',
    category: 'Economia',
    coverUrl: '/assets/images/marketing/marketing_post_02.jpg',
    description: 'Analistas apontam para a entrada massiva de fundos de pensão, seguradoras e grandes bancos como o principal motor para a próxima grande alta do mercado.',
    author: { name: 'Equipe DEX', avatarUrl: '/assets/images/avatar/avatar_02.jpg' },
    createdAt: new Date(),
    duration: '12 min de leitura',
  },
  {
    id: 'feat-3',
    title: 'Guerra Fria 2.0: A corrida global pela supremacia em semicondutores e o papel estratégico de Taiwan',
    category: 'Geopolítica',
    coverUrl: '/assets/images/marketing/marketing_post_03.jpg',
    description: 'Entenda a complexa teia de alianças, espionagem industrial e poderio militar que define a batalha pela tecnologia mais crucial do século XXI.',
    author: { name: 'Equipe DEX', avatarUrl: '/assets/images/avatar/avatar_03.jpg' },
    createdAt: new Date(),
    duration: '18 min de leitura',
  },
  {
    id: 'feat-4',
    title: 'Finanças Regenerativas (ReFi): Onde a tecnologia blockchain encontra a sustentabilidade para curar o planeta',
    category: 'Meio Ambiente',
    coverUrl: '/assets/images/marketing/marketing_post_04.jpg',
    description: 'Descubra como projetos inovadores estão usando DeFi, DAOs e NFTs para financiar a regeneração de ecossistemas e combater as mudanças climáticas de forma transparente.',
    author: { name: 'Equipe DEX', avatarUrl: '/assets/images/avatar/avatar_04.jpg' },
    createdAt: new Date(),
    duration: '14 min de leitura',
  },
];

// ----------------------------------------------------------------------

export function PostFeatured({ sx }: { sx?: SxProps<Theme> }) {
  const theme = useTheme();

  const carousel = useCarousel(
    {
      loop: true,
    },
    [Autoplay({ delay: 6000, stopOnInteraction: false })]
  );

  // 🛠 SOLUÇÃO PARA O ERRO: Extraímos dotCount para não vazar para o DOM
  const { dotCount, ...dotsProps } = carousel.dots;

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: 'transparent', ...sx }}>
      <Carousel carousel={carousel}>
        {staticFeaturedPosts.map((post) => (
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
              boxShadow: `0 0 15px ${theme.palette.primary.main}` 
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
              boxShadow: `0 0 10px ${theme.palette.primary.main}` 
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
  const { coverUrl, title, author, createdAt, description, duration } = post;

  return (
    <Box
      sx={{
        py: { xs: 8, md: 15 },
        display: 'flex',
        minHeight: { xs: 720, md: 640 }, // Mantido tamanho original
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, md: 10 },
        bgcolor: 'transparent',
      }}
    >
      <Card
        sx={{
          width: 1,
          maxWidth: 1100, // Mantido tamanho original
          display: 'flex',
          overflow: 'hidden',
          flexDirection: { xs: 'column', md: 'row' },
          position: 'relative',
          // 🟢 ESTILO DEEP SPACE
          bgcolor: alpha('#020817', 0.6),
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          
          // 💎 BORDA REATIVA DE 1PX (Assinatura Visual)
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
              top: 0, right: 0, bottom: 0, left: 0,
              background: {
                xs: `linear-gradient(to bottom, transparent, ${alpha('#020817', 0.8)})`,
                md: `linear-gradient(to right, transparent, ${alpha('#020817', 0.2)})`
              }
            }} 
          />
        </Box>

        {/* Lado do Conteúdo */}
        <Stack sx={{ width: { xs: 1, md: 0.4 }, p: { xs: 3, md: 6 }, color: 'common.white', zIndex: 3 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ 
              mb: 3, 
              typography: 'caption', 
              color: 'primary.main', 
              fontWeight: 800,
              fontFamily: "'Public Sans', sans-serif" 
            }}
          >
            {fDate(createdAt)}
            <Box component="span" sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'currentColor' }} />
            {duration}
          </Stack>

          <Typography
            component={RouterLink}
            href={paths.post.details(title)}
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
                boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.3)}`
              }}
            />
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" sx={{ color: 'common.white', fontFamily: "'Orbitron', sans-serif", fontSize: 12 }}>
                {author?.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: 1 }}>
                EQUIPE EDITORIAL
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
}