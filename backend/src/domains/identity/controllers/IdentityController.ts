import { AuthenticateAccountUseCase } from '../usecases/AuthenticateAccountUseCase';

export class IdentityController {
  constructor(private authenticateAccountUseCase: AuthenticateAccountUseCase) {}

  async login(c: any) {
    const { email, password } = c.req.valid('json');
    
    const result = await this.authenticateAccountUseCase.execute({ email, password });
    
    if (!result.success || !result.accountData) {
      return c.json({ success: false, message: result.message }, result.status || 401);
    }

    // Token Session issuance is part of Controller/HTTP delivery, not Domain Logic
    const { issueSession } = await import('../../../utils/auth');
    const { accessToken } = await issueSession(c, result.accountData);

    return c.json({
      success: true,
      message: result.message,
      accessToken,
      user: { 
        id: result.accountData.userId, 
        email: result.accountData.email, 
        role: result.accountData.role 
      },
    });
  }
}
