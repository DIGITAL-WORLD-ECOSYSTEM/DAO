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
}

export class DrizzleUnitOfWork implements IUnitOfWork {
  constructor(private db: any) {}

  async execute<T>(work: (factory: IRepositoryFactory) => Promise<Result<T>>): Promise<Result<T>> {
    try {
      let result: Result<T>;

      const factory = new DrizzleRepositoryFactory(this.db);
      result = await work(factory);

      // COMMIT EFETUADO NO BANCO!
      // OutboxEvents já foram gravados na transação!
      
      return result!;
    } catch (error: any) {
      // Se o erro foi o nosso próprio disparo de ROLLBACK para a falha lógica:
      if (error.message && error.message.includes('TRANSACTION_ROLLED_BACK')) {
        const errorMsg = error.message.replace('TRANSACTION_ROLLED_BACK: ', '');
        return Result.fail(errorMsg);
      }
      
      // Se o erro foi um timeout do Cloudflare, DB indisponível, etc.
      return Result.fail(error.message || 'Unknown infrastructure error during transaction');
    }
  }
}
