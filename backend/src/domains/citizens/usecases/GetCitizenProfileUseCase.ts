import { IUnitOfWork } from '../../../application/ports/output/IUnitOfWork';
import { Result } from '../../../shared/kernel/Result';

export interface CitizenProfileDTO {
  username: string;
  firstName: string;
  lastName: string;
  did: string;
  status: string;
  publicKey: string;
}

export class GetCitizenProfileUseCase {
  constructor(private uow: IUnitOfWork) {}

  async execute(input: { accountId: number }): Promise<Result<CitizenProfileDTO>> {
    const { accountId } = input;

    if (!accountId || typeof accountId !== 'number') {
      return Result.fail('ValidationError: accountId inválido');
    }

    return await this.uow.execute(async (factory) => {
      const citizenRepo = factory.getCitizenRepository();

      const citizenResult = await citizenRepo.findByUserId(accountId);
      
      if (citizenResult.isFailure) {
        return Result.fail(citizenResult.error || 'CitizenNotFound');
      }

      const citizen = citizenResult.getValue();

      const dto: CitizenProfileDTO = {
        username: citizen.username || '',
        firstName: citizen.firstName || '',
        lastName: citizen.lastName || '',
        did: citizen.did || '',
        status: citizen.status,
        publicKey: citizen.publicKey || ''
      };

      return Result.ok(dto);
    });
  }
}
