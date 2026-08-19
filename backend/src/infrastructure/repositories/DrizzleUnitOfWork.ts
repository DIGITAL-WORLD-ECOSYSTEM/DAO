import { IUnitOfWork, IRepositoryFactory } from '../../application/ports/output/IUnitOfWork';
import { IAccountRepository } from '../../application/ports/output/IAccountRepository';
import { ICitizenRepository } from '../../application/ports/output/ICitizenRepository';
import { ITreasuryRepository } from '../../application/ports/output/ITreasuryRepository';
import { Result } from '../../shared/kernel/Result';
import { DrizzleAccountRepository } from './DrizzleAccountRepository';
import { DrizzleCitizenRepository } from './DrizzleCitizenRepository';
import { DrizzleTreasuryRepository } from './DrizzleTreasuryRepository';
import { IPasswordResetRepository } from '../../application/ports/output/IPasswordResetRepository';
import { DrizzlePasswordResetRepository } from './DrizzlePasswordResetRepository';
import { IOutboxRepository } from '../../application/ports/output/IOutboxRepository';
import { DrizzleOutboxRepository } from './DrizzleOutboxRepository';
import { IWalletRepository } from '../../application/ports/output/IWalletRepository';
import { DrizzleWalletRepository } from './DrizzleWalletRepository';
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
    if (typeof this.db?.transaction === 'function') {
      let result: Result<T> | null = null;
      let workStarted = false;
      try {
        await this.db.transaction(async (tx: any) => {
          workStarted = true;
          const factory = new DrizzleRepositoryFactory(tx);
          result = await work(factory);

          if (result && result.isFailure && typeof tx.rollback === 'function') {
            tx.rollback();
          }
        });
        if (result) return result;
      } catch (err: any) {
        const errorMsg = err?.message || err?.toString() || '';
        if (!workStarted || errorMsg.toLowerCase().includes('begin') || errorMsg.includes('not supported by D1 driver')) {
          const factory = new DrizzleRepositoryFactory(this.db);
          return await work(factory);
        }
        const failureResult = result as Result<T> | null;
        if (failureResult && failureResult.isFailure) {
          return failureResult;
        }
        return Result.fail(errorMsg || 'Transaction aborted');
      }
    }

    const factory = new DrizzleRepositoryFactory(this.db);
    return await work(factory);
  }
}
