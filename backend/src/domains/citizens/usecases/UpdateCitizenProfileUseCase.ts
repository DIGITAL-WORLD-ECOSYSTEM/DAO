import { IUnitOfWork } from '../../../application/ports/output/IUnitOfWork';
import { Result } from '../../../shared/kernel/Result';

export class UpdateCitizenProfileUseCase {
  constructor(private uow: IUnitOfWork) {}

  async execute(input: { accountId: number; address?: string; phone?: string }): Promise<Result<void>> {
    const { accountId, address, phone } = input;

    if (!accountId) {
      return Result.fail('ValidationError: accountId inválido');
    }

    return await this.uow.execute(async (factory) => {
      const citizenRepo = factory.getCitizenRepository();

      const citizenResult = await citizenRepo.findByUserId(accountId);
      
      if (citizenResult.isFailure) {
        return Result.fail('CitizenNotFound');
      }

      const citizen = citizenResult.getValue();
      let hasChanges = false;

      // Lei 27: Mutações através de Domain Behaviors

      if (address !== undefined) {
        // Se for idêntico, o Domain Behavior (changeAddress) vai retornar OK e não mudará
        const previousAddress = citizen.address;
        const changeResult = citizen.changeAddress(address);
        
        if (changeResult.isFailure) {
          return Result.fail(`ValidationError: ${changeResult.error}`);
        }

        if (citizen.address !== previousAddress) {
          hasChanges = true;
        }
      }

      if (phone !== undefined) {
        const previousPhone = citizen.phone;
        const phoneResult = citizen.updatePhone(phone);
        
        if (phoneResult.isFailure) {
          return Result.fail(`${phoneResult.error}`);
        }

        if (citizen.phone !== previousPhone) {
          hasChanges = true;
        }
      }

      // Previne chamadas desnecessárias ao banco de dados se os valores originais eram idênticos
      if (hasChanges) {
        const saveResult = await citizenRepo.save(citizen);
        if (saveResult.isFailure) {
          return Result.fail(saveResult.error || 'Erro ao persistir cidadão');
        }
      }

      return Result.ok();
    });
  }
}
