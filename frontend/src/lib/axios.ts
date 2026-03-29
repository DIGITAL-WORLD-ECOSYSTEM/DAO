/**
 * Copyright 2026 ASPPIBRA – Associação dos Proprietários e Possuidores de Imóveis no Brasil.
 * Project: Governance System (ASPPIBRA DAO)
 * Role: API Client Configuration (Axios Instance)
 * Version: 1.2.1 - Fix: SocialFi Endpoints Integration
 */

import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { setSession } from 'src/identity/context/utils';
import { JWT_STORAGE_KEY } from 'src/identity/context/constant';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

/**
 * 🛠️ CONFIGURAÇÃO DA INSTÂNCIA
 * Sincronizado com CONFIG.serverUrl para suportar múltiplos ambientes (Dev/Prod).
 */
const axiosInstance = axios.create({
  baseURL: CONFIG.serverUrl, 
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
    const message = error?.response?.data?.message || error?.message || 'Erro inesperado no sistema!';
    
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

// ----------------------------------------------------------------------

import { CryptoCore } from '@dao/shared';

// 🛡️ ZERO-TRUST SIGNATURE INTERCEPTOR
axiosInstance.interceptors.request.use(async (config) => {
  // Solo aplicar a rotas sensíveis ou se solicitado
  if (config.url?.includes('/api/core/identity/revoke') || config.headers?.['X-Auth-Signed']) {
    const vaultData = typeof window !== 'undefined' ? localStorage.getItem('dao_vault') : null;
    if (vaultData) {
      const { priv, did } = JSON.parse(vaultData); 
      const timestamp = Date.now().toString();
      const body = config.data ? JSON.stringify(config.data) : '';
      const msg = new TextEncoder().encode(timestamp + body);
      const signature = CryptoCore.sign(msg, Uint8Array.from(priv));
      
      const sigBase64 = btoa(String.fromCharCode(...signature));
      
      config.headers['X-Identity-Signature'] = sigBase64;
      config.headers['X-Identity-DID'] = did || `did:dao:asppibra:${config.headers['X-Username']}`;
      config.headers['X-Identity-Timestamp'] = timestamp;
    }
  }
  return config;
});

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
    signIn: '/api/core/identity/login',
    signUp: '/api/core/identity/register',
    resetPassword: '/api/core/identity/reset-password',
    updatePassword: '/api/core/identity/update-password',
    verify: '/api/core/identity/verify',
  },
  // 🚀 SocialFi & Blog Integration
  post: {
    list: '/api/sofi',
    details: (title: string) => `/api/sofi/${title}`,
    latest: '/api/sofi/latest',
    search: '/api/sofi/search',
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
  }
} as const;