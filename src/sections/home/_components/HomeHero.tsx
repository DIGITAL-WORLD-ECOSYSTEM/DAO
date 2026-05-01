'use client';

// ----------------------------------------------------------------------
// Imports — Fontes, tipos e motion
// ----------------------------------------------------------------------
// Fontes agora importadas via app/layout.tsx e NextFont

import type { BoxProps } from '@mui/material/Box';
import type { Breakpoint } from '@mui/material/styles';

// ----------------------------------------------------------------------
// Imports — MUI e App
// ----------------------------------------------------------------------
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------
// Configurações
// ----------------------------------------------------------------------
const mdKey: Breakpoint = 'md';

// ----------------------------------------------------------------------
// Componente Principal
// ----------------------------------------------------------------------
export function HomeHero({ sx, ...other }: BoxProps) {
  const theme = useTheme();
  const { t } = useTranslate();

  // --- Render Helpers ---

  const renderHeading = () => (
    <Box>
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
            fontFamily: 'var(--font-orbitron), "Orbitron", sans-serif',
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
          fontFamily: 'var(--font-orbitron), "Orbitron", sans-serif',
        }}
      >
        <Box component="span" sx={{ color: 'common.white' }}>
          {t('hero.title')}
        </Box>
        <br />
        <Box component="span" sx={{ color: alpha(theme.palette.common.white, 0.85) }}>
          {t('hero.title_bridge')}
        </Box>
        <br />
        <Box
          component="span"
          sx={{
            ...theme.mixins.textGradient(
              `300deg, ${theme.palette.primary.main} 0%, ${theme.palette.info.main} 50%, ${theme.palette.primary.light} 100%`
            ),
            display: 'inline-block',
            textShadow: `0 0 20px ${alpha(theme.palette.primary.main, 0.35)}`,
          }}
        >
          {t('hero.title_highlight')}
        </Box>
      </Box>
    </Box>
  );

  const renderText = () => (
    <Box>
      <Typography
        sx={{
          maxWidth: 640,
          mt: 3,
          color: '#919EAB', // Padronizado com Public Sans Secundário
          fontSize: { xs: 18, md: 20 },
          lineHeight: 1.6,
          fontWeight: 500,
          fontFamily: 'var(--font-public-sans), "Public Sans", sans-serif',
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        {t('hero.description')}
      </Typography>
    </Box>
  );

  const renderButtons = () => (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent={{ xs: 'center', md: 'flex-start' }}
      spacing={2}
      sx={{ mt: 5 }}
    >
      <Box>
        {/* 🟢 Botão Principal: Estilo Crystal (Fundo Deep + Borda Reativa Ciano) */}
        <Button
          component={RouterLink}
          href={paths.whitepaper}
          size="large"
          startIcon={<Iconify width={24} icon="solar:file-bold-duotone" />}
          sx={{
            height: 60,
            px: 4,
            fontSize: 16,
            fontFamily: 'var(--font-orbitron), "Orbitron", sans-serif',
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
      </Box>

      <Box>
        {/* ✨ Botão Secundário: Estilo Crystal (Borda Reativa Info/Ciano) */}
        <Button
          component={RouterLink}
          href={paths.ecosystem}
          size="large"
          endIcon={<Iconify width={24} icon="solar:double-alt-arrow-right-bold-duotone" />}
          sx={{
            height: 60,
            px: 4,
            fontSize: 16,
            fontFamily: 'var(--font-orbitron), "Orbitron", sans-serif',
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
      </Box>
    </Stack>
  );

  return (
    <Box
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
      <Box sx={{ width: 1, position: 'relative', zIndex: 10 }}>
        <Container>
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
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
