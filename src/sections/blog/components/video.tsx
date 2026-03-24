'use client';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

// --- DADOS DOS VÍDEOS ---

const VIDEOS_BR = [
  {
    id: 'HPQeQwPahR0',
    title: 'O MAIOR ROUBO “LEGAL” de BITCOIN da HISTÓRIA!',
    channel: 'O Primo Rico',
    thumbnail: 'https://img.youtube.com/vi/HPQeQwPahR0/maxresdefault.jpg',
    postedAt: '2 dias atrás',
    duration: '12:40'
  },
  {
    id: 'hLMnCVEDjqE',
    title: '🔥 TUDO sobre a XRP em 2025! Vale a pena investir agora?',
    channel: 'É TopSaber',
    thumbnail: 'https://img.youtube.com/vi/hLMnCVEDjqE/maxresdefault.jpg',
    postedAt: '5 horas atrás',
    duration: '08:15'
  },
  {
    id: 'Xc6juEgNwog',
    title: 'URGENTE: FED VAI INJETAR TRILHÕES NO MERCADO',
    channel: 'Investidor 4.20',
    thumbnail: 'https://img.youtube.com/vi/Xc6juEgNwog/maxresdefault.jpg',
    postedAt: '1 dia atrás',
    duration: '15:20'
  },
  {
    id: 'x43e3g-JWWQ',
    title: 'MEMECOINS: POR QUE COMPRAR? Estratégias para 2024',
    channel: 'Bruno Perini',
    thumbnail: 'https://img.youtube.com/vi/x43e3g-JWWQ/maxresdefault.jpg',
    postedAt: '3 dias atrás',
    duration: '22:00'
  },
];

const VIDEOS_INT = [
  {
    id: 'W4mGv_8W-7I',
    title: 'Bitcoin Strategy for 2025: The Institutional Era',
    channel: 'Michael Saylor',
    thumbnail: 'https://img.youtube.com/vi/W4mGv_8W-7I/maxresdefault.jpg',
    postedAt: '1 dia atrás',
    duration: '18:10'
  },
  {
    id: 'mS7S5E-WlqU',
    title: 'Ethereum Roadmap: Beyond the Merge',
    channel: 'Vitalik Buterin',
    thumbnail: 'https://img.youtube.com/vi/mS7S5E-WlqU/maxresdefault.jpg',
    postedAt: '4 dias atrás',
    duration: '25:45'
  },
  {
    id: 'N64vL67520Q',
    title: 'Why Solana is Winning the L1 Wars in 2024',
    channel: 'Coin Bureau',
    thumbnail: 'https://img.youtube.com/vi/N64vL67520Q/maxresdefault.jpg',
    postedAt: '6 horas atrás',
    duration: '14:20'
  },
  {
    id: 'fB05fV7X_7o',
    title: 'Global Macro: The Debt Crisis Explained',
    channel: 'Raoul Pal',
    thumbnail: 'https://img.youtube.com/vi/fB05fV7X_7o/maxresdefault.jpg',
    postedAt: '12 horas atrás',
    duration: '32:00'
  },
];

// ----------------------------------------------------------------------

