'use client';

// ----------------------------------------------------------------------
// Imports — Fontes, tipos e motion
// ----------------------------------------------------------------------
import '@fontsource/orbitron/900.css'; 
import '@fontsource/orbitron/700.css'; 

import type { BoxProps } from '@mui/material/Box';
import type { Breakpoint } from '@mui/material/styles';
import type { MotionProps, MotionValue } from 'framer-motion';

import { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';

// ----------------------------------------------------------------------
// Imports — MUI e App
// ----------------------------------------------------------------------
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';
import { varFade, MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------
// Configurações
// ----------------------------------------------------------------------
const mdKey: Breakpoint = 'md';

const motionProps: MotionProps = {
  variants: varFade('inUp', { distance: 24 }),
};

// ----------------------------------------------------------------------
// Componente Principal
// ----------------------------------------------------------------------
export function HomeHero({ sx, ...other }: BoxProps) {
  const theme = useTheme();
  const { t } = useTranslate();
  const { elementRef, scrollY } = useScrollData();

  // Efeitos de Scroll: Profundidade Profissional
  const opacity: MotionValue<number> = useTransform(scrollY, [0, 500], [1, 0]);
  const scale: MotionValue<number> = useTransform(scrollY, [0, 500], [1, 0.95]);

  // --- Render Helpers ---

  const renderHeading = () => (
    <m.div {...motionProps}>
      {/* 💊 A Pílula Padronizada (Padrão 2026) */}
      <Box
        sx={{
          display: 'inline-block',
          border: `1px solid ${theme.palette.info.main}`,
          borderRadius: 2,
          px: 1.5,
          py: 0.5,
          mb: 4,
          boxShadow: `0 0 12px ${alpha(theme.palette.info.main, 0.3)}`,
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
          {t('hero.badge')}
        </Typography>
      </Box>

      {/* 🎨 Título com Hierarquia de 3 Camadas de Cores */}
      <Box
        component="h1"
        sx={{
          my: 0,
          maxWidth: 720,
          typography: 'h1',
          fontWeight: 900,
          letterSpacing: '0.02em',
          fontSize: { xs: '2.5rem', md: '4.5rem' },
          lineHeight: { xs: 1.1, md: 1.05 },
          textAlign: { xs: 'center', md: 'left' },
          fontFamily: "'Orbitron', sans-serif",
        }}
      >
        <Box component="span" sx={{ color: 'common.white' }}>
          {t('hero.title')}
        </Box>
        <br />
        <Box 
          component="span" 
          sx={{ color: alpha(theme.palette.common.white, 0.5) }}
        >
          {t('hero.title_bridge')}
        </Box>
        <br />
        <Box
          component={m.span}
          animate={{ backgroundPosition: ['0% center', '200% center'] }}
          transition={{ duration: 8, ease: 'linear', repeat: Infinity }}
          sx={{
            ...theme.mixins.textGradient(
              `300deg, ${theme.palette.primary.main} 0%, ${theme.palette.info.main} 50%, ${theme.palette.primary.light} 100%`
            ),
            backgroundSize: '200% auto',
            display: 'inline-block',
            textShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.35)}`,
          }}
        >
          {t('hero.title_highlight')}
        </Box>
      </Box>
    </m.div>
  );

  const renderText = () => (
    <m.div {...motionProps}>
      <Typography
        sx={{
          maxWidth: 640,
          mt: 3,
          color: '#919EAB', // Padronizado com Public Sans Secundário
          fontSize: { xs: 18, md: 20 },
          lineHeight: 1.6,
          fontWeight: 500,
          fontFamily: "'Public Sans', sans-serif",
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        {t('hero.description')}
      </Typography>
    </m.div>
  );

  const renderButtons = () => (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent={{ xs: 'center', md: 'flex-start' }}
      spacing={2}
      sx={{ mt: 5 }}
    >
      <m.div {...motionProps}>
        {/* 🟢 Botão Principal: Estilo Crystal (Fundo Deep + Borda Reativa Ciano) */}
        <Button
          component={RouterLink}
          href="/whitepaper"
          size="large"
          startIcon={<Iconify width={24} icon="solar:file-bold-duotone" />}
          sx={{
            height: 60,
            px: 4,
            fontSize: 16,
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 700,
            borderRadius: 1.5,
            textTransform: 'uppercase',
            color: 'common.white',
            border: 'none',
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
                ${alpha(theme.palette.primary.main, 1)} 0%, 
                ${alpha(theme.palette.primary.main, 0.1)} 50%, 
                ${alpha(theme.palette.primary.main, 0.6)} 100%
              )`,
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            },
            transition: theme.transitions.create(['all']),
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              transform: 'scale(1.05)',
              boxShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.4)}`,
            },
          }}
        >
          {t('hero.buttons.whitepaper')}
        </Button>
      </m.div>

      <m.div {...motionProps}>
        {/* ✨ Botão Secundário: Estilo Crystal (Borda Reativa Info/Ciano) */}
        <Button
          component={RouterLink}
          href="/ecosystem"
          size="large"
          endIcon={<Iconify width={24} icon="solar:double-alt-arrow-right-bold-duotone" />}
          sx={{
            height: 60,
            px: 4,
            fontSize: 16,
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 700,
            borderRadius: 1.5,
            textTransform: 'uppercase',
            color: 'common.white',
            border: 'none',
            position: 'relative',
            bgcolor: alpha('#020817', 0.6),
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
            transition: theme.transitions.create(['all']),
            '&:hover': {
              bgcolor: alpha(theme.palette.info.main, 0.1),
              transform: 'scale(1.05)',
              boxShadow: `0 0 20px ${alpha(theme.palette.info.main, 0.4)}`,
            },
          }}
        >
          {t('hero.buttons.ecossistema')}
        </Button>
      </m.div>
    </Stack>
  );

  return (
    <Box
      ref={elementRef}
      component="section"
      sx={[
        {
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          pt: { xs: 12, md: 18 },
          pb: 10,
          bgcolor: 'transparent',
          overflow: 'hidden',
          [theme.breakpoints.up(mdKey)]: {
            mt: `calc(var(--layout-header-desktop-height) * -1)`,
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box
        component={m.div}
        style={{ opacity, scale }}
        sx={{ width: 1, position: 'relative', zIndex: 10 }}
      >
        <Container component={MotionContainer}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems="center"
            justifyContent="space-between"
            spacing={{ xs: 8, md: 4 }}
          >
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              {renderHeading()}
              {renderText()}
              {renderButtons()}
            </Box>

            {/* Espaço reservado para o Ativo Visual (Globo Integrations) */}
            <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' }, minHeight: 500 }} />
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

function useScrollData() {
  const elementRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  return { elementRef, scrollY };
}