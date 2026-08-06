import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthenticateAccountUseCase } from './AuthenticateAccountUseCase';
import { IUnitOfWork, IRepositoryFactory } from '../../../application/ports/output/IUnitOfWork';
import { IAccountRepository } from '../../../application/ports/output/IAccountRepository';
import { IPasswordHasher } from '../../../application/ports/security/IPasswordHasher';
import { Result } from '../../../shared/kernel/Result';
import { Account } from '../entities/Account';

describe('AuthenticateAccountUseCase (BDD)', () => {
  let mockAccountRepo: any;
  let mockFactory: any;
  let mockUow: any;
  let mockHasher: any;
  let useCase: AuthenticateAccountUseCase;

  beforeEach(() => {
    mockAccountRepo = {
      findByEmail: vi.fn(),
      save: vi.fn(),
      findById: vi.fn(),
    };

    mockFactory = {
      getAccountRepository: vi.fn(() => mockAccountRepo),
      getCitizenRepository: vi.fn(),
      getTreasuryRepository: vi.fn(),
    };

    mockUow = {
      execute: vi.fn(async (callback) => {
        return await callback(mockFactory);
      }),
    };

    mockHasher = {
      hash: vi.fn(),
      verify: vi.fn(),
    };

    useCase = new AuthenticateAccountUseCase(mockUow, mockHasher);
  });

  describe('Cenário 1: Autenticação com Sucesso', () => {
    it('Given Conta existente e Senha correta, When Autenticar, Then Result.ok()', async () => {
      // Given
      const validAccount = Account.restore({
        id: 1,
        email: 'test@dao.com',
        password: 'pbkdf2:hash:salt',
        role: 'citizen',
        active: true,
      });

      mockAccountRepo.findByEmail.mockResolvedValue(Result.ok(validAccount));
      mockHasher.verify.mockResolvedValue(true);

      // When
      const result = await useCase.execute({ email: 'test@dao.com', password: 'correct_password' });

      // Then
      expect(result.isSuccess).toBe(true);
      expect(result.getValue().email).toBe('test@dao.com');
      expect(mockUow.execute).toHaveBeenCalledTimes(1);
    });
  });

  describe('Cenário 2: Credenciais Inválidas', () => {
    it('Given Conta existente e Senha incorreta, When Autenticar, Then InvalidCredentials', async () => {
      // Given
      const validAccount = Account.restore({
        id: 1,
        email: 'test@dao.com',
        password: 'pbkdf2:hash:salt',
        role: 'citizen',
        active: true,
      });

      mockAccountRepo.findByEmail.mockResolvedValue(Result.ok(validAccount));
      mockHasher.verify.mockResolvedValue(false); // Senha incorreta

      // When
      const result = await useCase.execute({ email: 'test@dao.com', password: 'wrong_password' });

      // Then
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('InvalidCredentials');
    });
  });

  describe('Cenário 3: Conta Inexistente', () => {
    it('Given Conta inexistente, When Autenticar, Then AccountNotFound', async () => {
      // Given
      mockAccountRepo.findByEmail.mockResolvedValue(Result.fail('AccountNotFound'));

      // When
      const result = await useCase.execute({ email: 'ghost@dao.com', password: 'password' });

      // Then
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('AccountNotFound');
    });
  });

  describe('Cenário 4: Conta Bloqueada', () => {
    it('Given Conta bloqueada, When Autenticar, Then AccountLocked', async () => {
      // Given
      const lockedAccount = Account.restore({
        id: 1,
        email: 'test@dao.com',
        password: 'pbkdf2:hash:salt',
        role: 'citizen',
        active: false, // Bloqueada
      });

      mockAccountRepo.findByEmail.mockResolvedValue(Result.ok(lockedAccount));

      // When
      const result = await useCase.execute({ email: 'test@dao.com', password: 'password' });

      // Then
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('AccountLocked');
    });
  });
});
