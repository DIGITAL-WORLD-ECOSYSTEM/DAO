import type { AuthUser } from '../types';

import axiosInstance, { endpoints } from 'src/lib/axios';

/**
 * IdentitySessionRepository
 * Responsável estritamente pelo ciclo de vida da sessão JWT.
 */
export class IdentitySessionRepository {
  /**
   * Resgata o usuário logado atualmente (me)
   */
  static async me(): Promise<AuthUser> {
    const res = await axiosInstance.get(endpoints.auth.me);
    return res.data.user || res.data;
  }

  /**
   * Autenticação via Email/Senha
   */
  static async login(data: Record<string, any>): Promise<{ accessToken: string; user: AuthUser }> {
    const res = await axiosInstance.post(endpoints.auth.signIn, data);
    return res.data;
  }

  /**
   * Autenticação via Web3 / Metamask
   */
  static async web3Nonce(publicAddress: string): Promise<{ nonce: string }> {
    const res = await axiosInstance.post(endpoints.auth.web3Nonce, { publicAddress });
    return res.data;
  }

  static async web3Verify(publicAddress: string, signature: string): Promise<{ accessToken: string; user: AuthUser }> {
    const res = await axiosInstance.post(endpoints.auth.web3Verify, { publicAddress, signature });
    return res.data;
  }

  /**
   * Invalida a sessão atual
   */
  static async logout(): Promise<void> {
    // Caso o backend possua endpoint de logout
    // await axiosInstance.post('/api/core/identity/logout');
  }

  /**
   * Renova o token de acesso (manual)
   */
  static async refresh(): Promise<{ accessToken: string }> {
    const res = await axiosInstance.post('/api/core/identity/refresh');
    return res.data;
  }
}
