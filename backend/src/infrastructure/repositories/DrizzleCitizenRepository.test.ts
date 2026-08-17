import { describe, it, expect, vi } from 'vitest';
import { DrizzleCitizenRepository } from './DrizzleCitizenRepository';
import { Citizen } from '../../domains/citizens/entities/Citizen';

describe('DrizzleCitizenRepository', () => {
  it('should return failure if citizen not found by userId', async () => {
    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]),
    };

    const repo = new DrizzleCitizenRepository(mockDb, {} as any);
    const result = await repo.findByUserId(999);

    expect(result.isFailure).toBe(true);
    expect(result.error).toBe('Citizen not found');
  });

  it('should map database record to Citizen domain entity', async () => {
    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([
        {
          userId: 1,
          legalFirstName: 'Felipe',
          legalLastName: 'Dev',
          civilStatus: 'verified',
          cpf: '12345678900',
        },
      ]),
    };

    const repo = new DrizzleCitizenRepository(mockDb, {} as any);
    const result = await repo.findByUserId(1);

    expect(result.isSuccess).toBe(true);
    const citizen = result.getValue();
    expect(citizen.firstName).toBe('Felipe');
    expect(citizen.lastName).toBe('Dev');
    expect(citizen.status).toBe('VERIFIED');
  });

  it('should save a new citizen record', async () => {
    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]),
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockResolvedValue(undefined),
    };

    const repo = new DrizzleCitizenRepository(mockDb, {} as any);
    const mockCitizen = Citizen.restore({
      id: 1,
      userId: 1,
      username: 'felipe',
      firstName: 'Felipe',
      lastName: 'Dev',
      status: 'PENDING',
      version: 1,
    });

    const result = await repo.save(mockCitizen);
    expect(result.isSuccess).toBe(true);
  });
});
