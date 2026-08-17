import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ResetPasswordUseCase } from './ResetPasswordUseCase';
import { Result } from '../../../shared/kernel/Result';
import { Account } from '../entities/Account';

describe('ResetPasswordUseCase (BDD)', () => {
  let mockAccountRepo: any;
  let mockResetRepo: any;
  let mockSessionRepo: any;
  let mockFactory: any;
  let mockUow: any;
  let mockHasher: any;
  let useCase: ResetPasswordUseCase;

  beforeEach(() => {
    mockAccountRepo = {
      findById: vi.fn(),
      save: vi.fn(),
    };

    mockResetRepo = {
      findByToken: vi.fn(),
      invalidate: vi.fn(),
    };

    mockSessionRepo = {
      revokeAllUserSessions: vi.fn(),
    };

    mockFactory = {
      getAccountRepository: vi.fn(() => mockAccountRepo),
      getPasswordResetRepository: vi.fn(() => mockResetRepo),
      getSessionRepository: vi.fn(() => mockSessionRepo),
    };

    mockUow = {
      execute: vi.fn(async (callback) => {
        try {
          return await callback(mockFactory);
        } catch (e: any) {
          return Result.fail(e.message);
        }
      }),
    };

    mockHasher = {
      hash: vi.fn(),
    };

    useCase = new ResetPasswordUseCase(mockUow, mockHasher);
  });

  describe('Cenário 1: Token válido', () => {
    it('Given Token válido, When Resetar, Then Senha redefinida, Token invalidado', async () => {
      // Given
      const resetEntity = { id: 10, userId: 1, token: 'valid_token', expiresAt: new Date(Date.now() + 100000), usedAt: null };
      mockResetRepo.findByToken.mockResolvedValue(Result.ok(resetEntity));
      
      const account = Account.restore({ id: 1, email: 'user@dao.com', password: 'old_hash', role: 'CITIZEN', active: true });
      mockAccountRepo.findById.mockResolvedValue(Result.ok(account));
      mockHasher.hash.mockResolvedValue('new_hash');
      mockAccountRepo.save.mockResolvedValue(Result.ok());
      mockResetRepo.invalidate.mockResolvedValue(Result.ok());

      // When
      const result = await useCase.execute({ token: 'valid_token', newPassword: 'new_password' });

      // Then
      expect(result.isSuccess).toBe(true);
      expect(mockUow.execute).toHaveBeenCalled();
      expect(mockHasher.hash).toHaveBeenCalledWith('new_password');
      expect(mockAccountRepo.save).toHaveBeenCalled();
      expect(mockResetRepo.invalidate).toHaveBeenCalledWith(10);
    });
  });

  describe('Cenário 2: Token expirado', () => {
    it('Given Token expirado, When Resetar, Then Result.fail(TokenExpired)', async () => {
      // Given
      const resetEntity = { id: 10, userId: 1, token: 'expired_token', expiresAt: new Date(Date.now() - 100000), usedAt: null };
      mockResetRepo.findByToken.mockResolvedValue(Result.ok(resetEntity));

      // When
      const result = await useCase.execute({ token: 'expired_token', newPassword: 'new_password' });

      // Then
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('TokenExpired');
      expect(mockAccountRepo.save).not.toHaveBeenCalled();
      expect(mockResetRepo.invalidate).not.toHaveBeenCalled();
    });
  });

  describe('Cenário 3: Token inexistente ou inválido', () => {
    it('Given Token inexistente, When Resetar, Then Result.fail(TokenInvalid)', async () => {
      // Given
      mockResetRepo.findByToken.mockResolvedValue(Result.fail('Not found'));

      // When
      const result = await useCase.execute({ token: 'invalid_token', newPassword: 'new_password' });

      // Then
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('TokenInvalid');
    });
    
    it('Given Token já usado, When Resetar, Then Result.fail(TokenInvalid)', async () => {
      // Given
      const resetEntity = { id: 10, userId: 1, token: 'used_token', expiresAt: new Date(Date.now() + 100000), usedAt: new Date() };
      mockResetRepo.findByToken.mockResolvedValue(Result.ok(resetEntity));

      // When
      const result = await useCase.execute({ token: 'used_token', newPassword: 'new_password' });

      // Then
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('TokenInvalid');
    });
  });

  describe('Cenário 4: Erro durante invalidação (Rollback)', () => {
    it('Given Erro ao invalidar token, When Resetar, Then Rollback (fail)', async () => {
      // Given
      const resetEntity = { id: 10, userId: 1, token: 'valid_token', expiresAt: new Date(Date.now() + 100000), usedAt: null };
      mockResetRepo.findByToken.mockResolvedValue(Result.ok(resetEntity));
      
      const account = Account.restore({ id: 1, email: 'user@dao.com', password: 'old_hash', role: 'CITIZEN', active: true });
      mockAccountRepo.findById.mockResolvedValue(Result.ok(account));
      mockHasher.hash.mockResolvedValue('new_hash');
      mockAccountRepo.save.mockResolvedValue(Result.ok());
      
      // Simula falha catastrófica ao tentar invalidar
      mockResetRepo.invalidate.mockResolvedValue(Result.fail('Invalidação explodiu'));

      // When
      const result = await useCase.execute({ token: 'valid_token', newPassword: 'new_password' });

      // Then
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Invalidação explodiu');
    });
  });
});
