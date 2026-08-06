import { Result } from '../../../shared/kernel/Result';
import { IAccountRepository } from './IAccountRepository';
import { ICitizenRepository } from './ICitizenRepository';
import { ITreasuryRepository } from './ITreasuryRepository';
import { IPasswordResetRepository } from './IPasswordResetRepository';
import { IOutboxRepository } from './IOutboxRepository';
import { IWalletRepository } from './IWalletRepository';

export interface IRepositoryFactory {
  getAccountRepository(): IAccountRepository;
  getCitizenRepository(): ICitizenRepository;
  getTreasuryRepository(): ITreasuryRepository;
  getPasswordResetRepository(): IPasswordResetRepository;
  getOutboxRepository(): IOutboxRepository;
  getWalletRepository(): IWalletRepository;
}

export interface IUnitOfWork {
  execute<T>(work: (factory: IRepositoryFactory) => Promise<Result<T>>): Promise<Result<T>>;
}