export function PostVideo() {
  const theme = useTheme();

  const renderSectionHeader = (title: string, subtitle: string) => (
    <Box sx={{ mb: 4 }}>
      <m.div variants={varFade('inDown')}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 900, 
            fontFamily: "'Orbitron', sans-serif",
            textTransform: 'uppercase',
            color: 'common.white',
            letterSpacing: '0.05em',
            textShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.35)}`,
          }}
        >
          {title}
        </Typography>
      </m.div>
      <m.div variants={varFade('inUp')}>
        <Typography variant="body2" sx={{ color: 'grey.400' }}>
          {subtitle}
        </Typography>
      </m.div>
    </Box>
  );

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'transparent' }}>
      <Container component={MotionViewport}>
        
        {/* SEÇÃO 1: BRASIL */}
        <Box sx={{ mb: 8 }}>
          {renderSectionHeader('Comunidade Brasileira', 'Insights do mercado nacional')}

          <Box
            sx={{
              display: 'grid',
              gap: 4,
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              },
            }}
          >
            {VIDEOS_BR.map((video) => (
              <m.div key={video.id} variants={varFade('inUp')}>
                <VideoItem video={video} theme={theme} />
              </m.div>
            ))}
          </Box>
        </Box>

        {/* SEÇÃO 2: INTERNACIONAL */}
        <Box>
          {renderSectionHeader('Comunidade Internacional', 'O que está acontecendo no mundo')}

          <Box
            sx={{
              display: 'grid',
              gap: 4,
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              },
            }}
          >
            {VIDEOS_INT.map((video) => (
              <m.div key={video.id} variants={varFade('inUp')}>
                <VideoItem video={video} theme={theme} />
              </m.div>
            ))}
          </Box>
        </Box>

      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

function VideoItem({ video, theme }: { video: any, theme: any }) {
  return (
    <Box 
      sx={{ 
        position: 'relative', 
        cursor: 'pointer', 
        borderRadius: 2, 
        overflow: 'hidden',
        // 🟢 ESTILO GLASSMORPHISM
        bgcolor: alpha(theme.palette.grey[900], 0.4),
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
        transition: theme.transitions.create(['box-shadow', 'transform', 'background-color']),
        '&:hover': { 
          transform: 'translateY(-6px)',
          bgcolor: alpha(theme.palette.grey[900], 0.6),
          boxShadow: `0 12px 24px 0 ${alpha(theme.palette.primary.main, 0.25)}`,
          borderColor: alpha(theme.palette.primary.main, 0.4),
          '& .play-button': { opacity: 1, transform: 'scale(1.1)' },
          '& .video-img': { transform: 'scale(1.1)' }
        } 
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <Image 
          className="video-img"
          alt={video.title} 
          src={video.thumbnail} 
          ratio="16/9" 
          sx={{ transition: theme.transitions.create('transform', { duration: 400 }) }}
        />
        
        <Typography 
          variant="caption" 
          sx={{ 
            position: 'absolute', bottom: 8, right: 8, px: 0.8, py: 0.2, borderRadius: 0.5, 
            color: 'common.white', bgcolor: alpha(theme.palette.common.black, 0.8), 
            fontWeight: 'bold', zIndex: 9, fontFamily: "'Orbitron', sans-serif", fontSize: 10
          }}
        >
          {video.duration}
        </Typography>

        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{ 
            top: 0, left: 0, width: 1, height: 1, position: 'absolute', 
            bgcolor: alpha(theme.palette.common.black, 0.2), zIndex: 8 
          }}
        >
          <Box 
            className="play-button"
            sx={{ 
              p: 1.5, display: 'flex', borderRadius: '50%', color: 'common.white',
              backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
              bgcolor: alpha(theme.palette.primary.main, 0.8), opacity: 0,
              transform: 'scale(0.8)',
              transition: theme.transitions.create(['opacity', 'transform']),
              boxShadow: `0 0 20px ${theme.palette.primary.main}`
            }}
          >
            <Iconify icon={"solar:play-bold" as any} width={24} />
          </Box>
        </Stack>
      </Box>

      <Box sx={{ p: 2, color: 'common.white' }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            mb: 1.5, height: 44, display: '-webkit-box', WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4,
            fontWeight: 700, '&:hover': { color: 'primary.light' }
          }}
        >
          {video.title}
        </Typography>
        
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography 
            variant="caption" 
            sx={{ color: 'primary.light', fontWeight: 800, textTransform: 'uppercase', fontSize: 10 }}
          >
            {video.channel}
          </Typography>
          <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: alpha(theme.palette.primary.main, 0.5) }} />
          <Typography variant="caption" sx={{ color: 'grey.500' }}>
            {video.postedAt}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}