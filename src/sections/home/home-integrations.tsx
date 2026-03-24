'use client';

// Importação de tipos para integridade com o componente 3D
import type { ArcData } from 'src/components/threeglobe/globe';

import { m } from 'framer-motion';
import dynamic from 'next/dynamic';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box, { type BoxProps } from '@mui/material/Box';
import { alpha, useTheme } from '@mui/material/styles';

import { useTranslate } from 'src/locales';

import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

const World = dynamic(() => import('src/components/threeglobe/globe').then((mod) => mod.World), {
  ssr: false,
  loading: () => (
    <Box sx={{ height: { xs: 400, md: 600 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h3" sx={{ opacity: 0.1, fontFamily: "'Orbitron', sans-serif", fontSize: { xs: '1rem', md: '2rem' } }}>
        INITIALIZING HUD...
      </Typography>
    </Box>
  ),
});

// ----------------------------------------------------------------------

export function HomeIntegrations({ sx, ...other }: BoxProps) {
  const theme = useTheme();
  const { t } = useTranslate();

  return (
    <Box
      component="section"
      sx={[
        {
          py: { xs: 8, md: 15 },
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'transparent',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <MotionViewport>
        <Container maxWidth="lg" sx={{ position: 'relative', minHeight: { xs: 'auto', md: 950 } }}>
          
          <SectionHeader t={t} />

          {/* Área de Visualização Técnica - Responsiva */}
          <Box 
            sx={{ 
              position: 'relative', 
              width: '100%', 
              height: { xs: 'auto', md: 800 }, 
              mt: { xs: 2, md: 5 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            
            {/* GLOBO: Ajuste de escala e posição para Mobile */}
            <Box
              sx={{
                position: { xs: 'relative', md: 'absolute' },
                top: { md: '50%' },
                left: { md: '50%' },
                transform: { md: 'translate(-50%, -50%)' },
                width: { xs: '140%', sm: '120%', md: 1100 }, 
                height: { xs: 400, sm: 500, md: 800 },
                zIndex: 1,
                pointerEvents: 'none', 
                filter: `drop-shadow(0 0 60px ${alpha(theme.palette.info.main, 0.15)})`,
                my: { xs: -8, md: 0 } 
              }}
            >
              <World 
                data={SAMPLE_ARCS} 
                globeConfig={{
                  autoRotate: true,
                  autoRotateSpeed: 0.8,
                  globeColor: '#020817'
                } as any} // FIX: Casting para evitar erro TS2769
              />
            </Box>

            {/* CAMADA HUD: Empilhamento inteligente no Mobile */}
            <Box
              sx={{
                position: 'relative',
                zIndex: 2,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 2, md: 0 },
                justifyContent: 'space-between',
                pointerEvents: 'none',
              }}
            >
              {/* Painéis Superiores */}
              <Stack 
                direction={{ xs: 'column', md: 'row' }} 
                justifyContent="space-between" 
                alignItems={{ xs: 'center', md: 'flex-start' }} 
                spacing={2}
                sx={{ width: '100%' }}
              >
                <DataPanel
                  title={t('integrations.panels.chain.title') || 'ESTADO_DA_CHAIN'}
                  label="BLOCKCHAIN_LEDGER"
                  side="left"
                  metrics={[
                    { label: 'ÚLTIMO BLOCO', value: '#8,142,002' },
                    { label: 'CONSENSO', value: 'P-NEURAL OK', color: 'info.main' },
                  ]}
                />
                <DataPanel
                  title={t('integrations.panels.power.title') || 'PODER DE CÁLCULO'}
                  label="BLOCKCHAIN_MINING"
                  side="right"
                  metrics={[
                    { label: 'HASH_RATE', value: '1.36 EB/s', color: 'warning.main' },
                    { label: 'TPS', value: '14,200' },
                  ]}
                />
              </Stack>

              {/* Painéis Inferiores */}
              <Stack 
                direction={{ xs: 'column', md: 'row' }} 
                justifyContent="space-between" 
                alignItems={{ xs: 'center', md: 'flex-end' }} 
                spacing={2}
                sx={{ width: '100%', mt: { xs: 0, md: 'auto' } }}
              >
                <DataPanel
                  title={t('integrations.panels.network.title') || 'CONSOLA_DE_REDE'}
                  label="NETWORK_TRAFFIC"
                  side="left"
                  metrics={[
                    { label: 'ENCRYPTION', value: 'UDP_SECURE' },
                    { label: 'KEY', value: 'QUANTUM_ROT', color: 'info.main' },
                  ]}
                />
                <DataPanel
                  title={t('integrations.panels.latency.title') || 'LATÊNCIA GLOBAL'}
                  label="NETWORK_TOPOLOGY"
                  side="right"
                  metrics={[
                    { label: 'AVG PING', value: '10 ms', color: 'info.main' },
                    { label: 'UPSTREAM', value: '1.2 Tbps' },
                  ]}
                />
              </Stack>
            </Box>
          </Box>
        </Container>
      </MotionViewport>
    </Box>
  );
}

// ----------------------------------------------------------------------

function SectionHeader({ t }: { t: any }) {
  const theme = useTheme();

  return (
    <Stack spacing={2} alignItems="center" sx={{ textAlign: 'center', px: 2 }}>
      <m.div variants={varFade('inUp')}>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            px: 2,
            py: 0.5,
            borderRadius: 50,
            border: `1px solid ${theme.palette.info.main}`,
            bgcolor: alpha(theme.palette.info.main, 0.1),
            backdropFilter: 'blur(10px)',
            mb: 1
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 700,
              fontSize: { xs: 8, md: 10 },
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'info.main',
            }}
          >
            {t('integrations.badge') || 'CONECTIVIDADE'}
          </Typography>
        </Box>
      </m.div>

      <m.div variants={varFade('inUp')}>
        <Typography
          variant="h2"
          sx={{
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 900,
            lineHeight: 1.1,
            textTransform: 'uppercase',
            fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3.5rem' },
            color: 'common.white'
          }}
        >
          SISTEMA DE <br />
          <Box component="span" sx={{ color: alpha(theme.palette.common.white, 0.5) }}>
            REDE E ATIVOS
          </Box>
          <br />
          <Box component="span" sx={{ color: 'warning.main' }}>
            GLOBAL
          </Box>
        </Typography>
      </m.div>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function DataPanel({ title, label, metrics, side, sx }: any) {
  const theme = useTheme();

  return (
    <Box
      component={m.div}
      variants={varFade(side === 'left' ? 'inLeft' : 'inRight')}
      sx={{
        width: { xs: '90%', sm: 340, md: 380 },
        minHeight: { xs: 160, md: 200 }, 
        p: { xs: 2, md: 3 }, 
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 1,
        pointerEvents: 'auto',
        position: 'relative',
        bgcolor: alpha('#020817', 0.8),
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        // BORDA REATIVA LATERAL (Ciano)
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: side === 'left' ? 0 : 'auto',
          right: side === 'right' ? 0 : 'auto',
          width: '3px',
          height: '100%',
          background: `linear-gradient(to bottom, ${theme.palette.info.main}, ${alpha(theme.palette.info.main, 0.2)})`,
          boxShadow: `0 0 15px ${alpha(theme.palette.info.main, 0.4)}`,
        },
        borderTop: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
        borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
        boxShadow: `0 25px 50px ${alpha(theme.palette.common.black, 0.5)}`,
        ...sx,
      }}
    >
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography 
          variant="caption" 
          sx={{ color: 'info.main', fontWeight: 800, fontSize: { xs: 9, md: 11 }, letterSpacing: 1.5, fontFamily: "'Orbitron', sans-serif" }}
        >
          {label}
        </Typography>
        <Box 
          sx={{ 
            width: 8, height: 8, borderRadius: '50%', bgcolor: 'info.main', 
            boxShadow: `0 0 10px ${theme.palette.info.main}`
          }} 
        />
      </Stack>

      <Typography 
        variant="subtitle1" 
        sx={{ 
          fontFamily: "'Orbitron', sans-serif", 
          mb: 2.5, 
          fontWeight: 800, 
          color: 'common.white', 
          textTransform: 'uppercase',
          fontSize: { xs: '0.85rem', md: '1rem' }
        }}
      >
        {title}
      </Typography>

      <Stack spacing={1.2} sx={{ flexGrow: 1 }}>
        {metrics.map((metric: any) => (
          <Stack
            key={metric.label}
            direction="row"
            justifyContent="space-between"
            sx={{ borderBottom: `1px solid ${alpha(theme.palette.grey[500], 0.1)}`, pb: 0.8 }}
          >
            <Typography 
              sx={{ 
                fontSize: 9, 
                color: '#919EAB', 
                fontWeight: 700, 
                textTransform: 'uppercase',
                fontFamily: "'Public Sans', sans-serif"
              }}
            >
              {metric.label}
            </Typography>
            <Typography
              sx={{ 
                fontSize: 11, 
                fontWeight: 800, 
                color: metric.color || 'common.white', 
                fontFamily: "'Orbitron', sans-serif" 
              }}
            >
              {metric.value}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
}

const SAMPLE_ARCS: ArcData[] = [
  { order: 1, startLat: -15.78, startLng: -47.92, endLat: 40.71, endLng: -74.0, arcAlt: 0.3, color: '#00B8D9' },
  { order: 2, startLat: -15.78, startLng: -47.92, endLat: 51.5, endLng: -0.12, arcAlt: 0.4, color: '#00B8D9' },
  { order: 3, startLat: -15.78, startLng: -47.92, endLat: 1.35, endLng: 103.8, arcAlt: 0.5, color: '#00B8D9' },
];