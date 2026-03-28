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
          '/api/',        // Bloqueia rotas de backend (segurança e SEO técnico)
          '/dashboard/',  // Áreas logadas não devem gastar Crawl Budget
          '/auth/',       // Protege fluxos de autenticação (sign-in/sign-up)
          '/_next/',      // Arquivos de sistema do Next.js
          '/static/',     // Assets estáticos não indexáveis diretamente
        ],
      },
      {
        /**
         * PROTEÇÃO DE CONTEÚDO (IA/LLM)
         * Evita que o GPTBot utilize seus posts de governança e ativos RWA 
         * para treinamento sem gerar tráfego direto.
         */
        userAgent: 'GPTBot',
        disallow: ['/post/'], 
      },
      {
        /**
         * GOOGLEBOT-IMAGE
         * Garante que as imagens de ativos (como os OG-images gerados) sejam indexadas.
         */
        userAgent: 'Googlebot-Image',
        allow: '/',
      }
    ],
    // 🟢 SINCRO DO ECOSSISTEMA: Aponta para o sitemap dinâmico gerado em tempo de execução
    sitemap: `${CONFIG.siteUrl}/sitemap.xml`,
  };
}