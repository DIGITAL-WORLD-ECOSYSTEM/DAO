import { DrizzleUnitOfWork } from '../repositories/DrizzleUnitOfWork';
import { DrizzleSessionRepository } from '../repositories/DrizzleSessionRepository';
import { DrizzlePasswordResetRepository } from '../repositories/DrizzlePasswordResetRepository';
import { DrizzleAccountRepository as AccountRepository } from '../repositories/AccountRepository';
import { ResendNotificationAdapter } from '../notifications/ResendNotificationAdapter';
import { JwtService } from '../security/jwt/JwtService';
import { PBKDF2PasswordHasher } from '../security/crypto/PBKDF2PasswordHasher';
import { AuthenticateAccountUseCase } from '../../domains/identity/usecases/AuthenticateAccountUseCase';
import { RegisterAccountUseCase } from '../../domains/identity/usecases/RegisterAccountUseCase';
import { ChangePasswordUseCase } from '../../domains/identity/usecases/ChangePasswordUseCase';
import { ResetPasswordUseCase } from '../../domains/identity/usecases/ResetPasswordUseCase';
import { RequestPasswordResetUseCase } from '../../domains/identity/usecases/RequestPasswordResetUseCase';
import { IssueSessionUseCase } from '../../domains/identity/usecases/IssueSessionUseCase';
import { VerifyExternalIdentityUseCase } from '../../domains/identity/usecases/VerifyExternalIdentityUseCase';
import { IdentityController } from '../../domains/identity/controllers/IdentityController';

const hasher = new PBKDF2PasswordHasher();

export async function setupIdentityDI(c: any) {
  const db = c.get('db');
  const uow = new DrizzleUnitOfWork(db);
  const accountRepo = new AccountRepository(db);
  const passwordResetRepo = new DrizzlePasswordResetRepository(db);
  const sessionRepo = new DrizzleSessionRepository(db);
  const notificationAdapter = new ResendNotificationAdapter(c.env);
  const jwtService = new JwtService();

  const authUseCase = new AuthenticateAccountUseCase(uow, hasher);
  const registerUseCase = new RegisterAccountUseCase(uow, hasher);
  const changePwdUseCase = new ChangePasswordUseCase(uow, hasher);
  const resetPwdUseCase = new ResetPasswordUseCase(uow, hasher);
  const requestPwdResetUseCase = new RequestPasswordResetUseCase(accountRepo, passwordResetRepo, notificationAdapter);
  // Optional: instantiate verifyExternalIdentityUseCase if needed in your factory
  const verifyExternalIdentityUseCase = new VerifyExternalIdentityUseCase(uow);

  const controller = new IdentityController(
    authUseCase,
    registerUseCase,
    changePwdUseCase,
    resetPwdUseCase,
    requestPwdResetUseCase,
    verifyExternalIdentityUseCase
  );

  const kid = c.env.JWT_KEY_VERSION || 'v1';
  const secretKey = (kid ? c.env[`JWT_SECRET_${kid.toUpperCase()}`] || c.env.JWT_SECRET : c.env.JWT_SECRET) as string;
  const issueSessionUseCase = new IssueSessionUseCase(sessionRepo, jwtService, secretKey, kid);

  return {
    controller,
    issueSessionUseCase,
    sessionRepo,
    jwtService,
    accountRepo,
    hasher
  };
}
