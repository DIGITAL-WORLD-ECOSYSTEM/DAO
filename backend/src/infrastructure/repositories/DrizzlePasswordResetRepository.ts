import { Result } from '../../shared/kernel/Result';
import { IPasswordResetRepository, PasswordReset } from '../../application/ports/output/IPasswordResetRepository';
import { passwordResets } from '../../db/schema';
import { eq } from 'drizzle-orm';

export class DrizzlePasswordResetRepository implements IPasswordResetRepository {
  constructor(private db: any) {}

  async findByToken(token: string): Promise<Result<PasswordReset>> {
    try {
      const [reset] = await this.db
        .select()
        .from(passwordResets)
        .where(eq(passwordResets.token, token))
        .limit(1);

      if (!reset) {
        return Result.fail('PasswordResetNotFound');
      }
      return Result.ok(reset as PasswordReset);
    } catch (e: any) {
      return Result.fail(e.message);
    }
  }

  async invalidate(id: number): Promise<Result<void>> {
    try {
      await this.db
        .update(passwordResets)
        .set({ used: true })
        .where(eq(passwordResets.id, id));
      return Result.ok();
    } catch (e: any) {
      return Result.fail(e.message);
    }
  }
}
