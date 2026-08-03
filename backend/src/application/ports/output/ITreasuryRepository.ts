import { Result } from '../../../shared/kernel/Result';
import { TreasuryTransaction } from '../../../domains/treasury/entities/TreasuryTransaction';

export interface ITreasuryRepository {
  getSummaryStats(year?: string): Promise<Result<any>>;
  getMonthlyTrend(year?: string): Promise<Result<any>>;
  getLatestTransactions(year?: string): Promise<Result<any[]>>;
  getAvailableYears(): Promise<Result<any[]>>;
}
