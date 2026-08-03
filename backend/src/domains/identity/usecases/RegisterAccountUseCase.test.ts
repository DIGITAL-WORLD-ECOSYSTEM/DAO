import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterAccountUseCase } from './RegisterAccountUseCase';
import { Result } from '../../../shared/kernel/Result';
import { Account } from '../entities/Account';

describe('RegisterAccountUseCase (BDD)', () => {
  let mockAccountRepo: any;
  let mockCitizenRepo: any;
  let mockFactory: any;
  let mockUow: any;
  let mockHasher: any;
  let useCase: RegisterAccountUseCase;

  beforeEach(() => {
    mockAccountRepo = {
      findByEmail: vi.fn(),
      save: vi.fn(),
    };
    
    mockCitizenRepo = {
      save: vi.fn(),
    };

    mockFactory = {
      getAccountRepository: vi.fn(() => mockAccountRepo),
      getCitizenRepository: vi.fn(() => mockCitizenRepo),
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

    useCase = new RegisterAccountUseCase(mockUow, mockHasher);
  });

  describe('Cenário 1: Registro bem-sucedido', () => {
    it('Given Email inexistente, When Registrar conta, Then Account criada, Citizen criado, Commit executado', async () => {
      // Given
      mockAccountRepo.findByEmail.mockResolvedValue(Result.fail('AccountNotFound'));
      mockHasher.hash.mockResolvedValue('secure_hash');
      mockAccountRepo.save.mockResolvedValue(Result.ok(new Account({ email: 'new@dao.com' }, 1)));
      mockCitizenRepo.save.mockResolvedValue(Result.ok());

      // When
      const result = await useCase.execute({
        email: 'new@dao.com',
        password: 'secure_password',
        firstName: 'John',
        lastName: 'Doe'
      });

      // Then
      expect(result.isSuccess).toBe(true);
      expect(mockUow.execute).toHaveBeenCalled();
      expect(mockAccountRepo.save).toHaveBeenCalled();
      expect(mockCitizenRepo.save).toHaveBeenCalled();
    });
  });

  describe('Cenário 2: Email já existente', () => {
    it('Given Email já existente, When Registrar, Then Result.fail(EmailAlreadyExists), Nenhuma gravação', async () => {
      // Given
      const existingAccount = new Account({ email: 'new@dao.com' }, 1);
      mockAccountRepo.findByEmail.mockResolvedValue(Result.ok(existingAccount));

      // When
      const result = await useCase.execute({
        email: 'new@dao.com',
        password: 'secure_password',
        firstName: 'John',
        lastName: 'Doe'
      });

      // Then
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('EmailAlreadyExists');
      expect(mockAccountRepo.save).not.toHaveBeenCalled();
      expect(mockCitizenRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('Cenário 3: Falha ao criar Citizen (Rollback)', () => {
    it('Given Falha ao criar Citizen, When Registrar, Then Rollback completo, Account e Citizen não finalizados', async () => {
      // Given
      mockAccountRepo.findByEmail.mockResolvedValue(Result.fail('AccountNotFound'));
      mockHasher.hash.mockResolvedValue('secure_hash');
      
      mockAccountRepo.save.mockResolvedValue(Result.ok(new Account({ email: 'new@dao.com' }, 1)));
      
      // Simula falha ao salvar o cidadão
      mockCitizenRepo.save.mockResolvedValue(Result.fail('Error saving Citizen'));

      // When
      const result = await useCase.execute({
        email: 'new@dao.com',
        password: 'secure_password',
        firstName: 'John',
        lastName: 'Doe'
      });

      // Then
      expect(result.isFailure).toBe(true);
      // Se save do citizen falha, o UoW recebe o erro e o callback finaliza com falha,
      // engatilhando o rollback transacional na infraestrutura.
      expect(result.error).toContain('Error saving Citizen');
    });
  });

  describe('Cenário 4: Erro inesperado', () => {
    it('Given Erro inesperado, When Registrar, Then Rollback, Result.fail()', async () => {
      // Given
      mockAccountRepo.findByEmail.mockResolvedValue(Result.fail('AccountNotFound'));
      mockHasher.hash.mockResolvedValue('secure_hash');
      
      // Dispara erro throw inesperado
      mockAccountRepo.save.mockRejectedValue(new Error('Database exploded'));

      // When
      const result = await useCase.execute({
        email: 'new@dao.com',
        password: 'secure_password',
        firstName: 'John',
        lastName: 'Doe'
      });

      // Then
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Database exploded');
    });
  });

  describe('Cenário 5: Input Inválido', () => {
    it('Given Dados Inválidos, When Registrar, Then ValidationError', async () => {
      // When chamando com payload sem email
      const result = await useCase.execute({
        email: '',
        password: 'secure_password',
        firstName: 'John',
        lastName: 'Doe'
      });

      // Then
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('ValidationError');
    });
  });
});
