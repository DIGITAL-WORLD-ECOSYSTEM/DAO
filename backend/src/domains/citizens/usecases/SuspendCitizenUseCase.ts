import { IUnitOfWork } from '../../../application/ports/output/IUnitOfWork';
import { Result } from '../../../shared/kernel/Result';
import { SuspensionReason } from '../entities/Citizen';

export class SuspendCitizenUseCase {
  constructor(private uow: IUnitOfWork) {}

  async execute(input: { accountId: number, reason: SuspensionReason, description?: string }): Promise<Result<void>> {
    const { accountId, reason, description } = input;

    if (!accountId) {
      return Result.fail('ValidationError: accountId inválido');
    }
    
    if (!reason || !Object.values(SuspensionReason).includes(reason)) {
      return Result.fail('ValidationError: reason inválido');
    }

    return await this.uow.execute(async (factory) => {
      const citizenRepo = factory.getCitizenRepository();

      const citizenResult = await citizenRepo.findByUserId(accountId);
      
      if (citizenResult.isFailure) {
        return Result.fail('CitizenNotFound');
      }

      const citizen = citizenResult.getValue();

      // Lei 28: Transição explícita
      const suspendResult = citizen.suspend(reason, description);
      
      if (suspendResult.isFailure) {
        return Result.fail(`TransitionForbidden: ${suspendResult.error}`);
      }

      if (citizen.domainEvents.length > 0) {
        const saveResult = await citizenRepo.save(citizen);
        if (saveResult.isFailure) {
          return Result.fail(saveResult.error || 'Erro ao persistir cidadão');
        }
      }

      return Result.ok();
    });
  }
}
