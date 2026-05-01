'use client';

import dynamic from 'next/dynamic';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { useBoolean } from 'src/hooks/use-boolean';

// ✅ NOVA ARQUITETURA: Importação do Background Modular Global
import { HomeBackground } from 'src/components/background';
import { LazyRender } from 'src/components/animate/lazy-render';
import { BackToTopButton } from 'src/components/animate/back-to-top-button';

// Componentes Críticos (Immediate Loading para LCP)
import { HomeHero } from '../_components/HomeHero';
import { HomeEcosystem } from '../_components/HomeEcosystem';

// ✅ Lazy Loading Otimizado para Produção (SSR: false para componentes com Browser APIs)
const HomeIntegrations = dynamic(
  () => import('../_components/HomeIntegrations').then((m) => m.HomeIntegrations),
  { ssr: false }
);
const HomeCommunity = dynamic(() => import('../_components/HomeCommunity').then((m) => m.HomeCommunity), {
  ssr: false,
});
const HomeTeam = dynamic(() => import('../_components/HomeTeam').then((m) => m.HomeTeam), { ssr: false });
const HomeLatestNews = dynamic(() => import('../_components/HomeLatestNews').then((m) => m.HomeLatestNews), {
  ssr: false,
});
const HomeRoadmap = dynamic(() => import('../_components/HomeRoadmap').then((m) => m.HomeRoadmap), {
  ssr: false,
});
const HomeFAQs = dynamic(() => import('../_components/HomeFaqs').then((m) => m.HomeFaqs), { ssr: false });
const HomeCtaBanner = dynamic(() => import('../_components/HomeCtaBanner').then((m) => m.HomeCtaBanner), { ssr: false });
const HomeCountdownDialog = dynamic(() => import('../_components/HomeCountdownDialog'), {
  ssr: false,
});

// ----------------------------------------------------------------------

export function HomeView() {
  const countdown = useBoolean(true);

  // DATA ALVO: Lançamento SocialFi Alpha (15 de Maio de 2026)
  const TARGET_DATE = new Date('2026-05-15T00:00:00');

  return (
    <>
      <BackToTopButton />

      {/* 🌌 FUNDO ÚNICO E MODULAR */}
      <HomeBackground />

      <Box component="main" sx={{ position: 'relative', zIndex: 1 }}>
        <HomeHero />

        <Stack sx={{ position: 'relative', bgcolor: 'transparent' }}>
          <LazyRender minHeight={800}>
            <HomeEcosystem />
          </LazyRender>

          <LazyRender minHeight={950}>
            <HomeIntegrations />
          </LazyRender>

          <LazyRender minHeight={800}>
            <HomeCommunity />
          </LazyRender>

          <LazyRender minHeight={800}>
            <HomeTeam />
          </LazyRender>

          <LazyRender minHeight={800}>
            <HomeLatestNews />
          </LazyRender>

          <LazyRender minHeight={900}>
            <HomeRoadmap />
          </LazyRender>

          <LazyRender minHeight={600}>
            <HomeFAQs />
          </LazyRender>

          <LazyRender minHeight={400}>
            <HomeCtaBanner />
          </LazyRender>
        </Stack>
      </Box>

      {/* Dialog de contagem regressiva — Lançamento Alpha */}
      <HomeCountdownDialog
        open={countdown.value}
        onClose={countdown.onFalse}
        targetDate={TARGET_DATE}
      />
    </>
  );
}
