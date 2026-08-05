import { GetCitizenProfileUseCase } from '../usecases/GetCitizenProfileUseCase';
import { UpdateCitizenProfileUseCase } from '../usecases/UpdateCitizenProfileUseCase';
import { VerifyCitizenUseCase } from '../usecases/VerifyCitizenUseCase';
import { SuspendCitizenUseCase } from '../usecases/SuspendCitizenUseCase';
import { HttpRequest, HttpResponse } from '../../../application/ports/input/IHttp';
import { SuspensionReason } from '../entities/Citizen';

export class CitizenController {
  constructor(
    private getCitizenProfileUseCase: GetCitizenProfileUseCase,
    private updateCitizenProfileUseCase: UpdateCitizenProfileUseCase,
    private verifyCitizenUseCase: VerifyCitizenUseCase,
    private suspendCitizenUseCase: SuspendCitizenUseCase
  ) {}

  async getProfile(req: HttpRequest): Promise<HttpResponse> {
    const { accountId } = req.params;

    const result = await this.getCitizenProfileUseCase.execute({ 
      accountId: Number(accountId)
    });

    if (result.isFailure) {
      const isNotFound = result.error?.includes('CitizenNotFound');
      return {
        status: isNotFound ? 404 : 400,
        body: { success: false, message: result.error }
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        profile: result.getValue()
      }
    };
  }

  async updateProfile(req: HttpRequest): Promise<HttpResponse> {
    const { accountId } = req.params;
    const { address, phone } = req.body;

    const result = await this.updateCitizenProfileUseCase.execute({ 
      accountId: Number(accountId),
      address,
      phone
    });

    if (result.isFailure) {
      const isNotFound = result.error?.includes('CitizenNotFound');
      return {
        status: isNotFound ? 404 : 400,
        body: { success: false, message: result.error }
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: 'Perfil civil atualizado com sucesso.'
      }
    };
  }

  async verify(req: HttpRequest): Promise<HttpResponse> {
    const { accountId } = req.params;

    const result = await this.verifyCitizenUseCase.execute({ 
      accountId: Number(accountId)
    });

    if (result.isFailure) {
      const isNotFound = result.error?.includes('CitizenNotFound');
      const isForbidden = result.error?.includes('TransitionForbidden');
      return {
        status: isNotFound ? 404 : (isForbidden ? 403 : 400),
        body: { success: false, message: result.error }
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: 'Cidadão verificado com sucesso.'
      }
    };
  }

  async suspend(req: HttpRequest): Promise<HttpResponse> {
    const { accountId } = req.params;
    const { reason, description } = req.body;

    const result = await this.suspendCitizenUseCase.execute({ 
      accountId: Number(accountId),
      reason: reason as SuspensionReason,
      description
    });

    if (result.isFailure) {
      const isNotFound = result.error?.includes('CitizenNotFound');
      const isForbidden = result.error?.includes('TransitionForbidden');
      return {
        status: isNotFound ? 404 : (isForbidden ? 403 : 400),
        body: { success: false, message: result.error }
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: 'Cidadão suspenso com sucesso.'
      }
    };
  }
}
