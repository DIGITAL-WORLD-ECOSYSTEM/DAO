import { IUnitOfWork } from '../../../application/ports/output/IUnitOfWork';
import { IPasswordHasher } from '../../../application/ports/security/IPasswordHasher';
import { Result } from '../../../shared/kernel/Result';

export class ResetPasswordUseCase {
  constructor(
    private uow: IUnitOfWork,
    private passwordHasher: IPasswordHasher
  ) {}

  async execute(input: any): Promise<Result<any>> {
    const { token, newPassword } = input;

    if (!token || !newPassword || newPassword.trim() === '') {
      return Result.fail('ValidationError: Token ou Nova Senha inválidos');
    }

    return await this.uow.execute(async (factory) => {
      const resetRepo = factory.getPasswordResetRepository();
      const accountRepo = factory.getAccountRepository();
      const sessionRepo = factory.getSessionRepository();

      // 1. Hash do token
      const tokenHash = await (async (str: string) => {
        const utf8 = new TextEncoder().encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      })(token);

      const resetResult = await resetRepo.findByToken(tokenHash);
      if (resetResult.isFailure) {
        return Result.fail('TokenInvalid');
      }

      const resetData = resetResult.getValue();

      if (resetData.usedAt !== null) {
        return Result.fail('TokenInvalid: Token já utilizado');
      }

      // 2. Token expirado?
      if (resetData.expiresAt < new Date()) {
        return Result.fail('TokenExpired');
      }

      // 3. Buscar Account
      const accountResult = await accountRepo.findById(resetData.userId);
      if (accountResult.isFailure) {
        return Result.fail('AccountNotFound');
      }

      const account = accountResult.getValue();

      // 4. Hash da nova senha
      const newHash = await this.passwordHasher.hash(newPassword);
      account.changePassword(newHash);

      const saveResult = await accountRepo.save(account);
      if (saveResult.isFailure) {
        return Result.fail(saveResult.error!);
      }

      // 5. Invalidar token
      const invalidateResult = await resetRepo.invalidate(resetData.id);
      if (invalidateResult.isFailure) {
        return Result.fail(`Erro ao invalidar token: ${invalidateResult.error}`);
      }

      // 6. Revogar todas as sessões anteriores (Anti-hijacking)
      await sessionRepo.revokeAllUserSessions(account.id);

      // 7. Commit
      return Result.ok();
    });
  }
}

