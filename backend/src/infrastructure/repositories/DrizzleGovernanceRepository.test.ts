import { describe, it, expect, vi } from 'vitest';
import { DrizzleGovernanceRepository } from './DrizzleGovernanceRepository';

describe('DrizzleGovernanceRepository', () => {
  it('should create proposal successfully', async () => {
    const mockDb = {
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([{ id: 1 }]),
    };

    const repo = new DrizzleGovernanceRepository(mockDb);
    const result = await repo.createProposal({
      creatorId: 1,
      title: 'Proposta 001',
      description: 'Aporte de tesouraria para expansão',
    });

    expect(result.isSuccess).toBe(true);
    expect(result.getValue().id).toBe(1);
  });

  it('should cast vote on proposal successfully', async () => {
    const mockDb = {
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn().mockResolvedValue([{ id: 10 }]),
    };

    const repo = new DrizzleGovernanceRepository(mockDb);
    const result = await repo.castVote({
      proposalId: 1,
      voterId: 2,
      support: true,
      votingPower: 1,
    });

    expect(result.isSuccess).toBe(true);
    expect(result.getValue().id).toBe(10);
  });
});
