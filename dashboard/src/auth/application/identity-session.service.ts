import type { AuthUser } from '../types';

import { IdentitySessionRepository } from '../repository/identity-session.repository';

/**
 * IdentitySessionService
 * Camada de aplicação responsável pela orquestração do ciclo de vida da sessão.
 */
export class IdentitySessionService {
  /**
   * Resgata o usuário atual a partir do repositório
   */
  static async getCurrentUser(): Promise<AuthUser> {
    try {
      return await IdentitySessionRepository.me();
    } catch (error) {
      console.error('[IdentitySessionService] Erro ao recuperar sessão atual', error);
      throw error;
    }
  }

  /**
   * Processa o Login via credenciais
   */
  static async login(data: Record<string, any>): Promise<{ accessToken: string; user: AuthUser }> {
    try {
      return await IdentitySessionRepository.login(data);
    } catch (error) {
      console.error('[IdentitySessionService] Erro ao processar login', error);
      throw error;
    }
  }

  /**
   * Realiza Logout e limpeza de estado
   */
  static async logout(): Promise<void> {
    try {
      await IdentitySessionRepository.logout();
    } catch (error) {
      console.error('[IdentitySessionService] Erro ao processar logout', error);
      throw error;
    }
  }
}
