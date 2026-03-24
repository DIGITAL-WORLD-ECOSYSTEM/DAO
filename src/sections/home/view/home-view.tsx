'use client';

import dynamic from 'next/dynamic';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { useBoolean } from 'src/hooks/use-boolean';

// ✅ NOVA ARQUITETURA: Importação do Background Modular Global
// Este componente agora orquestra o Space, FlowerOfLife, GlassCube e SceneController
import { HomeBackground } from 'src/components/background';
import { BackToTopButton } from 'src/components/animate/back-to-top-button';
import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress'; 

// Componentes Críticos (Immediate Loading para LCP)
import { HomeHero } from '../home-hero';
import { HomeEcosystem } from '../home-ecosystem';

// ✅ Lazy Loading Otimizado para Produção (SSR: false para componentes com Three.js/Browser APIs)
const HomeIntegrations = dynamic(() => import('../home-integrations').then((m) => m.HomeIntegrations), { ssr: false });
const HomeCommunity = dynamic(() => import('../home-community').then((m) => m.HomeCommunity), { ssr: false });
const HomeTeam = dynamic(() => import('../home-team').then((m) => m.HomeTeam), { ssr: false });
const HomeLatestNews = dynamic(() => import('../home-latest-news').then((m) => m.HomeLatestNews), { ssr: false });
const HomeRoadmap = dynamic(() => import('../home-roadmap').then((m) => m.HomeRoadmap), { ssr: false });
const HomeFAQs = dynamic(() => import('../home-faqs').then((m) => m.HomeFAQs), { ssr: false });
const CtaBanner = dynamic(() => import('../cta-banner').then((m) => m.CtaBanner), { ssr: false });
const HomeCountdownDialog = dynamic(() => import('../components/home-countdown-dialog'), { ssr: false });

// ----------------------------------------------------------------------

export function HomeView() {
  const pageProgress = useScrollProgress();
  const countdown = useBoolean(true);

  // DATA ALVO: Lançamento SocialFi Alpha (15 de Abril de 2026)
  const TARGET_DATE = new Date('2026-04-15T00:00:00');

  return (
    <>
      <ScrollProgress
        variant="linear"
        progress={pageProgress.scrollYProgress}
        sx={[(theme) => ({ position: 'fixed', zIndex: theme.zIndex.appBar + 1 })]}
      />

      <BackToTopButton />

      {/* 🌌 FUNDO ÚNICO E MODULAR: 
          Agora gerenciado em src/components/background/index.tsx.
          Mantém a consistência visual em toda a experiência SocialFi.
      */}
      <HomeBackground />

      {/* Conteúdo Principal: 
          zIndex: 1 garante que o conteúdo fique sobre o Canvas 3D.
          bgcolor: 'transparent' nas seções permite visualizar o vácuo sideral.
      */}
      <Box component="main" sx={{ position: 'relative', zIndex: 1 }}>
        
        <HomeHero />

        <Stack sx={{ position: 'relative', bgcolor: 'transparent' }}>
          <HomeEcosystem />

          <HomeIntegrations />

          <HomeCommunity />

          <HomeTeam />

          <HomeLatestNews />

          <HomeRoadmap />

          <HomeFAQs />

          <CtaBanner />
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