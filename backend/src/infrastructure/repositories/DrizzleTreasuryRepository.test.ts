import { describe, it, expect, vi } from 'vitest';
import { DrizzleTreasuryRepository } from './DrizzleTreasuryRepository';

describe('DrizzleTreasuryRepository', () => {
  it('should return summary stats for treasury', async () => {
    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockResolvedValue([{ totalInflow: 5000, avgTicket: 1000, count: 5 }]),
    };

    const repo = new DrizzleTreasuryRepository(mockDb);
    const result = await repo.getSummaryStats('2026');

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toEqual({ totalInflow: 5000, avgTicket: 1000, count: 5 });
  });

  it('should return monthly trend data', async () => {
    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      groupBy: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockResolvedValue([{ month: '01', total: 5000 }]),
    };

    const repo = new DrizzleTreasuryRepository(mockDb);
    const result = await repo.getMonthlyTrend('2026');

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toEqual([{ month: '01', total: 5000 }]);
  });

  it('should return latest transactions mapped to domain entities', async () => {
    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockResolvedValue([]),
    };

    const repo = new DrizzleTreasuryRepository(mockDb);
    const result = await repo.getLatestTransactions('2026');

    expect(result.isSuccess).toBe(true);
    expect(result.getValue()).toEqual([]);
  });
});
