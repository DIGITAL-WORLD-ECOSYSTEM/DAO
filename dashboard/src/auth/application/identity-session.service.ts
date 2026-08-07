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

  static async forgotPassword(email: string): Promise<void> {
    try {
      await IdentitySessionRepository.forgotPassword(email);
    } catch (error) {
      console.error('[IdentitySessionService] Erro em forgotPassword', error);
      throw error;
    }
  }

  static async resetPassword(token: string, email: string, password: string): Promise<void> {
    try {
      await IdentitySessionRepository.resetPassword(token, email, password);
    } catch (error) {
      console.error('[IdentitySessionService] Erro em resetPassword', error);
      throw error;
    }
  }

  static async resendVerification(email: string): Promise<void> {
    try {
      await IdentitySessionRepository.resendVerification(email);
    } catch (error) {
      console.error('[IdentitySessionService] Erro em resendVerification', error);
      throw error;
    }
  }
}
