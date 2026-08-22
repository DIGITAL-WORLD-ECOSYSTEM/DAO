export interface TreasuryTransactionDTO {
  id: string;
  created_at: string;
  counterparty_name: string;
  origin_institution: string;
  destination_institution: string;
  payment_method: string;
  source_proof: string;
  amount: number;
  base_amount: number;
  currency: string;
  base_currency: string;
  type: string;
  direction: string;
  category: string;
  status: string;
  reconciliation_status: string;
}

export interface ITreasuryRepository {
  findTransactionsByUserId(userId: number): Promise<TreasuryTransactionDTO[]>;
  getSummaryStats?(year?: string): Promise<any>;
  getMonthlyTrend?(year?: string): Promise<any>;
  getLatestTransactions?(year?: string): Promise<any[]>;
  getAvailableYears?(): Promise<any[]>;
}
