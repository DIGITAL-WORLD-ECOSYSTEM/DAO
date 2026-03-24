/**
 * Copyright 2026 ASPPIBRA – Associação dos Proprietários e Possuidores de Imóveis no Brasil.
 * Project: Governance System (ASPPIBRA DAO)
 * Role: Next.js Engine Configuration
 * Version: 1.6.4 - Final Clean Build (Lighthouse Optimized)
 * Goal: Subir nota Lighthouse de 36 para 90+
 */

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 1. ROTEAMENTO E SEGURANÇA
  // Mantém barras no final para consistência de indexação e evita redirects 301.
  trailingSlash: true,

  // 🔒 Ativa o modo estrito para garantir a integridade dos estados da DAO.
  reactStrictMode: true,

  // ----------------------------------------------------------------------
  // 🚀 PERFORMANCE & BUNDLE OPTIMIZATION (Foco em TBT e LCP)
  // ----------------------------------------------------------------------
  
  // Ativa compressão para reduzir o bundle de JS (essencial para conexões rurais).
  compress: true,

  // Remove Source Maps no build de produção para reduzir peso e proteger a lógica.
  productionBrowserSourceMaps: false,

  /**
   * 🛠️ Otimizações de pacotes e flags experimentais.
   * O Next.js 16 detecta automaticamente o arquivo de proxy/middleware na pasta src.
   */
  experimental: {
    // Reduz o tempo de bloqueio (TBT) carregando apenas o necessário do MUI e Iconify.
    optimizePackageImports: [
      '@mui/material',
      '@mui/x-data-grid',
      '@mui/x-date-pickers',
      '@iconify/react',
      'framer-motion',
      'es-toolkit',
    ],
  },

  // ----------------------------------------------------------------------
  // 🖼️ OTIMIZAÇÃO DE IMAGENS (FOCO EM CONEXÕES RURAIS/MÓVEIS)
  // ----------------------------------------------------------------------
  images: {
    /** * 🟢 MELHORIA LCP: unoptimized setado como FALSE.
     * Permite o redimensionamento automático para WebP/AVIF via Vercel/R2.
     */
    unoptimized: false,
    
    // Prioriza AVIF por ser o formato mais leve do mercado atual.
    formats: ['image/avif', 'image/webp'],
    
    // Whitelist do bucket R2 para processamento seguro de mídia.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-15c2a7d2de27447584fea9f9be60585b.r2.dev',
        pathname: '/**',
      },
    ],
  },

  // ----------------------------------------------------------------------
  // 🔒 ESTABILIDADE DO BUILD
  // ----------------------------------------------------------------------

  // Impede deploys se houver erros de tipagem.
  typescript: {
    ignoreBuildErrors: false,
  },

  // ----------------------------------------------------------------------
  // 🛠️ DEV TOOLS & COMPATIBILIDADE (Cloud Workstations HMR fix)
  // ----------------------------------------------------------------------
  allowedDevOrigins: [
    '8082-firebase-socialfi-1769577659883.cluster-hkcruqmgzbd2aqcdnktmz6k7ba.cloudworkstations.dev',
  ],

  /**
   * Suporte nativo para transformar SVGs em componentes React.
   */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },

  /**
   * Otimizações para o motor Turbopack.
   */
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
};

export default nextConfig;