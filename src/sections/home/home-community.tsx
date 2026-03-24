'use client';

// ----------------------------------------------------------------------
// Imports — tipos e react/motion
// ----------------------------------------------------------------------
import type { BoxProps } from '@mui/material/Box';

import { useMemo } from 'react';
import { m } from 'framer-motion';

// ----------------------------------------------------------------------
// Imports — MUI
// ----------------------------------------------------------------------
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, styled, useTheme } from '@mui/material/styles';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

// ----------------------------------------------------------------------
// Imports — App
// ----------------------------------------------------------------------
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _mock } from 'src/_mock';
import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

const SOCIAL_CHANNELS = [
  { name: 'Discord', icon: 'bi:discord', color: '#5865F2' },
  { name: 'Telegram', icon: 'logos:telegram', color: '#0088cc' },
  { name: 'Instagram', icon: 'skill-icons:instagram', color: '#E4405F' },
];

const StyledAvatarGroup = styled(AvatarGroup)(() => ({
  [`& .${avatarGroupClasses.avatar}`]: {
    width: 32,
    height: 32,
    border: 'none',
  },
}));

// ----------------------------------------------------------------------

export function HomeCommunity({ sx, ...other }: BoxProps) {
  const theme = useTheme();
  const { t } = useTranslate();

  const METRICS = useMemo(
    () => [
      { id: 'members', label: t('community.metrics.members'), value: '+500' },
      { id: 'area', label: t('community.metrics.area'), value: '+10K' },
      { id: 'aum', label: t('community.metrics.aum'), value: '$7.5M' },
    ],
    [t]
  );

  const renderSocialHub = () => (
    <m.div variants={varFade('inUp')} style={{ height: '100%' }}>
      <Stack
        spacing={4}
        sx={{
          p: { xs: 3, sm: 5 },
          height: 1,
          borderRadius: 3,
          position: 'relative',
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

          boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.5)}`,
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 0 32px 0 ${alpha(theme.palette.info.main, 0.3)}`,
          },
        }}
      >
        <Stack spacing={2} textAlign="left" sx={{ zIndex: 3 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800, 
              color: 'common.white',
              fontFamily: "'Orbitron', sans-serif",
              textTransform: 'uppercase',
              fontSize: { xs: '1.25rem', md: '1.5rem' }
            }}
          >
            {t('community.hub.title')}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#919EAB', 
              lineHeight: 1.7, 
              textAlign: { xs: 'left', sm: 'justify' },
              fontFamily: "'Public Sans', sans-serif"
            }}
          >
            {t('community.hub.description')}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ zIndex: 3 }}>
          <StyledAvatarGroup max={4}>
            {[1, 2, 3, 4].map((i) => (
              <Avatar key={i} src={_mock.image.avatar(i)} />
            ))}
          </StyledAvatarGroup>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 700, 
              color: 'info.main',
              fontFamily: "'Orbitron', sans-serif",
              fontSize: 12
            }}
          >
            {t('community.metrics.members')}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ zIndex: 3 }}>
          {SOCIAL_CHANNELS.map((channel) => (
            <Button
              key={channel.name}
              variant="soft"
              size="small"
              startIcon={<Iconify icon={channel.icon as any} width={20} />}
              sx={{
                bgcolor: alpha(channel.color, 0.1),
                color: channel.color,
                fontWeight: 700,
                borderRadius: 1,
                fontFamily: "'Public Sans', sans-serif",
                '&:hover': { bgcolor: alpha(channel.color, 0.2) },
              }}
            >
              {channel.name}
            </Button>
          ))}
        </Stack>
      </Stack>
    </m.div>
  );

  return (
    <Box
      id="community"
      component="section"
      sx={[
        {
          position: 'relative',
          overflow: 'hidden',
          py: { xs: 8, md: 15 },
          bgcolor: 'transparent',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <MotionViewport>
        <Container sx={{ position: 'relative', zIndex: 9 }}>
          
          <m.div variants={varFade('inUp')}>
            <Box
              sx={{
                display: 'inline-block',
                border: `1px solid ${theme.palette.info.main}`,
                borderRadius: 2,
                px: 1.5,
                py: 0.5,
                mb: { xs: 4, md: 6 },
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 700,
                  fontSize: 10,
                  md: 12,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'info.main',
                }}
              >
                {t('community.badge')}
              </Typography>
            </Box>
          </m.div>

          <Box
            sx={{
              display: 'grid',
              alignItems: 'stretch', 
              gap: { xs: 6, md: 10 },
              gridTemplateColumns: { xs: '1fr', md: '1.2fr 0.8fr' },
            }}
          >
            <Stack
              component={m.div}
              variants={varFade('inLeft')}
              justifyContent="space-between" 
              sx={{ height: 1 }}
            >
              <Box>
                <Typography
                  component="h2"
                  sx={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontWeight: 900,
                    fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' },
                    letterSpacing: '0.05em',
                    lineHeight: 1.2,
                    textTransform: 'uppercase',
                    textAlign: 'left',
                    mb: 3,
                  }}
                >
                  <Box component="span" sx={{ color: 'common.white' }}>
                    {t('community.title')}
                  </Box>
                  <br />
                  <Box component="span" sx={{ color: alpha(theme.palette.common.white, 0.5) }}>
                    {t('community.title_bridge')}
                  </Box>
                  <br />
                  <Box component="span" sx={{ color: 'info.main' }}>
                    {t('community.title_highlight')}
                  </Box>
                </Typography>
                
                <Typography
                  sx={{
                    maxWidth: 560,
                    fontSize: { xs: 15, md: 18 },
                    lineHeight: 1.8,
                    color: '#919EAB',
                    fontFamily: "'Public Sans', sans-serif",
                    textAlign: { xs: 'left', sm: 'justify', md: 'left' },
                  }}
                >
                  {t('community.description')}
                </Typography>

                {/* MÉTRICAS RESPONSIVAS */}
                <Box
                  sx={{
                    mt: { xs: 5, md: 6 },
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
                    gap: { xs: 3, md: 2 },
                    maxWidth: 580, 
                  }}
                >
                  {METRICS.map((stat) => (
                    <m.div key={stat.id} variants={varFade('inUp')}>
                      <Stack spacing={0.5}>
                        <Typography
                          sx={{
                            fontFamily: "'Orbitron', sans-serif",
                            fontWeight: 900,
                            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                            color: 'info.main',
                            letterSpacing: '0.05em',
                          }}
                        >
                          {stat.value}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: '#919EAB',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: 1,
                            fontFamily: "'Public Sans', sans-serif",
                            fontSize: { xs: 10, md: 12 }
                          }}
                        >
                          {stat.label}
                        </Typography>
                      </Stack>
                    </m.div>
                  ))}
                </Box>
              </Box>

              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                alignItems={{ xs: 'stretch', sm: 'center' }} 
                spacing={3} 
                sx={{ mt: { xs: 6, md: 10 } }}
              >
                <Button
                  component={RouterLink}
                  href={paths.dashboard.root} 
                  endIcon={<Iconify icon="solar:double-alt-arrow-right-bold-duotone" />}
                  sx={{
                    height: 56,
                    px: 4,
                    fontFamily: "'Orbitron', sans-serif",
                    fontWeight: 700,
                    borderRadius: 1.5,
                    textTransform: 'uppercase',
                    color: 'common.white',
                    position: 'relative',
                    bgcolor: alpha('#020817', 0.8),
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 'inherit',
                      padding: '1px',
                      background: `linear-gradient(180deg, 
                        ${alpha(theme.palette.info.main, 1)} 0%, 
                        ${alpha(theme.palette.info.main, 0.1)} 50%, 
                        ${alpha(theme.palette.info.main, 0.6)} 100%
                      )`,
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                    },
                    '&:hover': {
                      bgcolor: alpha(theme.palette.info.main, 0.08),
                      transform: 'translateY(-2px)',
                      boxShadow: `0 0 20px 0 ${alpha(theme.palette.info.main, 0.3)}`,
                    },
                  }}
                >
                  {t('community.buttons.governance')}
                </Button>

                <Button
                  component={RouterLink}
                  href="#" 
                  color="inherit"
                  endIcon={<Iconify icon="solar:double-alt-arrow-right-bold-duotone" />}
                  sx={{
                    fontWeight: 700,
                    fontFamily: "'Orbitron', sans-serif",
                    color: 'common.white',
                    textTransform: 'uppercase',
                    fontSize: 14,
                    justifyContent: { xs: 'center', sm: 'flex-start' },
                    '&:hover': {
                      color: 'info.main',
                      bgcolor: 'transparent',
                    },
                  }}
                >
                  {t('community.buttons.data')}
                </Button>
              </Stack>
            </Stack>

            <Box sx={{ mt: { xs: 2, md: 0 } }}>
              {renderSocialHub()}
            </Box>
          </Box>
        </Container>
      </MotionViewport>
    </Box>
  );
}