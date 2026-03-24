import type { Metadata } from 'next';

import { HomeView } from 'src/sections/home/view';

// ----------------------------------------------------------------------

/**
 * LANDING PAGE PRINCIPAL - ASPPIBRA-DAO
 * Foco: Atração de investidores RWA, produtores e parceiros estratégicos.
 */

// ✅ BLINDAGEM OBRIGATÓRIA:
// Landing Pages utilizam componentes pesados de animação (Framer Motion).
// O runtime 'nodejs' garante a estabilidade do deploy e evita limites de execução.
export const runtime = 'nodejs';

export const metadata: Metadata = {
  title: 'ASPPIBRA - Governança Digital e Infraestrutura de Ativos Reais (RWA)',
  description:
    'Liderando a tokenização no agronegócio. Conectamos pequenos produtores ao mercado de capitais através de Blockchain, IA e storage descentralizado IPFS.',
  keywords: [
    'ASPPIBRA',
    'RWA',
    'Real World Assets',
    'Tokenização de Ativos',
    'Blockchain Agro',
    'Governança Digital',
    'Agroecologia Paraty',
    'Investimento Sustentável'
  ],
  openGraph: {
    title: 'ASPPIBRA - O Futuro do Agronegócio é Digital',
    description: 'Plataforma de Governança e Tokenização de Ativos Reais para o produtor brasileiro.',
  },
};

export default function Page() {
  return <HomeView />;
}