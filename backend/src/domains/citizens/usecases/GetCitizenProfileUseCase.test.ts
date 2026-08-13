import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetCitizenProfileUseCase } from './GetCitizenProfileUseCase';
import { Result } from '../../../shared/kernel/Result';
import { Citizen } from '../entities/Citizen';

describe('GetCitizenProfileUseCase (BDD)', () => {
  let mockCitizenRepo: any;
  let mockFactory: any;
  let mockUow: any;
  let useCase: GetCitizenProfileUseCase;

  beforeEach(() => {
    mockCitizenRepo = {
      findByUserId: vi.fn(),
    };

    mockFactory = {
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

    useCase = new GetCitizenProfileUseCase(mockUow);
  });

  describe('Cenário 1: Citizen encontrado', () => {
    it('Given accountId válido, When buscar perfil, Then Result.ok(CitizenProfile DTO)', async () => {
      // Given
      const citizenEntity = Citizen.restore({
        id: 0,
        userId: 1,
        username: 'john_doe',
        firstName: 'John',
        lastName: 'Doe',
        did: 'did:dao:asppibra:web2:1',
        status: 'PENDING',
        publicKey: ''
      });
      mockCitizenRepo.findByUserId.mockResolvedValue(Result.ok(citizenEntity));

      // When
      const result = await useCase.execute({ accountId: 1 });

      // Then
      expect(result.isSuccess).toBe(true);
      expect(mockUow.execute).toHaveBeenCalled();
      expect(mockCitizenRepo.findByUserId).toHaveBeenCalledWith(1);
      
      const dto = result.getValue();
      expect(dto).not.toBeInstanceOf(Citizen); // Não deve retornar a Entidade
      expect(dto.username).toBe('john_doe');
      expect(dto.firstName).toBe('John');
      expect(dto.status).toBe('PENDING');
    });
  });

  describe('Cenário 2: Citizen inexistente', () => {
    it('Given accountId inexistente, When buscar perfil, Then Result.fail(CitizenNotFound)', async () => {
      // Given
      mockCitizenRepo.findByUserId.mockResolvedValue(Result.fail('CitizenNotFound'));

      // When
      const result = await useCase.execute({ accountId: 99 });

      // Then
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('CitizenNotFound');
    });
  });

  describe('Cenário 3: accountId inválido', () => {
    it('Given accountId nulo, When buscar perfil, Then ValidationError', async () => {
      // When
      const result = await useCase.execute({ accountId: null as any });

      // Then
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('ValidationError');
      expect(mockUow.execute).not.toHaveBeenCalled();
    });
  });

  describe('Cenário 4: Erro inesperado', () => {
    it('Given Erro no banco de dados, When buscar perfil, Then Result.fail()', async () => {
      // Given
      mockCitizenRepo.findByUserId.mockRejectedValue(new Error('Banco caiu'));

      // When
      const result = await useCase.execute({ accountId: 1 });

      // Then
      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('Banco caiu');
    });
  });
});
