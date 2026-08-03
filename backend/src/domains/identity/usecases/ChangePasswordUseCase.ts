import { IUnitOfWork } from '../../../application/ports/output/IUnitOfWork';
import { IPasswordHasher } from '../../../application/ports/security/IPasswordHasher';
import { Result } from '../../../shared/kernel/Result';

export class ChangePasswordUseCase {
  constructor(
    private uow: IUnitOfWork,
    private passwordHasher: IPasswordHasher
  ) {}

  async execute(input: any): Promise<Result<any>> {
    const { userId, currentPassword, newPassword } = input;

    if (!currentPassword || !newPassword || newPassword.trim() === '') {
      return Result.fail('ValidationError: Nova senha não pode ser vazia');
    }

    return await this.uow.execute(async (factory) => {
      const accountRepo = factory.getAccountRepository();

      const accountResult = await accountRepo.findById(userId);
      if (accountResult.isFailure) {
        return Result.fail('AccountNotFound');
      }

      const account = accountResult.getValue();

      if (!account.password) {
        return Result.fail('AccountNotFound');
      }

      const isCurrentPasswordValid = await this.passwordHasher.verify(currentPassword, account.password);
      if (!isCurrentPasswordValid) {
        return Result.fail('InvalidPassword');
      }

      const newHash = await this.passwordHasher.hash(newPassword);
      account.changePassword(newHash);

      const saveResult = await accountRepo.save(account);
      if (saveResult.isFailure) {
        return Result.fail(saveResult.error!);
      }

      return Result.ok();
    });
  }
}
