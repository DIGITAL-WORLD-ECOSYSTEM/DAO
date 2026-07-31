import axiosInstance from 'src/lib/axios';

/**
 * IdentityUploadRepository
 * Responsável por uploads de mídias (Avatares, Covers) do domínio de identidade.
 */
export class IdentityUploadRepository {
  /**
   * Envia a imagem do Avatar para o backend/storage e retorna a URL pública.
   */
  static async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'avatar');

    // Supondo um endpoint de upload de avatar (ajustar conforme infraestrutura real)
    const res = await axiosInstance.post('/api/core/identity/upload/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data.url;
  }
}
