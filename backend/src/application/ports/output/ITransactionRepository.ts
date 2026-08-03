import { Result } from '../../../shared/kernel/result/Result';

export interface ITransactionRepository {
  createTransaction(transaction: any): Promise<Result<void>>;
  findById(transactionId: string): Promise<Result<any>>;
}
