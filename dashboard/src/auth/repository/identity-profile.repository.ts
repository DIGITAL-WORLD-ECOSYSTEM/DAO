import type { AuthUser } from '../types';

import axiosInstance, { endpoints } from 'src/lib/axios';

/**
 * IdentityProfileRepository
 * Responsável pelas mutações do perfil do usuário e configurações de conta.
 */
export class IdentityProfileRepository {
  /**
   * Atualiza os dados cadastrais do próprio usuário (Self-Service)
   */
  static async updateMyProfile(data: Partial<AuthUser>): Promise<AuthUser> {
    const res = await axiosInstance.patch(endpoints.auth.me, data);
    return res.data.user || res.data;
  }

  /**
   * Altera a senha do usuário
   */
  static async changePassword(data: Record<string, string>): Promise<void> {
    const res = await axiosInstance.post(endpoints.auth.changePassword, data);
    return res.data;
  }

  /**
   * Remove a conta
   */
  static async deleteAccount(): Promise<void> {
    await axiosInstance.delete(endpoints.auth.me);
  }
}
