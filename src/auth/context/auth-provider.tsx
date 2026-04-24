/**
 * Copyright 2026 ASPPIBRA – Associação dos Proprietários e Possuidores de Imóveis no Brasil.
 * Project: Governance System (ASPPIBRA DAO)
 * Role: Auth Context Provider (Core Logic)
 * Version: 1.2.0 - Production Ready (Cookie-Sync & Hybrid Persistence)
 */

'use client';

import type { User, AuthState } from '../types';

import { useSetState } from 'minimal-shared/hooks';
import { useMemo, useEffect, useCallback } from 'react';

import axios, { endpoints } from 'src/lib/axios';

import { CONFIG } from 'src/global-config';

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
  displayName:
    user?.displayName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Membro DAO',
  role: user?.role || 'citizen',
  photoURL: user?.photoURL || CONFIG.assets.fallback.avatar,
  accessToken,
});

export function AuthProvider({ children }: Props) {
  // Estado inicial unificado usando o hook de performance da minimal-shared
  const { state, setState } = useSetState<AuthState>({
    user: null,
    loading: true,
  });

  /**
   * [1] CHECK SESSION - Validação de persistência (F5 / Refresh)
   * Garante que o estado do React seja sincronizado com o cookie lido pelo Middleware.
   */
  const checkUserSession = useCallback(async () => {
    try {
      // Priorizamos o localStorage para velocidade, mas o setSession sincroniza o Cookie
      const accessToken =
        typeof window !== 'undefined' ? localStorage.getItem(JWT_STORAGE_KEY) : null;

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
   * [2] SIGN IN - Autenticação por credenciais
   * Inclui sanitização de string para evitar falhas comuns de digitação.
   */
  const signIn = useCallback(
    async (email: string, password: string) => {
      const res = await axios.post(endpoints.auth.signIn, {
        email: email.trim().toLowerCase(), // Sanitização idêntica ao Backend
        password,
      });

      const { accessToken, user } = res.data;

      if (!accessToken) throw new Error('Credencial corrompida: Token não recebido.');

      const sessionUser = mapUser(user, accessToken);

      // 🟢 Persiste no Cookie e localStorage
      setSession(accessToken);
      setState({ user: sessionUser, loading: false });

      return sessionUser;
    },
    [setState]
  );

  /**
   * [3] SIGN UP - Registro de novo Cidadão DAO
   */
  const signUp = useCallback(
    async (data: any) => {
      const res = await axios.post(endpoints.auth.signUp, data);

      const { accessToken, user } = res.data;

      if (!accessToken) throw new Error('Erro ao gerar sessão pós-registro.');

      const sessionUser = mapUser(user, accessToken);

      setSession(accessToken);
      setState({ user: sessionUser, loading: false });

      return sessionUser;
    },
    [setState]
  );

  /**
   * [4] SIGN OUT - Destruição de sessão
   * Limpa cookies e storage para que o Middleware bloqueie o acesso imediatamente.
   */
  const signOut = useCallback(async () => {
    setSession(null);
    setState({ user: null, loading: false });
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
      signIn,
      signUp,
      signOut,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
