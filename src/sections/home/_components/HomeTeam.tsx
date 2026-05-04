'use client';

// ----------------------------------------------------------------------
// Imports — tipos e react/motion
// ----------------------------------------------------------------------
import type { BoxProps } from '@mui/material/Box';

import { m } from 'framer-motion';

// ----------------------------------------------------------------------
// Imports — MUI
// ----------------------------------------------------------------------
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------
// Imports — app
// ----------------------------------------------------------------------
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';
import { CONFIG } from 'src/global-config';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';
import { varFade, MotionViewport } from 'src/components/animate';
import { Carousel, useCarousel, CarouselArrowFloatButtons } from 'src/components/carousel';

// ----------------------------------------------------------------------

export function HomeTeam({ sx, ...other }: BoxProps) {
  const theme = useTheme();
  const { t } = useTranslate();

  const carousel = useCarousel({
    align: 'start',
    slideSpacing: '24px',
    slidesToShow: { xs: 1, sm: 2, md: 3, lg: 4 },
  });

  const members = t('team.members', { returnObjects: true }) as {
    id: string;
    name: string;
    role: string;
    avatarUrl: string;
  }[];

  return (
    <Box
      id="team"
      component="section"
      sx={[
        {
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'transparent',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Container
        component={MotionViewport}
        sx={{ position: 'relative', zIndex: 1, py: { xs: 10, md: 15 } }}
      >
        {/* HEADER: TAG + TÍTULO E BOTÃO NA DIREITA */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ md: 'flex-end' }}
          justifyContent="space-between"
          sx={{ mb: 8, gap: 3 }}
        >
          <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            {/* TAG "TEAM" */}
            <m.div variants={varFade('inUp')}>
              <Box
                sx={{
                  display: 'inline-block',
                  border: `1px solid ${theme.palette.info.main}`,
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.5,
                  mb: 4,
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontFamily: "'Orbitron', sans-serif",
                    fontWeight: 700,
                    fontSize: 12,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'info.main',
                  }}
                >
                  {t('team.badge')}
                </Typography>
              </Box>
            </m.div>

            {/* TÍTULO HIERÁRQUICO */}
            <m.div variants={varFade('inUp')}>
              <Typography
                component="h2"
                sx={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 900,
                  fontSize: { xs: '2.2rem', md: '3rem' },
                  letterSpacing: '0.08em',
                  lineHeight: 1.2,
                  textTransform: 'uppercase',
                }}
              >
                <Box component="span" sx={{ color: 'common.white' }}>
                  {t('team.title')}
                </Box>
                <br />
                <Box component="span" sx={{ color: 'warning.main' }}>
                  {t('team.title_highlight')}
                </Box>
              </Typography>
            </m.div>
          </Box>

          {/* BOTÃO ATUALIZADO: "REATIVA & CRYSTAL" */}
          <m.div variants={varFade('inRight')}>
            <Button
              component={RouterLink}
              href={paths.team}
              endIcon={<Iconify icon="solar:double-alt-arrow-right-bold-duotone" />}
              sx={{
                height: 56,
                px: 4,
                borderRadius: 1.5,
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'common.white',
                border: 'none',
                position: 'relative',
                bgcolor: alpha('#020817', 0.6),
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                transition: theme.transitions.create(['all']),

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
                  transform: 'scale(1.05)',
                  boxShadow: `0 0 20px 0 ${alpha(theme.palette.info.main, 0.3)}`,
                  '& .MuiButton-endIcon': {
                    transform: 'translateX(4px)',
                  },
                },
              }}
            >
              {t('team.button')}
            </Button>
          </m.div>
        </Stack>

        {/* CAROUSEL */}
        <Box sx={{ position: 'relative' }}>
          <CarouselArrowFloatButtons {...carousel.arrows} options={carousel.options} />

          <Carousel carousel={carousel} sx={{ px: 0.5 }}>
            {Array.isArray(members) &&
              members.map((member) => (
                <Box
                  key={member.id}
                  component={m.div}
                  variants={varFade('in')}
                  sx={{ py: { xs: 4, md: 5 } }}
                >
                  <MemberCard member={member} />
                </Box>
              ))}
          </Carousel>
        </Box>
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

function MemberCard({
  member,
}: {
  member: { id: string; name: string; role: string; avatarUrl: string };
}) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        textAlign: 'center',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 3,
        bgcolor: alpha('#020817', 0.8),
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: theme.transitions.create(['all'], {
          duration: theme.transitions.duration.standard,
        }),

        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          padding: '1px',
          background: `linear-gradient(180deg, 
            ${alpha(theme.palette.info.main, 0.9)} 0%, 
            ${alpha(theme.palette.common.white, 0.05)} 50%, 
            ${alpha(theme.palette.warning.main, 0.9)} 100%
          )`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          zIndex: 2,
          pointerEvents: 'none',
        },

        boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.5)}`,

        '&:hover': {
          transform: 'translateY(-10px)',
          bgcolor: alpha('#020817', 0.95),
          boxShadow: `0 0 25px 0 ${alpha(theme.palette.info.main, 0.2)}`,
        },
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          mt: 3,
          mb: 0.5,
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: 700,
          textTransform: 'uppercase',
          color: 'common.white',
          letterSpacing: '0.05em',
        }}
      >
        {member.name}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          mb: 2.5,
          fontFamily: "'Public Sans', sans-serif",
          fontWeight: 500,
          color: '#919EAB',
        }}
      >
        {member.role}
      </Typography>

      <Box sx={{ px: 2.5, pb: 1 }}>
        <Image
          alt={member.name}
          src={member.avatarUrl}
          ratio="1/1"
          sx={{
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.common.white, 0.05)}`,
          }}
        />
      </Box>

      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
        {[
          { value: 'facebook', icon: 'eva:facebook-fill', path: CONFIG.socials.facebook },
          { value: 'instagram', icon: 'ant-design:instagram-filled', path: CONFIG.socials.instagram },
          { value: 'linkedin', icon: 'eva:linkedin-fill', path: CONFIG.socials.linkedin },
          { value: 'twitter', icon: 'bi:twitter-x', path: CONFIG.socials.twitter },
        ].map((social) => (
          <IconButton
            key={social.value}
            onClick={() => window.open(social.path, '_blank')}
            sx={{
              color: '#919EAB',
              '&:hover': {
                color: theme.palette.info.main,
                bgcolor: alpha(theme.palette.info.main, 0.1),
              },
            }}
          >
            <Iconify icon={social.icon as any} />
          </IconButton>
        ))}
      </Box>
    </Card>
  );
}
