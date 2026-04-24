'use client';

import { useAccount, useReadContract } from 'wagmi';

// ABI Minimalista para verificação de saldo (ERC20 ou ERC721)
const MINIMAL_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
] as const;

// ----------------------------------------------------------------------

type TokenGatingOptions = {
  contractAddress?: string;
  minBalance?: bigint;
};

/**
 * Hook para Verificação de Tokens/SBTs
 *
 * Exemplo:
 * const { hasToken } = useTokenGating({
 *   contractAddress: '0x...',
 *   minBalance: 1n
 * });
 */
export function useTokenGating({
  contractAddress,
  minBalance = BigInt(1),
}: TokenGatingOptions = {}) {
  const { address, isConnected } = useAccount();

  // Se não houver endereço de contrato definido, assumimos que não há restrição de token por padrão
  // (Ou podemos retornar false se for obrigatório). Para o ASPPIBRA, usaremos como opcional.
  const {
    data: balance,
    isLoading,
    isError,
  } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: MINIMAL_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!contractAddress && isConnected,
    },
  });

  const hasAccess = typeof balance === 'bigint' && balance >= (minBalance ?? BigInt(1));

  return {
    hasAccess,
    balance: balance as bigint | undefined,
    isLoading,
    isError,
    isConnected,
  };
}
