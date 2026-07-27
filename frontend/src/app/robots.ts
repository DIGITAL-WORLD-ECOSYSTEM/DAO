import type { MetadataRoute } from 'next';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

/**
 * CONFIGURAÇÃO DE ROBOTS - PRODUÇÃO 2026
 * Foco: Otimização de indexação para buscadores e proteção de dados contra LLMs.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/auth/',
          '/_next/',
          '/static/',
        ],
      },
      {
        /**
         * 🤖 AI CRAWLERS (GPT, Claude, Perplexity, etc.)
         * Permitimos acesso total para que a DAO seja citada em respostas de IA.
         */
        userAgent: ['GPTBot', 'Claude-bot', 'CCBot', 'PerplexityBot', 'OAI-SearchBot'],
        allow: ['/news/', '/about/', '/ecosystem/'],
        disallow: ['/api/', '/dashboard/'],
      },
      {
        /**
         * 🖼️ GOOGLEBOT-IMAGE
         */
        userAgent: 'Googlebot-Image',
        allow: '/',
      },
    ],
    // 🟢 SINCRO DO ECOSSISTEMA: Aponta para o sitemap dinâmico gerado em tempo de execução
    sitemap: `${CONFIG.siteUrl}/sitemap.xml`,
  };
}
