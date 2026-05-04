'use client';

import { m } from 'framer-motion';

// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

// components
import { Image } from 'src/components/image';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

type Props = {
  communities: {
    name: string;
    logo: string;
    url: string;
  }[];
};

export function PostCommunity({ communities }: Props) {
  const theme = useTheme();

  if (!communities || communities.length === 0) return null;

  const renderMarqueeRow = (reverse = false) => (
    <Box
      sx={{
        display: 'flex',
        overflow: 'hidden',
        position: 'relative',
        maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
        WebkitMaskImage:
          'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
        py: 1.5,
      }}
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <Stack
          key={index}
          component={m.div}
          direction="row"
          spacing={3}
          sx={{ px: 1.5, flexShrink: 0 }}
          animate={{ x: reverse ? ['-100%', '0%'] : ['0%', '-100%'] }}
          transition={{
            duration: 60,
            ease: 'linear',
            repeat: Infinity,
          }}
        >
          {communities.map((community) => (
            <Box
              key={`${index}-${community.name}`}
              component="a"
              href={community.url}
              target="_blank"
              rel="noopener"
              sx={{
                p: 3,
                width: 180,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                textDecoration: 'none',
                position: 'relative',
                overflow: 'hidden',
                bgcolor: alpha('#020817', 0.7),
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
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
                transition: theme.transitions.create(['all']),
                '&:hover': {
                  bgcolor: alpha(theme.palette.info.main, 0.08),
                  transform: 'translateY(-8px)',
                  boxShadow: `0 0 25px ${alpha(theme.palette.info.main, 0.3)}`,
                },
              }}
            >
              <Image
                alt={community.name}
                src={community.logo}
                sx={{
                  width: 48,
                  height: 48,
                  mb: 2,
                  zIndex: 3,
                  filter: `drop-shadow(0 0 12px ${alpha(theme.palette.info.main, 0.4)})`,
                }}
              />
              <Typography
                variant="subtitle2"
                noWrap
                sx={{
                  zIndex: 3,
                  color: 'common.white',
                  fontFamily: "'Orbitron', sans-serif",
                  fontSize: 11,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                {community.name}
              </Typography>
            </Box>
          ))}
        </Stack>
      ))}
    </Box>
  );

  return (
    <Box
      component={MotionViewport}
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: 'transparent',
        position: 'relative',
      }}
    >
        <Stack spacing={6}>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <m.div variants={varFade('inDown')}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  fontFamily: "'Orbitron', sans-serif",
                  textTransform: 'uppercase',
                  color: 'common.white',
                  letterSpacing: '0.05em',
                  textShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.35)}`,
                }}
              >
                Comunidades Cripto
              </Typography>
            </m.div>

            <m.div variants={varFade('inUp')}>
              <Typography
                variant="body1"
                sx={{
                  color: 'grey.400',
                  maxWidth: 600,
                  mx: 'auto',
                  fontFamily: "'Public Sans', sans-serif",
                }}
              >
                Monitorizamos os principais ecossistemas globais em tempo real para trazer insights
                exclusivos.
              </Typography>
            </m.div>
          </Stack>

          <Stack spacing={2}>
            <m.div variants={varFade('inRight')}>{renderMarqueeRow(false)}</m.div>

            <m.div variants={varFade('inLeft')}>{renderMarqueeRow(true)}</m.div>
          </Stack>
        </Stack>
    </Box>
  );
}
