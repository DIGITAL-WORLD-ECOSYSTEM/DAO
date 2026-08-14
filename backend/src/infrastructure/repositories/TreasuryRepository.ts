import { sql } from 'drizzle-orm';
import { treasuryLedger } from '../../db/finance/tables';
import { ITreasuryRepository } from '../../application/ports/output/ITreasuryRepository';
import { TreasuryMapper } from '../mappers/TreasuryMapper';
import { Result } from '../../shared/kernel/Result';
import { TreasuryTransaction } from '../../domains/treasury/entities/TreasuryTransaction';

export class DrizzleTreasuryRepository implements ITreasuryRepository {
  constructor(private db: any) {}

  private getDateFilter(year?: string) {
    return year && year !== 'Todos'
      ? sql`strftime('%Y', datetime(${treasuryLedger.createdAt}, 'unixepoch')) = ${year}`
      : sql`1=1`;
  }

  async getSummaryStats(year?: string): Promise<Result<any>> {
    try {
      const statsResult = await this.db
        .select({
          totalInflow: sql<number>`SUM(${treasuryLedger.amountCents})`,
          avgTicket: sql<number>`AVG(${treasuryLedger.amountCents})`,
          count: sql<number>`COUNT(*)`,
        })
        .from(treasuryLedger)
        .where(sql`${treasuryLedger.type} = 'inbound' AND ${this.getDateFilter(year)}`);
      
      return Result.ok(statsResult[0] || { totalInflow: 0, avgTicket: 0, count: 0 });
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }

  async getMonthlyTrend(year?: string): Promise<Result<any>> {
    try {
      const monthExpr = sql`strftime('%m', datetime(${treasuryLedger.createdAt}, 'unixepoch'))`;
      const result = await this.db
        .select({ month: monthExpr, total: sql<number>`SUM(${treasuryLedger.amountCents})` })
        .from(treasuryLedger)
        .where(sql`${treasuryLedger.type} = 'inbound' AND ${this.getDateFilter(year)}`)
        .groupBy(monthExpr)
        .orderBy(monthExpr);
      return Result.ok(result);
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }

  async getLatestTransactions(year?: string): Promise<Result<TreasuryTransaction[]>> {
    try {
      const result = await this.db
        .select()
        .from(treasuryLedger)
        .where(this.getDateFilter(year))
        .orderBy(sql`${treasuryLedger.createdAt} ASC`);
      
      const mapped = result.map((row: any) => TreasuryMapper.toDomain(row));
      return Result.ok(mapped);
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }

  async getAvailableYears(): Promise<Result<any[]>> {
    try {
      const result = await this.db
        .select({ year: sql`strftime('%Y', datetime(${treasuryLedger.createdAt}, 'unixepoch'))` })
        .from(treasuryLedger)
        .groupBy(sql`strftime('%Y', datetime(${treasuryLedger.createdAt}, 'unixepoch'))`)
        .orderBy(sql`strftime('%Y', datetime(${treasuryLedger.createdAt}, 'unixepoch')) DESC`);
      return Result.ok(result);
    } catch (error: any) {
      return Result.fail(error.message);
    }
  }
}
