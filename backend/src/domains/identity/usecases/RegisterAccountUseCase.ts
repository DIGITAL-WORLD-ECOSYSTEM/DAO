import { IUnitOfWork } from '../../../application/ports/output/IUnitOfWork';
import { IPasswordHasher } from '../../../application/ports/security/IPasswordHasher';
import { Result } from '../../../shared/kernel/Result';
import { Account } from '../entities/Account';

import { Citizen } from '../../citizens/entities/Citizen';

export class RegisterAccountUseCase {
  constructor(
    private uow: IUnitOfWork,
    private passwordHasher: IPasswordHasher
  ) {}

  async execute(input: any): Promise<Result<any>> {
    const { email, password, firstName, lastName } = input;

    if (!email || !password || !firstName || !lastName) {
      return Result.fail('ValidationError: Missing required fields');
    }

    return await this.uow.execute(async (factory) => {
      const accountRepo = factory.getAccountRepository();
      const citizenRepo = factory.getCitizenRepository();

      // 1. Validar unicidade do email
      const existingAccountResult = await accountRepo.findByEmail(email);
      if (existingAccountResult.isSuccess) {
        return Result.fail('EmailAlreadyExists');
      }

      // 2. Hash da Senha
      const secureHash = await this.passwordHasher.hash(password);

      // 3. Criar Account
      const newAccount = new Account({
        email,
        password: secureHash,
        role: 'citizen',
        active: true,
      });

      const accountSaveResult = await accountRepo.save(newAccount);
      if (accountSaveResult.isFailure) {
        return Result.fail(`Error saving Account: ${accountSaveResult.error}`);
      }
      const savedAccount = accountSaveResult.getValue();

      // 4. Criar Citizen
      const username = email.split('@')[0] + '_' + Math.random().toString(36).substring(2, 7);
      const newCitizen = new Citizen({
        userId: savedAccount.id!,
        username: username.toLowerCase(),
        firstName,
        lastName,
        did: `did:dao:asppibra:web2:${savedAccount.id}`,
        status: 'pending_genesis',
        publicKey: '',
      });

      const citizenSaveResult = await citizenRepo.save(newCitizen);
      if (citizenSaveResult.isFailure) {
        return Result.fail(citizenSaveResult.error!);
      }

      // 5. Retornar Sucesso (O UnitOfWork fará o commit)
      return Result.ok({
        userId: savedAccount.id,
        email: savedAccount.email,
        role: savedAccount.role,
        firstName: newCitizen.firstName,
        lastName: newCitizen.lastName,
      });
    });
  }
}
