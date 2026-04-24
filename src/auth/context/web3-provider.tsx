'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, polygon, bsc } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

// ----------------------------------------------------------------------

/**
 * CONFIGURAÇÃO WAGMI (v3)
 * Define as redes suportadas e o transporte (HTTP via Provedores Públicos).
 */
export const wagmiConfig = createConfig({
  chains: [mainnet, polygon, bsc],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
  },
  ssr: true, // Habilita suporte para Server-Side Rendering no Next.js
});

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function Web3Provider({ children }: Props) {
  // Inicializa o QueryClient para o portal React Query (necessário para o Wagmi v3)
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
