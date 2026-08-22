import type { Context } from 'hono';
import { D1TreasuryRepository } from '../persistence/repositories/finance/D1TreasuryRepository';

export async function setupTreasuryDI(c: Context) {
  const db = c.env.DB;
  const repository = new D1TreasuryRepository(db);

  return {
    repository,
  };
}
