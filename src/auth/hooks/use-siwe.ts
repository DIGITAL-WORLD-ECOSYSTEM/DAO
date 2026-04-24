/**
 * useSiwe — Hook SIWE (Sign-In With Ethereum)
 *
 * Encapsula o fluxo completo de autenticação Web3:
 *   1. Detecta e conecta window.ethereum (MetaMask / Brave Wallet)
 *   2. Obtém nonce do backend
 *   3. Solicita assinatura da carteira
 *   4. Verifica no backend → recebe JWT
 *   5. Persiste sessão → redireciona para dashboard
 */

'use client';

import { getAddress } from 'viem';
import { useState, useCallback } from 'react';
import { useAccount, useSignMessage } from 'wagmi';

import { paths } from 'src/routes/paths';
import axios, { endpoints } from 'src/lib/axios';

import { CONFIG } from 'src/global-config';
import { setSession } from 'src/auth/context/utils';

// ---------------------------------------------------------------------------

export type SiweStatus = 'idle' | 'connecting' | 'signing' | 'verifying' | 'error';

export interface UseSiweReturn {
  status: SiweStatus;
  error: string | null;
  signInWithWallet: () => Promise<void>;
}

// ---------------------------------------------------------------------------

export function useSiwe(): UseSiweReturn {
  const { address: wagmiAddress, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const [status, setStatus] = useState<SiweStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const signInWithWallet = useCallback(async () => {
    setError(null);
    setStatus('connecting');

    try {
      // 1. Verificar conexão da carteira via Wagmi
      if (!isConnected || !wagmiAddress) {
        throw new Error('Por favor, conecte sua carteira primeiro.');
      }

      const address = getAddress(wagmiAddress); // Checksum EIP-55

      setStatus('signing');

      // 2. Obter nonce do backend
      const nonceRes = await axios.get(`${endpoints.auth.web3Nonce}?address=${address}`);
      const { nonce, message } = nonceRes.data;

      if (!nonce) throw new Error('Falha ao obter nonce do servidor.');

      // 3. Solicitar assinatura da mensagem via hooks do Wagmi
      const signature = await signMessageAsync({ message });

      setStatus('verifying');

      // 4. Verificar assinatura no backend
      const verifyRes = await axios.post(endpoints.auth.web3Verify, {
        message,
        signature,
        address,
      });

      const { accessToken, user } = verifyRes.data;
      if (!accessToken) throw new Error('Token não recebido do servidor.');

      // 5. Redirecionamento Inteligente (RBAC)
      const role = user?.role || 'citizen';
      const defaultPath =
        CONFIG.auth.defaultPathByRole[role as keyof typeof CONFIG.auth.defaultPathByRole] ||
        paths.dashboard.root;

      // 6. Salvar sessão e redirecionar (full reload para reinicializar AuthProvider)
      setSession(accessToken);
      window.location.href = defaultPath;
    } catch (err: any) {
      // Erros do usuário (rejeição de assinatura)
      const isUserRejected =
        err?.code === 4001 ||
        err?.message?.includes('rejected') ||
        err?.message?.includes('denied') ||
        err?.name === 'UserRejectedRequestError';

      setError(
        isUserRejected
          ? 'Assinatura recusada pela carteira.'
          : err?.response?.data?.message || err?.message || 'Erro desconhecido.'
      );
      setStatus('error');
    }
  }, [isConnected, wagmiAddress, signMessageAsync]);

  return { status, error, signInWithWallet };
}
