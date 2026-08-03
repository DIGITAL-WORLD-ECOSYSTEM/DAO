import { GetCitizenProfileUseCase } from '../usecases/GetCitizenProfileUseCase';
import { UpdateCitizenProfileUseCase } from '../usecases/UpdateCitizenProfileUseCase';
import { HttpRequest, HttpResponse } from '../../../application/ports/input/IHttp';

export class CitizenController {
  constructor(
    private getCitizenProfileUseCase: GetCitizenProfileUseCase,
    private updateCitizenProfileUseCase: UpdateCitizenProfileUseCase
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
}
