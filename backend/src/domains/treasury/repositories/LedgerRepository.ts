import { sql } from 'drizzle-orm';
import { treasuryLedger } from '../../../db/schema';

export interface ILedgerRepository {
  getSummaryStats(year?: string): Promise<any>;
  getMonthlyTrend(year?: string): Promise<any>;
  getLatestTransactions(year?: string): Promise<any[]>;
  getAvailableYears(): Promise<any[]>;
}

export class LedgerRepository implements ILedgerRepository {
  constructor(private db: any) {}

  private getDateFilter(year?: string) {
    return year && year !== 'Todos'
      ? sql`strftime('%Y', datetime(${treasuryLedger.createdAt}, 'unixepoch')) = ${year}`
      : sql`1=1`;
  }

  async getSummaryStats(year?: string) {
    const statsResult = await this.db
      .select({
        totalInflow: sql<number>`SUM(${treasuryLedger.amountCents})`,
        avgTicket: sql<number>`AVG(${treasuryLedger.amountCents})`,
        count: sql<number>`COUNT(*)`,
      })
      .from(treasuryLedger)
      .where(sql`${treasuryLedger.type} = 'inbound' AND ${this.getDateFilter(year)}`);
    return statsResult[0];
  }

  async getMonthlyTrend(year?: string) {
    const monthExpr = sql`strftime('%m', datetime(${treasuryLedger.createdAt}, 'unixepoch'))`;
    return await this.db
      .select({ month: monthExpr, total: sql<number>`SUM(${treasuryLedger.amountCents})` })
      .from(treasuryLedger)
      .where(sql`${treasuryLedger.type} = 'inbound' AND ${this.getDateFilter(year)}`)
      .groupBy(monthExpr)
      .orderBy(monthExpr);
  }

  async getLatestTransactions(year?: string) {
    return await this.db
      .select()
      .from(treasuryLedger)
      .where(this.getDateFilter(year))
      .orderBy(sql`${treasuryLedger.createdAt} ASC`);
  }

  async getAvailableYears() {
    return await this.db
      .select({ year: sql`strftime('%Y', datetime(${treasuryLedger.createdAt}, 'unixepoch'))` })
      .from(treasuryLedger)
      .groupBy(sql`strftime('%Y', datetime(${treasuryLedger.createdAt}, 'unixepoch'))`)
      .orderBy(sql`strftime('%Y', datetime(${treasuryLedger.createdAt}, 'unixepoch')) DESC`);
  }
}
