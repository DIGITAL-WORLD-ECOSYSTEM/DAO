import type { MetadataRoute } from 'next';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

/**
 * MANIFESTO ESTRATÉGICO DE GOVERNANÇA DIGITAL - PRODUÇÃO 2026
 * Foco: Atração de Venture Capital e posicionamento em ecossistemas Web3/RWA.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `DEX World - ${CONFIG.appName} Governance`, 
    short_name: 'ASPPIBRA-DAO',
    description: 'Infraestrutura de Governança Digital e RWA: Integração nativa com DeFi, storage IPFS descentralizado e IA aplicada à gestão de ativos tokenizados em Blockchain.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0A192F', // Azul Profundo: Transmite segurança e tecnologia avançada
    theme_color: '#00A15D',      // Verde Sustentabilidade: O equilíbrio entre Agro e Web3
    orientation: 'portrait' as const,
    
    // Categorias estratégicas para ranqueamento em diretórios de investidores e tech
    categories: ['finance', 'business', 'productivity', 'utilities'], 
    
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/logo/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any' as const,
      },
      {
        src: '/logo/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable' as const, // Essencial para ícones adaptativos no Android
      },
      {
        src: '/logo/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}