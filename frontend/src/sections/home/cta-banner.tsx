'use client';

// ----------------------------------------------------------------------
// Imports — tipos e motion
// ----------------------------------------------------------------------
import type { BoxProps } from '@mui/material/Box';

import { m } from 'framer-motion';
import { varAlpha } from 'minimal-shared/utils';

// ----------------------------------------------------------------------
// Imports — MUI
// ----------------------------------------------------------------------
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { alpha, useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------
// Imports — app
// ----------------------------------------------------------------------
import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';
import { CONFIG } from 'src/global-config';

import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export function CtaBanner({ sx, ...other }: BoxProps) {
  const theme = useTheme();
  const { t } = useTranslate();

  const renderDescription = () => (
    <Stack 
      spacing={5} 
      sx={{ 
        zIndex: 9,
        alignItems: { xs: 'center', md: 'flex-start' }
      }}
    >
      <Stack spacing={2}>
        <Typography
          component={m.h2}
          variants={varFade('inDown', { distance: 24 })}
          sx={{
            m: 0,
            color: 'common.white',
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 900,
            fontSize: { xs: '2.2rem', md: '3.5rem' },
            lineHeight: 1.1,
            textTransform: 'uppercase',
          }}
        >
          <Box component="span" sx={{ color: 'common.white' }}>
            {t('cta.title') || 'Pronto para'}
          </Box>
          <br />
          <Box component="span" sx={{ color: alpha('#fff', 0.5) }}>
            {t('cta.title_bridge') || 'Começar a'}
          </Box>
          <br />
          <Box component="span" sx={{ color: 'warning.main' }}>
            {t('cta.title_highlight') || 'Evoluir?'}
          </Box>
        </Typography>
      </Stack>

      <m.div variants={varFade('inRight', { distance: 24 })}>
        <Button
          component={RouterLink}
          href={paths.dashboard.root}
          endIcon={<Iconify icon="solar:double-alt-arrow-right-bold-duotone" />}
          sx={{ 
            height: 56,
            px: 4,
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
            // BOTÃO CRYSTAL (BORDA CIANO)
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
            }
          }}
        >
          {t('cta.button') || 'Explorar Agora'}
        </Button>
      </m.div>
    </Stack>
  );

  const renderImage = () => (
    <m.div variants={varFade('inUp')}>
      <Box
        component={m.img}
        animate={{ y: [-15, 0, -15] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        alt="Rocket"
        src={`${CONFIG.assetsDir}/assets/illustrations/illustration-rocket-large.webp`}
        sx={{
          zIndex: 9,
          width: { xs: 240, md: 360 },
          aspectRatio: '1/1',
          position: 'relative',
          filter: `drop-shadow(0 0 40px ${alpha(theme.palette.info.main, 0.3)})`,
        }}
      />
    </m.div>
  );

  const renderBlur = () => (
    <Box
      component="span"
      sx={{
        top: 0,
        right: 0,
        zIndex: 7,
        width: 1,
        opacity: 0.3,
        maxWidth: 420,
        aspectRatio: '1/1',
        position: 'absolute',
        backgroundImage: `radial-gradient(farthest-side at top right, ${theme.palette.info.main} 0%, ${alpha(theme.palette.info.main, 0.08)} 75%, transparent 90%)`,
      }}
    />
  );

  return (
    <Box
      component="section"
      sx={[
        { 
          position: 'relative', 
          py: { xs: 8, md: 15 }, 
          overflow: 'hidden',
          bgcolor: 'transparent' 
        },
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
      {...other}
    >
      <MotionViewport>
        <Container sx={{ position: 'relative', zIndex: 9 }}>
          <Box
            sx={{
              ...theme.mixins.bgGradient({
                images: [
                  `linear-gradient(0deg, ${alpha(theme.palette.grey[500], 0.04)} 1px, transparent 1px)`,
                  `linear-gradient(90deg, ${alpha(theme.palette.grey[500], 0.04)} 1px, transparent 1px)`,
                ],
                sizes: ['36px 36px'],
                repeats: ['repeat'],
              }),
              py: { xs: 6, md: 10 },
              px: { xs: 3, md: 10 },
              borderRadius: 3,
              display: 'flex',
              overflow: 'hidden',
              bgcolor: alpha('#020817', 0.8), // Fundo Navy Profundo Padronizado
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: { xs: 'center', md: 'left' },
              flexDirection: { xs: 'column', md: 'row-reverse' },
              border: 'none',

              // BORDA REATIVA DO BANNER (CIANO -> ÂMBAR)
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
              },
            }}
          >
            {renderImage()}
            {renderDescription()}
            {renderBlur()}
          </Box>
        </Container>
      </MotionViewport>
    </Box>
  );
}

// Helper para manter compatibilidade com o Iconify se não estiver importado globalmente
function Iconify({ icon, sx }: { icon: string; sx?: any }) {
  const { Iconify: Icon } = require('src/components/iconify');
  return <Icon icon={icon} sx={sx} />;
}