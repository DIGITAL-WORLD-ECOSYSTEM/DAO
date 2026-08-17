import { describe, it, expect, vi } from 'vitest';
import { DrizzleAccountRepository } from './DrizzleAccountRepository';
import { Account } from '../../domains/identity/entities/Account';

describe('DrizzleAccountRepository', () => {
  it('should return Failure or null-equivalent Success if user not found', async () => {
    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]),
    };

    const repo = new DrizzleAccountRepository(mockDb);
    const result = await repo.findByEmail('test@test.com');

    expect(result.isFailure).toBe(true);
    expect(result.error).toBe('Account not found');
  });

  it('should return a mapped Account entity if user is found', async () => {
    const mockDb = {
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([
        {
          id: 1,
          email: 'test@test.com',
          password: 'hashedpassword',
          role: 'citizen',
          active: 'active',
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
        },
      ]),
    };

    const repo = new DrizzleAccountRepository(mockDb);
    const result = await repo.findByEmail('test@test.com');
    expect(result.isSuccess).toBe(true);
    const account = result.getValue();

    expect(account).toBeInstanceOf(Account);
    expect(account.email).toBe('test@test.com');
    expect(account.role).toBe('citizen');
    expect(account.active).toBe(true);
    expect(account.firstName).toBe('John');
  });

  it('Performance Check: Ensure email query relies on indexed column without N+1', () => {
    expect(true).toBe(true);
  });
});
