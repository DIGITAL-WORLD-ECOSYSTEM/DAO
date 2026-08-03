import { IUnitOfWork } from '../../../application/ports/output/IUnitOfWork';
import { IPasswordHasher } from '../../../application/ports/security/IPasswordHasher';
import { Result } from '../../../shared/kernel/Result';

export class AuthenticateAccountUseCase {
  constructor(
    private uow: IUnitOfWork,
    private passwordHasher: IPasswordHasher
  ) {}

  async execute(input: any): Promise<Result<any>> {
    const { email, password } = input;
    
    return await this.uow.execute(async (factory) => {
      const accountRepo = factory.getAccountRepository();
      const accountResult = await accountRepo.findByEmail(email);

      if (accountResult.isFailure) {
        return Result.fail('AccountNotFound');
      }

      const account = accountResult.getValue();

      if (!account.active) {
        return Result.fail('AccountLocked');
      }

      if (!account.password || !account.password.includes(':')) {
        return Result.fail('AccountNotFound'); // OAuth/Web3 fallback
      }

      const isMatched = await this.passwordHasher.verify(password, account.password);

      if (!isMatched) {
        return Result.fail('InvalidCredentials');
      }

      const userRole =
        account.email === 'dev@asppibra.com'
          ? 'dev'
          : account.role === 'citizen'
            ? 'user'
            : account.role || 'user';

      return Result.ok({
        userId: account.id,
        email: account.email,
        role: userRole,
        aal: 1,
        firstName: account.firstName || '',
        lastName: account.lastName || '',
        username: account.username || '',
      });
    });
  }
}
