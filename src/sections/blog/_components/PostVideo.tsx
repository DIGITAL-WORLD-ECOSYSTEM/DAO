'use client';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

type VideoItemProps = {
  id: string;
  title: string;
  channel: string;
  thumbnail: string;
  postedAt: string;
  duration: string;
};

type Props = {
  videos: {
    brazil: VideoItemProps[];
    international: VideoItemProps[];
  };
};

export function PostVideo({ videos }: Props) {
  const theme = useTheme();

  if (!videos || (videos.brazil.length === 0 && videos.international.length === 0)) return null;

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
    <Box component={MotionViewport} sx={{ py: { xs: 8, md: 12 }, bgcolor: 'transparent' }}>
        {/* SEÇÃO 1: BRASIL */}
        {videos.brazil.length > 0 && (
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
              {videos.brazil.map((video) => (
                <m.div key={video.id} variants={varFade('inUp')}>
                  <VideoItem video={video} theme={theme} />
                </m.div>
              ))}
            </Box>
          </Box>
        )}

        {/* SEÇÃO 2: INTERNACIONAL */}
        {videos.international.length > 0 && (
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
              {videos.international.map((video) => (
                <m.div key={video.id} variants={varFade('inUp')}>
                  <VideoItem video={video} theme={theme} />
                </m.div>
              ))}
            </Box>
          </Box>
        )}
    </Box>
  );
}

// ----------------------------------------------------------------------

function VideoItem({ video, theme }: { video: VideoItemProps; theme: any }) {
  return (
    <Box
      sx={{
        position: 'relative',
        cursor: 'pointer',
        borderRadius: 2,
        overflow: 'hidden',
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
          '& .video-img': { transform: 'scale(1.1)' },
        },
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
            position: 'absolute',
            bottom: 8,
            right: 8,
            px: 0.8,
            py: 0.2,
            borderRadius: 0.5,
            color: 'common.white',
            bgcolor: alpha(theme.palette.common.black, 0.8),
            fontWeight: 'bold',
            zIndex: 9,
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 10,
          }}
        >
          {video.duration}
        </Typography>

        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            top: 0,
            left: 0,
            width: 1,
            height: 1,
            position: 'absolute',
            bgcolor: alpha(theme.palette.common.black, 0.2),
            zIndex: 8,
          }}
        >
          <Box
            className="play-button"
            sx={{
              p: 1.5,
              display: 'flex',
              borderRadius: '50%',
              color: 'common.white',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              bgcolor: alpha(theme.palette.primary.main, 0.8),
              opacity: 0,
              transform: 'scale(0.8)',
              transition: theme.transitions.create(['opacity', 'transform']),
              boxShadow: `0 0 20px ${theme.palette.primary.main}`,
            }}
          >
            <Iconify icon={'solar:play-bold' as any} width={24} />
          </Box>
        </Stack>
      </Box>

      <Box sx={{ p: 2, color: 'common.white' }}>
        <Typography
          variant="subtitle2"
          sx={{
            mb: 1.5,
            height: 44,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4,
            fontWeight: 700,
            '&:hover': { color: 'primary.light' },
          }}
        >
          {video.title}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography
            variant="caption"
            sx={{
              color: 'primary.light',
              fontWeight: 800,
              textTransform: 'uppercase',
              fontSize: 10,
            }}
          >
            {video.channel}
          </Typography>
          <Box
            sx={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              bgcolor: alpha(theme.palette.primary.main, 0.5),
            }}
          />
          <Typography variant="caption" sx={{ color: 'grey.500' }}>
            {video.postedAt}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
