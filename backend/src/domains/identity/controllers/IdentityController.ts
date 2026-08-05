import { AuthenticateAccountUseCase } from '../usecases/AuthenticateAccountUseCase';
import { RegisterAccountUseCase } from '../usecases/RegisterAccountUseCase';
import { ChangePasswordUseCase } from '../usecases/ChangePasswordUseCase';
import { ResetPasswordUseCase } from '../usecases/ResetPasswordUseCase';
import { VerifyExternalIdentityUseCase } from '../usecases/VerifyExternalIdentityUseCase';
import { HttpRequest, HttpResponse } from '../../../application/ports/input/IHttp';

export class IdentityController {
  constructor(
    private authenticateAccountUseCase: AuthenticateAccountUseCase,
    private registerAccountUseCase: RegisterAccountUseCase,
    private changePasswordUseCase: ChangePasswordUseCase,
    private resetPasswordUseCase: ResetPasswordUseCase,
    private verifyExternalIdentityUseCase?: VerifyExternalIdentityUseCase
  ) {}

  async login(req: HttpRequest): Promise<HttpResponse> {
    const { email, password } = req.body;
    
    const result = await this.authenticateAccountUseCase.execute({ email, password });
    
    if (!result.success || !result.accountData) {
      return {
        status: result.status || 401,
        body: { success: false, message: result.message }
      };
    }

    // Token Session issuance should be handled by the route or a separate port, 
    // but for now we keep the dynamic import to decouple from global imports,
    // though ideally the UseCase or an Auth Port would handle this.
    // For pure controller decoupling, we return the data and let the Route handle the cookie,
    // or we just return the raw payload and let HonoAdapter set cookies (which is hard).
    // The current architecture expects the route to handle framework details.
    
    // We'll return the account data and let the route handle session issuance.
    return {
      status: 200,
      body: {
        success: true,
        message: result.message,
        accountData: result.accountData // Route will intercept this and issue token
      }
    };
  }

  async register(req: HttpRequest): Promise<HttpResponse> {
    const { email, password, firstName, lastName } = req.body;
    
    const result = await this.registerAccountUseCase.execute({ email, password, firstName, lastName });
    
    if (result.isFailure) {
      const isConflict = result.error?.includes('EmailAlreadyExists');
      return {
        status: isConflict ? 409 : 400,
        body: { success: false, message: result.error }
      };
    }

    const { userId, role } = result.getValue();

    return {
      status: 201,
      body: {
        success: true,
        message: 'Identificação Local cadastrada com sucesso.',
        accountData: {
          userId,
          email,
          role,
          aal: 1,
          firstName,
          lastName,
          username: email.split('@')[0], // Simplified since we don't return the raw username from UseCase yet
        }
      }
    };
  }

  async changePassword(req: HttpRequest): Promise<HttpResponse> {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;

    const result = await this.changePasswordUseCase.execute({ 
      userId: Number(userId), 
      currentPassword, 
      newPassword 
    });

    if (result.isFailure) {
      return {
        status: 400,
        body: { success: false, message: result.error }
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: 'Senha alterada com sucesso.'
      }
    };
  }

  async resetPassword(req: HttpRequest): Promise<HttpResponse> {
    const { token, password } = req.body;

    const result = await this.resetPasswordUseCase.execute({ 
      token, 
      newPassword: password 
    });

    if (result.isFailure) {
      return {
        status: 401,
        body: { success: false, message: result.error }
      };
    }

      return {
        status: 200,
        body: {
          success: true,
          message: 'A senha do Módulo Central Administrativo e Dashboard foi alterada irrevogavelmente com Sucesso.'
        }
      };
    }
  }

  async verifyWeb3(req: HttpRequest): Promise<HttpResponse> {
    if (!this.verifyExternalIdentityUseCase) {
      return {
        status: 500,
        body: { success: false, message: 'VerifyExternalIdentityUseCase not configured' }
      };
    }

    const { address, signature, nonce, chainId } = req.body;

    if (!address) {
      return {
        status: 400,
        body: { success: false, message: 'Missing address' }
      };
    }

    const result = await this.verifyExternalIdentityUseCase.execute({ address, chainId: chainId || 1 });

    if (result.isFailure) {
      return {
        status: 400,
        body: { success: false, message: result.error }
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: 'Identidade Web3 vinculada com sucesso.',
        accountData: result.getValue(),
      }
    };
  }
}
