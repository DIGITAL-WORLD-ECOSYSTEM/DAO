'use client';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { varFade, MotionViewport } from 'src/components/animate';

import type { IPostItem } from 'src/types/blog';

// ----------------------------------------------------------------------

type Props = {
  posts: IPostItem[];
};

export function PostAuthors({ posts }: Props) {
  const theme = useTheme();

  // Extrair autores únicos dos posts
  const AUTHORS = Array.from(new Set(posts.map((p) => p.author.name))).map((name) => {
    const post = posts.find((p) => p.author.name === name);
    return {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      role: 'Criador de Conteúdo',
      avatarUrl: post?.author.avatarUrl || '',
    };
  });

  const renderAuthorCard = (author: (typeof AUTHORS)[0], index: number, rowIndex: number) => (
    <Stack
      key={`${rowIndex}-${index}-${author.id}`}
      component={RouterLink}
      href={paths.post.details(author.name)}
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{
        p: 2,
        minWidth: 280,
        borderRadius: 2,
        cursor: 'pointer',
        textDecoration: 'none',
        position: 'relative',
        overflow: 'hidden',
        // 🟢 FUNDO DEEP SPACE SCIFI
        bgcolor: alpha('#020817', 0.45),
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',

        // 💎 BORDA REATIVA DE 1PX
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          padding: '1px',
          background: `linear-gradient(180deg, 
            ${alpha(theme.palette.primary.main, 0.4)} 0%, 
            ${alpha(theme.palette.common.white, 0.05)} 50%, 
            ${alpha(theme.palette.primary.main, 0.2)} 100%
          )`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          zIndex: 2,
        },

        transition: theme.transitions.create(['all']),
        '&:hover': {
          transform: 'translateY(-4px)',
          bgcolor: alpha(theme.palette.primary.main, 0.08),
          boxShadow: `0 10px 20px ${alpha('#000', 0.4)}`,
          '&::before': {
            background: `linear-gradient(180deg, 
              ${theme.palette.primary.main} 0%, 
              ${alpha(theme.palette.common.white, 0.3)} 50%, 
              ${theme.palette.primary.main} 100%
            )`,
          },
        },
      }}
    >
      <Avatar
        src={author.avatarUrl}
        alt={author.name}
        sx={{
          width: 52,
          height: 52,
          zIndex: 3,
          border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
          boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.15)}`,
        }}
      />

      <Stack spacing={0.5} sx={{ minWidth: 0, zIndex: 3 }}>
        <Typography
          variant="subtitle2"
          noWrap
          sx={{
            color: 'common.white',
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 13,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          {author.name}
        </Typography>
        <Typography
          variant="caption"
          noWrap
          sx={{
            color: 'grey.500',
            fontWeight: 600,
            textTransform: 'uppercase',
            fontSize: 10,
            letterSpacing: '0.02em',
            fontFamily: "'Public Sans', sans-serif",
          }}
        >
          {author.role}
        </Typography>
      </Stack>
    </Stack>
  );

  const renderMarqueeRow = (data: typeof AUTHORS, reverse = false, rowIndex: number) => (
    <Box
      sx={{
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
        py: 2,
        // 🟢 MÁSCARA MAIS SUAVE (5%) PARA MELHOR VISIBILIDADE
        maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
      }}
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <Stack
          key={i}
          component={m.div}
          direction="row"
          spacing={3}
          sx={{ px: 1.5, flexShrink: 0 }}
          animate={{ x: reverse ? ['-100%', '0%'] : ['0%', '-100%'] }}
          transition={{
            duration: 60, // Velocidade otimizada
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {data.map((author, idx) => renderAuthorCard(author, idx, rowIndex))}
        </Stack>
      ))}
    </Box>
  );

  return (
    <Box
      component={MotionViewport}
      sx={{
        py: { xs: 6, md: 10 },
        bgcolor: 'transparent',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
        {/* 🕸️ GRID PATTERN SUTIL */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.05,
            zIndex: 0,
            backgroundImage: `linear-gradient(${alpha(theme.palette.primary.main, 0.2)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.2)} 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        <m.div variants={varFade('inDown')}>
          <Typography
            variant="h2"
            sx={{
              mb: 6,
              textAlign: 'center',
              fontWeight: 900,
              fontFamily: "'Orbitron', sans-serif",
              textTransform: 'uppercase',
              color: 'common.white',
              letterSpacing: '0.1em',
              fontSize: { xs: '1.5rem', md: '2rem' },
              textShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.35)}`,
            }}
          >
            Nossos Criadores
          </Typography>
        </m.div>

        <Stack spacing={1}>
          <m.div variants={varFade('inRight')}>{renderMarqueeRow(AUTHORS, false, 1)}</m.div>

          <m.div variants={varFade('inLeft')}>
            {renderMarqueeRow([...AUTHORS].reverse(), true, 2)}
          </m.div>
        </Stack>
    </Box>
  );
}
