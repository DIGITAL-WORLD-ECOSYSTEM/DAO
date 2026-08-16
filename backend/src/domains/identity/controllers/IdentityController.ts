import { AuthenticateAccountUseCase } from '../usecases/AuthenticateAccountUseCase';
import { RegisterAccountUseCase } from '../usecases/RegisterAccountUseCase';
import { ChangePasswordUseCase } from '../usecases/ChangePasswordUseCase';
import { ResetPasswordUseCase } from '../usecases/ResetPasswordUseCase';
import { RequestPasswordResetUseCase } from '../usecases/RequestPasswordResetUseCase';
import { VerifyExternalIdentityUseCase } from '../usecases/VerifyExternalIdentityUseCase';
import { HttpRequest, HttpResponse } from '../../../application/ports/input/IHttp';

export class IdentityController {
  constructor(
    private authenticateAccountUseCase: AuthenticateAccountUseCase,
    private registerAccountUseCase: RegisterAccountUseCase,
    private changePasswordUseCase: ChangePasswordUseCase,
    private resetPasswordUseCase: ResetPasswordUseCase,
    private requestPasswordResetUseCase: RequestPasswordResetUseCase,
    private verifyExternalIdentityUseCase?: VerifyExternalIdentityUseCase
  ) {}

  async login(req: HttpRequest): Promise<HttpResponse> {
    const { email, password } = req.body;
    
    const result = await this.authenticateAccountUseCase.execute({ email, password });
    
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
        message: 'Login realizado com sucesso',
        accountData: result.getValue() 
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
          username: email.split('@')[0], 
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

  async forgotPassword(req: HttpRequest): Promise<HttpResponse> {
    const { email } = req.body;
    await this.requestPasswordResetUseCase.execute({ email });
    return {
      status: 200,
      body: {
        success: true,
        message: 'Se o e-mail existir, um link de recuperação será enviado em breve.'
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

    const result = await this.verifyExternalIdentityUseCase.execute({ address, networkId: chainId || 1 });

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
