import { Result } from '../../../shared/kernel/Result';

export interface ITransactionRepository {
  createTransaction(transaction: any): Promise<Result<void>>;
  findById(transactionId: string): Promise<Result<any>>;
}
