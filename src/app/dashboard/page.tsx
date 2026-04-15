/**
 * Copyright 2026 ASPPIBRA – Associação dos Proprietários e Possuidores de Imóveis no Brasil.
 * Project: Governance System (ASPPIBRA DAO)
 * Role: Dashboard Main Page (Server Component)
 * Version: 1.3.2 - Performance & Static Optimization
 */

import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';

import { OverviewAppView } from 'src/sections/overview/app/view';

// ----------------------------------------------------------------------

/** * 🛠️ CONFIGURAÇÃO DE RUNTIME (ESTABILIDADE):
 * Mudança de 'edge' para 'nodejs' para garantir compatibilidade total com
 * bibliotecas de gráficos (Chart.js/ApexCharts) e aumentar o limite de memória
 * para 50MB, evitando quebras em relatórios densos da DAO.
 */
export const runtime = 'nodejs';

/**
 * 🚀 OTIMIZAÇÃO DE RENDERIZAÇÃO:
 * 'force-dynamic' garante que as métricas de ativos reais (RWA) e dados do banco D1
 * sejam buscados na API em cada requisição, evitando que o dashboard exiba
 * informações cacheadas ou desatualizadas para o administrador.
 */
export const dynamic = 'force-dynamic';

/**
 * 📈 METADADOS DE SEO:
 * Define o título dinâmico da página utilizando as configurações globais do app.
 */
export const metadata: Metadata = {
  title: `Dashboard - ${CONFIG.appName}`,
  description: `Visão geral do ecossistema ASPPIBRA DAO - Gestão de Ativos e Governança.`,
};

// ----------------------------------------------------------------------

/**
 * COMPONENTE DE PÁGINA (SERVER COMPONENT):
 * Atua como o ponto de entrada para a visualização principal do Dashboard.
 * Por ser um Server Component, reduz o bundle de JavaScript enviado ao cliente.
 */
export default function Page() {
  return <OverviewAppView />;
}
