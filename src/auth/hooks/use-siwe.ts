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

import { useState, useCallback } from 'react';
import { createPublicClient, http, getAddress } from 'viem';
import { mainnet } from 'viem/chains';

import axios, { endpoints } from 'src/lib/axios';
import { paths } from 'src/routes/paths';
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
  const [status, setStatus] = useState<SiweStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const signInWithWallet = useCallback(async () => {
    setError(null);
    setStatus('connecting');

    try {
      // 1. Detectar provedor Ethereum
      const eth = (window as any).ethereum;
      if (!eth) {
        throw new Error(
          'Nenhuma carteira Web3 detectada. Instale o MetaMask ou use o Brave Wallet.'
        );
      }

      // 2. Solicitar contas ao usuário
      const accounts: string[] = await eth.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        throw new Error('Nenhuma conta selecionada na carteira.');
      }

      const rawAddress = accounts[0];
      const address = getAddress(rawAddress); // Checksum EIP-55

      setStatus('signing');

      // 3. Obter nonce do backend
      const nonceRes = await axios.get(`${endpoints.auth.web3Nonce}?address=${address}`);
      const { nonce, message } = nonceRes.data;

      if (!nonce) throw new Error('Falha ao obter nonce do servidor.');

      // 4. Solicitar assinatura da mensagem
      const signature: string = await eth.request({
        method: 'personal_sign',
        params: [message, address],
      });

      setStatus('verifying');

      // 5. Verificar assinatura no backend
      const verifyRes = await axios.post(endpoints.auth.web3Verify, {
        message,
        signature,
        address,
      });

      const { accessToken } = verifyRes.data;
      if (!accessToken) throw new Error('Token não recebido do servidor.');

      // 6. Salvar sessão e redirecionar (full reload para reinicializar AuthProvider)
      setSession(accessToken);
      window.location.href = paths.dashboard.root;
    } catch (err: any) {
      // Erros do usuário (rejeição de assinatura)
      const isUserRejected =
        err?.code === 4001 || err?.message?.includes('rejected') || err?.message?.includes('denied');

      setError(
        isUserRejected
          ? 'Assinatura recusada pela carteira.'
          : err?.response?.data?.message || err?.message || 'Erro desconhecido.'
      );
      setStatus('error');
    }
  }, []);

  return { status, error, signInWithWallet };
}
