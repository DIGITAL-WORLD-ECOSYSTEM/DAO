import { IUnitOfWork, IRepositoryFactory } from '../../application/ports/output/IUnitOfWork';
import { IAccountRepository } from '../../application/ports/output/IAccountRepository';
import { ICitizenRepository } from '../../application/ports/output/ICitizenRepository';
import { ITreasuryRepository } from '../../application/ports/output/ITreasuryRepository';
import { Result } from '../../shared/kernel/Result';
import { DrizzleAccountRepository } from './AccountRepository';
import { DrizzleCitizenRepository } from './CitizenRepository';
import { DrizzleTreasuryRepository } from './TreasuryRepository';
import { IPasswordResetRepository } from '../../application/ports/output/IPasswordResetRepository';
import { DrizzlePasswordResetRepository } from './DrizzlePasswordResetRepository';
import { IOutboxRepository } from '../../application/ports/output/IOutboxRepository';
import { DrizzleOutboxRepository } from './DrizzleOutboxRepository';
import { IWalletRepository } from '../../application/ports/output/IWalletRepository';
import { DrizzleWalletRepository } from './WalletRepository';

import { ISessionRepository } from '../../application/ports/output/ISessionRepository';
import { DrizzleSessionRepository } from './DrizzleSessionRepository';

class DrizzleRepositoryFactory implements IRepositoryFactory {
  constructor(private tx: any) {}

  getAccountRepository(): IAccountRepository {
    return new DrizzleAccountRepository(this.tx);
  }

  getCitizenRepository(): ICitizenRepository {
    return new DrizzleCitizenRepository(this.tx, this.getOutboxRepository());
  }

  getTreasuryRepository(): ITreasuryRepository {
    return new DrizzleTreasuryRepository(this.tx);
  }

  getPasswordResetRepository(): IPasswordResetRepository {
    return new DrizzlePasswordResetRepository(this.tx);
  }

  getOutboxRepository(): IOutboxRepository {
    return new DrizzleOutboxRepository(this.tx);
  }

  getWalletRepository(): IWalletRepository {
    return new DrizzleWalletRepository(this.tx);
  }

  getSessionRepository(): ISessionRepository {
    return new DrizzleSessionRepository(this.tx);
  }
}

export class DrizzleUnitOfWork implements IUnitOfWork {
  constructor(private db: any) {}

  async execute<T>(work: (factory: IRepositoryFactory) => Promise<Result<T>>): Promise<Result<T>> {
    // Cloudflare D1 does not natively support interactive transactions with callbacks (BEGIN/COMMIT).
    // The previous attempt to use db.transaction() failed because D1 throws "Failed query: begin".
    // To achieve true atomic writes, we must use db.batch(), which requires a different Repository interface.
    // For now, we simulate the UoW by passing the main db instance.
    const factory = new DrizzleRepositoryFactory(this.db);
    return await work(factory);
  }
}
