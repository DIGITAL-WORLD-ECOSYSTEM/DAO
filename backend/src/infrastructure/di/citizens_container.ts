import { Context } from 'hono';
import { DrizzleUnitOfWork } from '../repositories/DrizzleUnitOfWork';
import { GetCitizenProfileUseCase } from '../../domains/citizens/usecases/GetCitizenProfileUseCase';
import { UpdateCitizenProfileUseCase } from '../../domains/citizens/usecases/UpdateCitizenProfileUseCase';
import { VerifyCitizenUseCase } from '../../domains/citizens/usecases/VerifyCitizenUseCase';
import { SuspendCitizenUseCase } from '../../domains/citizens/usecases/SuspendCitizenUseCase';
import { CitizenController } from '../../domains/citizens/controllers/CitizenController';

export async function setupCitizensDI(c: Context) {
  const db = c.get('db' as any);
  
  // Repositories & Ports
  const uow = new DrizzleUnitOfWork(db);

  // UseCases
  const getProfileUseCase = new GetCitizenProfileUseCase(uow);
  const updateProfileUseCase = new UpdateCitizenProfileUseCase(uow);
  const verifyUseCase = new VerifyCitizenUseCase(uow);
  const suspendUseCase = new SuspendCitizenUseCase(uow);

  // Controllers
  const controller = new CitizenController(
    getProfileUseCase,
    updateProfileUseCase,
    verifyUseCase,
    suspendUseCase
  );

  return {
    uow,
    controller,
    getProfileUseCase,
    updateProfileUseCase,
    verifyUseCase,
    suspendUseCase
  };
}
