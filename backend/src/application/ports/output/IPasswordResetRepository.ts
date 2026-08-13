import { Result } from '../../../shared/kernel/Result';

export interface PasswordReset {
  id: number;
  userId: number;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

export interface IPasswordResetRepository {
  findByToken(token: string): Promise<Result<PasswordReset>>;
  invalidate(id: number): Promise<Result<void>>;
  create(data: { userId: number; token: string; expiresAt: Date; used: boolean }): Promise<Result<void>>;
}
