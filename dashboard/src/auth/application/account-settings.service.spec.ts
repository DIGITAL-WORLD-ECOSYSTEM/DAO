import { it, vi, expect, describe } from 'vitest';

import { AccountSettingsService } from './account-settings.service';
import { IdentityProfileRepository } from '../repository/identity-profile.repository';

// Mock do Repository para isolar o Application Service de requisições de rede
vi.mock('../repository/identity-profile.repository', () => ({
  IdentityProfileRepository: {
    updateMyProfile: vi.fn(),
    changePassword: vi.fn(),
  },
}));

describe('AccountSettingsService', () => {
  it('deve lançar erro se a nova senha não coincidir com a confirmação', async () => {
    await expect(AccountSettingsService.changePassword({
      newPassword: '123',
      confirmNewPassword: '456'
    })).rejects.toThrow('As senhas não coincidem.');
  });

  it('deve chamar o repositório se a senha coincidir', async () => {
    await AccountSettingsService.changePassword({
      newPassword: '123',
      confirmNewPassword: '123'
    });
    expect(IdentityProfileRepository.changePassword).toHaveBeenCalledWith({
      newPassword: '123',
      confirmNewPassword: '123'
    });
  });

  it('deve delegar a atualização de perfil para o repositório', async () => {
    const mockData = { firstName: 'Sandro' };
    vi.mocked(IdentityProfileRepository.updateMyProfile).mockResolvedValueOnce(mockData as any);
    
    const result = await AccountSettingsService.updateProfile(mockData);
    
    expect(IdentityProfileRepository.updateMyProfile).toHaveBeenCalledWith(mockData);
    expect(result).toEqual(mockData);
  });
});
