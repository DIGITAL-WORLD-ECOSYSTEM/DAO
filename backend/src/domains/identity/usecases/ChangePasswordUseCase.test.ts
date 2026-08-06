import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChangePasswordUseCase } from './ChangePasswordUseCase';
import { Result } from '../../../shared/kernel/Result';
import { Account } from '../entities/Account';

describe('ChangePasswordUseCase (BDD)', () => {
  let mockAccountRepo: any;
  let mockFactory: any;
  let mockUow: any;
  let mockHasher: any;
  let useCase: ChangePasswordUseCase;

  beforeEach(() => {
    mockAccountRepo = {
      findById: vi.fn(),
      save: vi.fn(),
    };

    mockFactory = {
      getAccountRepository: vi.fn(() => mockAccountRepo),
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
      verify: vi.fn(),
      hash: vi.fn(),
    };

    useCase = new ChangePasswordUseCase(mockUow, mockHasher);
  });

  describe('Cenário 1: Mudança com sucesso', () => {
    it('Given Conta existente e Senha atual correta, When Trocar senha, Then Nova senha armazenada, Hash atualizado, Commit realizado', async () => {
      // Given
      const existingAccount = Account.restore({ id: 1, email: 'user@dao.com', password: 'old_hash', role: 'CITIZEN', active: true });
      mockAccountRepo.findById.mockResolvedValue(Result.ok(existingAccount));
      mockHasher.verify.mockResolvedValue(true); // Senha atual bate
      mockHasher.hash.mockResolvedValue('new_hash'); // Nova senha hasheada
      mockAccountRepo.save.mockResolvedValue(Result.ok());

      // When
      const result = await useCase.execute({
        userId: 1,
        currentPassword: 'old_password',
        newPassword: 'new_password'
      });

      // Then
      expect(result.isSuccess).toBe(true);
      expect(mockUow.execute).toHaveBeenCalled();
      expect(mockHasher.verify).toHaveBeenCalledWith('old_password', 'old_hash');
      expect(mockHasher.hash).toHaveBeenCalledWith('new_password');
      expect(mockAccountRepo.save).toHaveBeenCalled();
      
      // O Account modificado deve ter a nova hash antes do save
      const savedAccountArgs = mockAccountRepo.save.mock.calls[0][0];
      expect(savedAccountArgs.password).toBe('new_hash');
    });
  });

  describe('Cenário 2: Senha atual incorreta', () => {
    it('Given Conta existente e Senha atual incorreta, When Trocar senha, Then Result.fail(InvalidPassword), Nenhuma alteração', async () => {
      // Given
      const existingAccount = Account.restore({ id: 1, email: 'user@dao.com', password: 'old_hash', role: 'CITIZEN', active: true });
      mockAccountRepo.findById.mockResolvedValue(Result.ok(existingAccount));
      mockHasher.verify.mockResolvedValue(false); // Senha atual NÃO bate

      // When
      const result = await useCase.execute({
        userId: 1,
        currentPassword: 'wrong_password',
        newPassword: 'new_password'
      });

      // Then
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('InvalidPassword');
      expect(mockAccountRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('Cenário 3: Conta inexistente', () => {
    it('Given Conta inexistente, When Trocar senha, Then AccountNotFound', async () => {
      // Given
      mockAccountRepo.findById.mockResolvedValue(Result.fail('Not found'));

      // When
      const result = await useCase.execute({
        userId: 99,
        currentPassword: 'old_password',
        newPassword: 'new_password'
      });

      // Then
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('AccountNotFound');
      expect(mockAccountRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('Cenário 4: Nova senha inválida', () => {
    it('Given Nova senha em branco, When Trocar senha, Then ValidationError', async () => {
      // When
      const result = await useCase.execute({
        userId: 1,
        currentPassword: 'old_password',
        newPassword: ''
      });

      // Then
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('ValidationError');
      expect(mockAccountRepo.findById).not.toHaveBeenCalled();
    });
  });

  describe('Cenário 5: Erro inesperado (Rollback)', () => {
    it('Given Erro inesperado no banco, When Trocar senha, Then Rollback e fail', async () => {
      // Given
      const existingAccount = Account.restore({ id: 1, email: 'user@dao.com', password: 'old_hash', role: 'CITIZEN', active: true });
      mockAccountRepo.findById.mockResolvedValue(Result.ok(existingAccount));
      mockHasher.verify.mockResolvedValue(true);
      mockHasher.hash.mockResolvedValue('new_hash');
      
      // Simula falha catastrófica ao tentar salvar no banco (engatilha rollback da transaction root)
      mockAccountRepo.save.mockRejectedValue(new Error('Database explosion'));

      // When
      const result = await useCase.execute({
        userId: 1,
        currentPassword: 'old_password',
        newPassword: 'new_password'
      });

      // Then
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Database explosion');
    });
  });
});
