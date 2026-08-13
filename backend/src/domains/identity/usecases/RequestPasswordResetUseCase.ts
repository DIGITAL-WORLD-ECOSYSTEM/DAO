import { Result } from '../../../shared/kernel/Result';
import { IAccountRepository } from '../../../application/ports/output/IAccountRepository';
import { IPasswordResetRepository } from '../../../application/ports/output/IPasswordResetRepository';
import { INotificationPort } from '../../../application/ports/output/INotificationPort';

export interface RequestPasswordResetDTO {
  email: string;
}

export class RequestPasswordResetUseCase {
  constructor(
    private accountRepository: IAccountRepository,
    private passwordResetRepository: IPasswordResetRepository,
    private notificationPort: INotificationPort
  ) {}

  async execute(dto: RequestPasswordResetDTO): Promise<Result<void>> {
    const accountResult = await this.accountRepository.findByEmail(dto.email);

    // Anti-enumeração: Se não encontrar, retorna sucesso falso silencioso.
    if (accountResult.isFailure) {
      return Result.ok();
    }

    const account = accountResult.getValue();

    // Se o usuário existir e tiver conta manual (senha presente).
    if (account.password && account.password.includes(':')) {
      const resetToken = crypto.randomUUID();

      await this.passwordResetRepository.create({
        userId: account.id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hora
        used: false,
      });

      await this.notificationPort.sendPasswordRecovery(account.email, resetToken);
    }

    return Result.ok();
  }
}
