import { Result } from '../../shared/kernel/Result';
import { IAccountRepository } from './IAccountRepository';
import { ICitizenRepository } from './ICitizenRepository';
import { ITreasuryRepository } from './ITreasuryRepository';
import { IPasswordResetRepository } from './IPasswordResetRepository';

export interface IRepositoryFactory {
  getAccountRepository(): IAccountRepository;
  getCitizenRepository(): ICitizenRepository;
  getTreasuryRepository(): ITreasuryRepository;
  getPasswordResetRepository(): IPasswordResetRepository;
}

export interface IUnitOfWork {
  execute<T>(work: (factory: IRepositoryFactory) => Promise<Result<T>>): Promise<Result<T>>;
}
