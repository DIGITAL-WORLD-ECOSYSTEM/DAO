import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VerifyCitizenUseCase } from './VerifyCitizenUseCase';
import { Result } from '../../../shared/kernel/Result';
import { Citizen } from '../entities/Citizen';

describe('VerifyCitizenUseCase (BDD)', () => {
  let mockCitizenRepo: any;
  let mockFactory: any;
  let mockUow: any;
  let useCase: VerifyCitizenUseCase;

  beforeEach(() => {
    mockCitizenRepo = {
      findByUserId: vi.fn(),
      save: vi.fn(),
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

    useCase = new VerifyCitizenUseCase(mockUow);
  });

  describe('Cenário 1: Verifica cidadão Pendente', () => {
    it('Given Cidadão Pendente, When Verify, Then Transição Ocorre e Persiste', async () => {
      const citizen = Citizen.restore({ id: 1, userId: 1, username: 'john', status: 'PENDING' });
      mockCitizenRepo.findByUserId.mockResolvedValue(Result.ok(citizen));
      mockCitizenRepo.save.mockResolvedValue(Result.ok());

      const result = await useCase.execute({ accountId: 1 });

      expect(result.isSuccess).toBe(true);
      expect(mockCitizenRepo.save).toHaveBeenCalled();
      expect(citizen.status).toBe('VERIFIED');
    });
  });

  describe('Cenário 2: Idempotência', () => {
    it('Given Cidadão Verificado, When Verify, Then Result.ok(), Repository.save NÃO chamado', async () => {
      const citizen = Citizen.restore({ id: 1, userId: 1, username: 'john', status: 'VERIFIED' });
      mockCitizenRepo.findByUserId.mockResolvedValue(Result.ok(citizen));

      const result = await useCase.execute({ accountId: 1 });

      expect(result.isSuccess).toBe(true);
      expect(mockCitizenRepo.save).not.toHaveBeenCalled();
      expect(citizen.status).toBe('VERIFIED');
    });
  });

  describe('Cenário 3: Cidadão Suspenso (Transição Proibida)', () => {
    it('Given Cidadão Suspenso, When Verify, Then Erro de Transição (Proibido)', async () => {
      const citizen = Citizen.restore({ id: 1, userId: 1, username: 'john', status: 'SUSPENDED' });
      mockCitizenRepo.findByUserId.mockResolvedValue(Result.ok(citizen));

      const result = await useCase.execute({ accountId: 1 });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('TransitionForbidden');
      expect(mockCitizenRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('Cenário 4: Cidadão Revogado (Transição Proibida)', () => {
    it('Given Cidadão Revogado, When Verify, Then Erro de Transição (Proibido)', async () => {
      const citizen = Citizen.restore({ id: 1, userId: 1, username: 'john', status: 'REVOKED' });
      mockCitizenRepo.findByUserId.mockResolvedValue(Result.ok(citizen));

      const result = await useCase.execute({ accountId: 1 });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('TransitionForbidden');
      expect(mockCitizenRepo.save).not.toHaveBeenCalled();
    });
  });
});
