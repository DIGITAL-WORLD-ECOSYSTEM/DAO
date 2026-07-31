import { AccountSettingsService } from './account-settings.service';
import { IdentityUploadRepository } from '../repository/identity-upload.repository';

/**
 * AvatarService
 * Camada de aplicação que governa o ciclo de vida do Avatar (Upload e Atualização no Perfil).
 */
export class AvatarService {
  /**
   * Executa o fluxo completo:
   * 1. Faz upload do arquivo
   * 2. Atualiza a URL no perfil do usuário
   */
  static async changeAvatar(file: File): Promise<string> {
    try {
      // 1. Upload
      const publicUrl = await IdentityUploadRepository.uploadAvatar(file);
      
      // 2. Vincula ao perfil chamando outro service do mesmo módulo
      await AccountSettingsService.updateProfile({ photoURL: publicUrl });
      
      return publicUrl;
    } catch (error) {
      console.error('[AvatarService] Falha ao alterar o avatar', error);
      throw error;
    }
  }
}
