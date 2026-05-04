/**
 * Copyright 2026 ASPPIBRA – Associação dos Proprietários e Possuidores de Imóveis no Brasil.
 * Project: Governance System (ASPPIBRA DAO)
 * Role: API Client Configuration (Axios Instance)
 * Version: 1.2.1 - Fix: SocialFi Endpoints Integration
 */

import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { setSession } from 'src/auth/context/utils';
import { JWT_STORAGE_KEY } from 'src/auth/context/constant';

// ----------------------------------------------------------------------

/**
 * 🛠️ CONFIGURAÇÃO DA INSTÂNCIA
 * Sincronizado com NEXT_PUBLIC_HOST_API para suportar múltiplos ambientes (Dev/Prod).
 */
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_HOST_API || 'https://api.asppibra.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 1. INTERCEPTOR DE REQUISIÇÃO
 * Injeta o Bearer Token em todas as chamadas de saída para o Backend Cloudflare.
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem(JWT_STORAGE_KEY) : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * 2. INTERCEPTOR DE RESPOSTA
 * Gerencia erros globais e força o logout (limpeza de cookies) em caso de erro 401.
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message || error?.message || 'Erro inesperado no sistema!';

    // 🕵️ MONITORAMENTO DE DEBUG (PARA TESTES EM PRODUÇÃO)
    if (typeof window !== 'undefined') {
        // Tenta fazer o parse do JSON apenas se for uma string válida
        let requestData = error?.config?.data;
        if (typeof requestData === 'string') {
          try {
            requestData = JSON.parse(requestData);
          } catch (e) {
            // Mantém como string se não for JSON
          }
        } else if (requestData instanceof FormData) {
          requestData = '[FormData]';
        }

        const debugLog = {
          timestamp: new Date().toISOString(),
          url: error?.config?.url || 'URL Indisponível',
          method: error?.config?.method || 'N/A',
          status: status || 'Network Error',
          requestData,
          responseData: error?.response?.data || null,
          error: error?.message || 'Erro de conexão ou servidor offline',
        };

      // 🔍 SILENCIAR ERROS CONHECIDOS (MOCK PHASE)
      const isExpectedMockError = status === 404 && debugLog.url.includes('/comments');

      if (!isExpectedMockError) {
        console.group('🚨 DAO API Error Debug');
        console.error('URL:', debugLog.url);
        console.error('Status:', debugLog.status);
        console.error('Payload:', JSON.stringify(debugLog.requestData, null, 2));
        console.error('Response:', JSON.stringify(debugLog.responseData, null, 2));

        if (debugLog.responseData && (debugLog.responseData as any).errors) {
          console.error('❌ VALIDATION ERRORS:', (debugLog.responseData as any).errors);
        }

        console.groupEnd();
      }

      // Armazenar para extração rápida via console
      (window as any).__DAO_DEBUG_LOGS__ = (window as any).__DAO_DEBUG_LOGS__ || [];
      (window as any).__DAO_DEBUG_LOGS__.push(debugLog);
    }

    /**
     * 🛡️ PROTEÇÃO DE SESSÃO
     * Se o token expirar, o setSession(null) limpa os Cookies para o Middleware
     * e o LocalStorage para o React, redirecionando o usuário automaticamente.
     */
    if (status === 401) {
      console.warn('🚨 Token inválido ou expirado. Executando renovação de segurança...');
      setSession(null);

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('onTokenExpired'));
      }
    }

    return Promise.reject({ message, ...error });
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

/**
 * FETCHER GENÉRICO
 * Adaptador para hooks de SWR e React Query.
 */
export const fetcher = async <T = unknown>(
  args: string | [string, AxiosRequestConfig]
): Promise<T> => {
  const [url, config] = Array.isArray(args) ? args : [args, {}];
  const res = await axiosInstance.get<T>(url, config);
  return res.data;
};

// ----------------------------------------------------------------------

/**
 * ENDPOINTS DA PLATAFORMA
 * 🟢 RESTAURADO: Bloco 'post' reincluído para compatibilidade com o Blog SocialFi.
 */
export const endpoints = {
  auth: {
    me: '/api/core/identity/me',
    signIn: '/api/core/identity/local/login',
    signUp: '/api/core/identity/local/register',
    forgotPassword: '/api/core/identity/local/forgot-password',
    resetPassword: '/api/core/identity/local/reset-password',

    // Legacy Fallbacks
    updatePassword: '/api/core/identity/local/update-password',
    verify: '/api/core/identity/local/verify',

    // Web3
    web3Nonce: '/api/core/identity/web3/nonce',
    web3Verify: '/api/core/identity/web3/verify',
  },
  // 🚀 SocialFi & Blog Integration
  post: {
    root: '/api/posts',
    list: '/api/posts',
    details: (title: string) => `/api/posts/${title}`,
    latest: '/api/posts/latest',
    search: '/api/posts/search',
  },
  // Agroecological Management
  agro: {
    list: '/api/products/agro',
    inventory: '/api/products/agro/inventory',
    details: (id: string) => `/api/products/agro/${id}`,
  },
  // Real World Assets (RWA)
  rwa: {
    list: '/api/products/rwa',
    valuation: (id: string) => `/api/products/rwa/valuation/${id}`,
    tokenize: '/api/products/rwa/tokenize',
  },
  // 🆔 Sovereign Identity & Membership
  identity: {
    profile: (username: string) => `/api/platform/identity/profile/${username}`,
    card: '/api/platform/identity/me/card',
    list: '/api/platform/identity/list',
  },
} as const;
