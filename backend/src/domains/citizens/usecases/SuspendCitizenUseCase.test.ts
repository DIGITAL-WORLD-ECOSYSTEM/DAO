import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SuspendCitizenUseCase } from './SuspendCitizenUseCase';
import { Result } from '../../../shared/kernel/Result';
import { Citizen, SuspensionReason } from '../entities/Citizen';

describe('SuspendCitizenUseCase (BDD)', () => {
  let mockCitizenRepo: any;
  let mockFactory: any;
  let mockUow: any;
  let useCase: SuspendCitizenUseCase;

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

    useCase = new SuspendCitizenUseCase(mockUow);
  });

  describe('Cenário 1: Suspender Cidadão Verificado', () => {
    it('Given Cidadão Verificado, When Suspend, Then Transição Ocorre e Persiste', async () => {
      const citizen = new Citizen({ id: 1, userId: 1, username: 'john', status: 'VERIFIED' });
      mockCitizenRepo.findByUserId.mockResolvedValue(Result.ok(citizen));
      mockCitizenRepo.save.mockResolvedValue(Result.ok());

      const result = await useCase.execute({ accountId: 1, reason: SuspensionReason.FRAUD, description: 'Test fraud' });

      expect(result.isSuccess).toBe(true);
      expect(mockCitizenRepo.save).toHaveBeenCalled();
      expect(citizen.status).toBe('SUSPENDED');
    });
  });

  describe('Cenário 2: Idempotência', () => {
    it('Given Cidadão Suspenso, When Suspend, Then Result.ok(), Repository.save NÃO chamado', async () => {
      const citizen = new Citizen({ id: 1, userId: 1, username: 'john', status: 'SUSPENDED' });
      mockCitizenRepo.findByUserId.mockResolvedValue(Result.ok(citizen));

      const result = await useCase.execute({ accountId: 1, reason: SuspensionReason.FRAUD });

      expect(result.isSuccess).toBe(true);
      expect(mockCitizenRepo.save).not.toHaveBeenCalled();
      expect(citizen.status).toBe('SUSPENDED');
    });
  });

  describe('Cenário 3: Cidadão Pendente (Transição Proibida)', () => {
    it('Given Cidadão Pendente, When Suspend, Then Erro de Transição (Proibido)', async () => {
      const citizen = new Citizen({ id: 1, userId: 1, username: 'john', status: 'PENDING' });
      mockCitizenRepo.findByUserId.mockResolvedValue(Result.ok(citizen));

      const result = await useCase.execute({ accountId: 1, reason: SuspensionReason.FRAUD });

      expect(result.isFailure).toBe(true);
      expect(result.error).toContain('TransitionForbidden');
      expect(mockCitizenRepo.save).not.toHaveBeenCalled();
    });
  });
});
