/**
 * Copyright 2026 ASPPIBRA – Associação dos Proprietários e Possuidores de Imóveis no Brasil.
 * Project: Governance System (ASPPIBRA DAO)
 * Role: Auth Context Provider (Core Logic)
 * Version: 1.2.0 - Production Ready (Cookie-Sync & Hybrid Persistence)
 */

'use client';

import type { User, AuthState } from '../types';

import { CryptoCore } from '@dao/shared';
import { useSetState } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback } from 'react';

import axios, { endpoints } from 'src/lib/axios';

import { AuthContext } from './auth-context';
import { JWT_STORAGE_KEY } from './constant';
import { setSession, isValidToken } from './utils';

type Props = { children: React.ReactNode };

/**
 * 🛠️ MAPEAMENTO DO USUÁRIO (Sanitização e Padronização)
 * Transforma o objeto bruto vindo do backend em uma entidade 'User' segura.
 * Adiciona fallbacks para evitar que o frontend quebre por campos nulos no DB.
 */
const mapUser = (user: any, accessToken: string): User => ({
  ...user,
  id: user?.id || 0,
  email: user?.email || '',
  firstName: user?.firstName || '',
  lastName: user?.lastName || '',
  displayName: user?.displayName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Membro DAO',
  role: user?.role || 'citizen', 
  photoURL: user?.photoURL || '/assets/icons/glass/ic_glass_users.png',
  accessToken,
});

