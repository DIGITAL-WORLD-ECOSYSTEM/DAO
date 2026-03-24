'use client';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

const AUTHORS = [
  { id: '1', name: 'Creator 1', role: 'Análise de Mercado', avatarUrl: '' },
  { id: '2', name: 'Jane Doe', role: 'Guia de Airdrops', avatarUrl: '/assets/images/portrait/portrait-1.webp' },
  { id: '3', name: 'Paulo Camargo', role: 'Estrategista DeFi', avatarUrl: '/assets/images/portrait/portrait-2.webp' },
  { id: '4', name: 'Tina Horn', role: 'NFT Specialist', avatarUrl: '/assets/images/portrait/portrait-3.webp' },
  { id: '5', name: 'Milly Lacerda', role: 'Web3 Developer', avatarUrl: '/assets/images/portrait/portrait-4.webp' },
  { id: '6', name: 'Lucas Silva', role: 'Macro Trader', avatarUrl: '/assets/images/portrait/portrait-5.webp' },
];

export function PostAuthors() {
  const theme = useTheme();

  const renderAuthorCard = (author: typeof AUTHORS[0], index: number, rowIndex: number) => (
    <Stack
      key={`${rowIndex}-${index}-${author.id}`}
      component={RouterLink}
      href={paths.post.details(author.name)}
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{
        p: 2,
        minWidth: 260,
        borderRadius: 2,
        cursor: 'pointer',
        textDecoration: 'none',
        position: 'relative',
        overflow: 'hidden',
        // 🟢 FUNDO DEEP SPACE SCIFI
        bgcolor: alpha('#020817', 0.6),
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        
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

        transition: theme.transitions.create(['all']),
        '&:hover': {
          transform: 'translateY(-4px) scale(1.02)',
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.25)}`,
          '&::before': {
            background: `linear-gradient(180deg, 
              ${theme.palette.primary.main} 0%, 
              ${alpha(theme.palette.common.white, 0.2)} 50%, 
              ${theme.palette.primary.main} 100%
            )`,
          }
        },
      }}
    >
      <Avatar
        src={author.avatarUrl}
        alt={author.name}
        sx={{ 
          width: 48, 
          height: 48, 
          zIndex: 3,
          border: `2px solid ${alpha(theme.palette.primary.main, 0.5)}`,
          boxShadow: `0 0 15px ${alpha(theme.palette.primary.main, 0.2)}` 
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
            textTransform: 'uppercase'
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
        py: 1.5,
        maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
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
            duration: 80, // Aumentado para um scroll mais suave e premium
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
      component="section" 
      sx={{ 
        py: { xs: 8, md: 12 },
        bgcolor: 'transparent',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Container component={MotionViewport}>
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
              letterSpacing: '0.05em',
              textShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.35)}`,
            }}
          >
            Nossos Criadores
          </Typography>
        </m.div>

        <Stack spacing={2}>
          <m.div variants={varFade('inRight')}>
            {renderMarqueeRow(AUTHORS, false, 1)}
          </m.div>

          <m.div variants={varFade('inLeft')}>
            {renderMarqueeRow([...AUTHORS].reverse(), true, 2)}
          </m.div>
        </Stack>
      </Container>
    </Box>
  );
}