import type { AuthUser } from '../types';

import { IdentityProfileRepository } from '../repository/identity-profile.repository';

/**
 * AccountSettingsService
 * Camada de aplicação que governa as regras de negócio de alteração de perfil e segurança.
 */
export class AccountSettingsService {
  /**
   * Atualiza as informações do perfil do usuário atual
   */
  static async updateProfile(data: Partial<AuthUser>): Promise<AuthUser> {
    // Aqui no Application Service seria o local ideal para:
    // 1. Validação de regras de negócio complexas
    // 2. Disparo de eventos de domínio (e.g., DomainEvents.dispatch('ProfileUpdated'))
    // 3. Transformações de input/output

    try {
      const updatedUser = await IdentityProfileRepository.updateMyProfile(data);
      return updatedUser;
    } catch (error) {
      console.error('[AccountSettingsService] Falha ao atualizar perfil', error);
      throw error;
    }
  }

  /**
   * Altera a senha do usuário
   */
  static async changePassword(data: Record<string, string>): Promise<void> {
    try {
      if (data.newPassword !== data.confirmNewPassword) {
        throw new Error('As senhas não coincidem.');
      }
      await IdentityProfileRepository.changePassword(data);
    } catch (error) {
      console.error('[AccountSettingsService] Falha ao alterar senha', error);
      throw error;
    }
  }
}