export function AuthProvider({ children }: Props) {
  // Estado inicial unificado usando o hook de performance da minimal-shared
  const { state, setState } = useSetState<AuthState>({
    user: null, 
    loading: true 
  });

  /**
   * [1] CHECK SESSION - Validação de persistência (F5 / Refresh)
   * Garante que o estado do React seja sincronizado com o cookie lido pelo Middleware.
   */
  const checkUserSession = useCallback(async () => {
    try {
      // Priorizamos o localStorage para velocidade, mas o setSession sincroniza o Cookie
      const accessToken = typeof window !== 'undefined' ? localStorage.getItem(JWT_STORAGE_KEY) : null;

      if (accessToken && isValidToken(accessToken)) {
        // 🟢 VITAL: Atualiza o header do Axios e garante o Cookie para o Middleware
        setSession(accessToken);
        
        const res = await axios.get(endpoints.auth.me);
        
        // Extração polimórfica (aceita diferentes estruturas de retorno do backend)
        const userData = res.data?.data?.user || res.data?.user || res.data;
        
        const sessionUser = mapUser(userData, accessToken);
        setState({ user: sessionUser, loading: false });
      } else {
        setSession(null);
        setState({ user: null, loading: false });
      }
    } catch (error: any) {
      console.error('⚠️ Auth Error:', error);
      // Se o erro não for de rede, limpamos a sessão por segurança
      if (error.response) {
        setSession(null);
        setState({ user: null, loading: false });
      } else {
        // Erro de conexão: mantemos o estado carregando ou offline
        setState({ loading: false });
      }
    }
  }, [setState]);

  /**
   * [2] SIGN IN - Autenticação por Handshake Criptográfico (Ed25519)
   * 🛡️ Nível AAL2: Suporta desafio-resposta e MFA.
   */
  const signIn = useCallback(async (email: string, password: string, otpCode?: string) => {
    const username = email.trim().toLowerCase();
    
    // 1. Obter Desafio (Challenge) do Backend
    const challengeRes = await axios.get(endpoints.auth.challenge(username));
    const { challenge, encryptedVault: vaultStr } = challengeRes.data;
    if (!challenge) throw new Error('Falha ao obter desafio do servidor.');

    let seed: Uint8Array;

    // Se houver um cofre (Vault), descriptografamos para obter o Mnemonic original
    if (vaultStr) {
      try {
        const vault = JSON.parse(vaultStr);
        const ciphertext = Uint8Array.from(vault.ciphertext);
        const iv = Uint8Array.from(vault.iv);
        
        // A senha do usuário é a chave de descriptografia (Derivada via PBKDF2 simplificado ou direto se for forte)
        const encryptionKey = new TextEncoder().encode(password.padEnd(32, '0').slice(0, 32));
        const decryptedMnemonic = await CryptoCore.decrypt(ciphertext, encryptionKey, iv);
        const mnemonic = new TextDecoder().decode(decryptedMnemonic);
        
        // Deriva a semente da Identidade Soberana a partir do Mnemonic recuperado
        seed = await CryptoCore.deriveSeed(mnemonic, username);
      } catch (e) {
        // Fallback: se a descriptografia falhar (ex: senha errada), tentamos derivação direta da senha
        // Isso mantém compatibilidade com contas antigas sem vault
        seed = await CryptoCore.deriveSeed(password, username);
      }
    } else {
      // Fallback para login legado (Senha como Semente)
      seed = await CryptoCore.deriveSeed(password, username);
    }

    const { priv } = CryptoCore.getEd25519KeyPair(seed);

    // 3. Assinar o Desafio
    const signature = CryptoCore.sign(new TextEncoder().encode(challenge), priv);
    const signatureArray = Array.from(signature);

    // 4. Handshake de Login
    const res = await axios.post(endpoints.auth.signIn, { 
      username,
      challenge,
      signature: JSON.stringify(signatureArray),
      otpCode
    });
    
    // 🟢 Tratar MFA Required (202 Accepted)
    if (res.data.mfaRequired) {
      return { mfaRequired: true };
    }

    const { accessToken, user } = res.data.data || res.data;

    if (!accessToken) throw new Error('Credencial corrompida: Token não recebido.');

    const sessionUser = mapUser(user, accessToken);
    setSession(accessToken); 
    setState({ user: sessionUser, loading: false });
    
    return { success: true };
  }, [setState]);

  /**
   * [3] SIGN UP - Registro com Gênese de Identidade (SSI)
   */
  const signUp = useCallback(async (data: any, mnemonic: string) => {
    const { email, password, firstName, lastName } = data;
    const username = email.trim().toLowerCase();

    // 1. Obter Desafio (Challenge) do Backend
    const challengeRes = await axios.get(endpoints.auth.challenge(username));
    const { challenge } = challengeRes.data;
    if (!challenge) throw new Error('Falha ao obter desafio do servidor.');

    // 2. Derivar Identidade Soberana a partir do Mnemonic (Zero-Knowledge)
    const seed = await CryptoCore.deriveSeed(mnemonic, username);
    const { pub, priv } = CryptoCore.getEd25519KeyPair(seed);
    const publicKey = JSON.stringify(Array.from(pub));

    // 2.1 Criptografar Mnemonic para o Vault (Cofre de Recuperação)
    // Usamos a senha do usuário para proteger o Mnemonic no servidor
    const encryptionKey = new TextEncoder().encode(password.padEnd(32, '0').slice(0, 32));
    const { ciphertext, iv } = await CryptoCore.encrypt(new TextEncoder().encode(mnemonic), encryptionKey);
    const encryptedVault = JSON.stringify({
      ciphertext: Array.from(ciphertext),
      iv: Array.from(iv)
    });

    // 3. Criar Assinatura de Gênese (Prova de posse da chave)
    const signature = CryptoCore.sign(new TextEncoder().encode(challenge), priv);

    const res = await axios.post(endpoints.auth.signUp, {
      username,
      publicKey,
      signature: JSON.stringify(Array.from(signature)),
      challenge,
      firstName,
      lastName,
      encryptedVault
    });
    
    const { accessToken, user } = res.data.data || res.data;

    if (!accessToken) throw new Error('Erro ao gerar sessão pós-registro.');

    setSession(accessToken);
    setState({ user: mapUser(user, accessToken), loading: false });
  }, [setState]);

  /**
   * [4] SIGN OUT - Destruição de sessão
   * Limpa cookies e storage para que o Middleware bloqueie o acesso imediatamente.
   */
  const signOut = useCallback(async () => {
    setSession(null);
    setState({ user: null, loading: false });
  }, [setState]);

  /**
   * [5] RECLAIM IDENTITY - Recuperação Soberana (Mnemonic)
   */
  const reclaimIdentity = useCallback(async (email: string, mnemonic: string) => {
    const username = email.trim().toLowerCase();

    // 1. Derivar Semente do Mnemonic (Entropy)
    const seed = await CryptoCore.deriveSeed(mnemonic, username);
    const { priv } = CryptoCore.getEd25519KeyPair(seed);

    // 2. Handshake de Desafio
    const challengeRes = await axios.get(endpoints.auth.challenge(username));
    const { challenge } = challengeRes.data;

    // 3. Assinatura Criptográfica
    const signature = CryptoCore.sign(new TextEncoder().encode(challenge), priv);

    // 4. Handshake de Recuperação
    const res = await axios.post(endpoints.auth.signIn, {
      username,
      challenge,
      signature: JSON.stringify(Array.from(signature))
    });

    const { accessToken, user } = res.data.data || res.data;
    if (!accessToken) throw new Error('Recuperação falhou: Identidade não reconhecida pelo servidor.');

    setSession(accessToken);
    setState({ user: mapUser(user, accessToken), loading: false });
  }, [setState]);

  // Gatilho de inicialização
  useEffect(() => {
    checkUserSession();
  }, [checkUserSession]);

  // Cálculo de status derivado para evitar re-renders desnecessários
  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';
  const status = state.loading ? 'loading' : checkAuthenticated;

  /**
   * Valor do contexto memoizado para performance
   */
  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      loading: state.loading,
      authenticated: !!state.user,
      unauthenticated: !state.loading && !state.user,
      signIn,
      signUp,
      signOut,
      reclaimIdentity,
      checkUserSession,
    }),
    [checkUserSession, reclaimIdentity, signIn, signOut, signUp, state.loading, state.user]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}