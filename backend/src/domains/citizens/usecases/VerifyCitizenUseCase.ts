import { IUnitOfWork } from '../../../application/ports/output/IUnitOfWork';
import { Result } from '../../../shared/kernel/Result';

export class VerifyCitizenUseCase {
  constructor(private uow: IUnitOfWork) {}

  async execute(input: { accountId: number }): Promise<Result<void>> {
    const { accountId } = input;

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

      // Lei 28: Transição explícita
      const verifyResult = citizen.verify();
      
      if (verifyResult.isFailure) {
        return Result.fail(`TransitionForbidden: ${verifyResult.error}`);
      }

      // Evitar save() se nenhum domain event foi emitido ou se a entidade não foi modificada
      // Neste caso, se o verify() foi um no-op (Idempotência), não gerou evento.
      // E o status não mudou. 
      // Mas a Entity limpa os domain events? Inicialmente domainEvents.length seria 1 se mudou.
      // Vamos assumir que se verify() funcionou e emitiu evento, salvamos.
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
