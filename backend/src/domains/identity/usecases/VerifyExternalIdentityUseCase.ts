import { IUnitOfWork } from '../../../application/ports/output/IUnitOfWork';
import { Result } from '../../../shared/kernel/Result';
import { Account } from '../entities/Account';
import { Citizen } from '../../citizens/entities/Citizen';
import crypto from 'crypto';

export class VerifyExternalIdentityUseCase {
  constructor(private uow: IUnitOfWork) {}

  /**
   * Executa a verificação/criação de uma Identidade Externa (ex: Web3 Wallet).
   * Supõe-se que a assinatura criptográfica já foi validada na camada HTTP/Middleware.
   */
  async execute(input: { address: string; networkId: number }): Promise<Result<any>> {
    const { address, networkId } = input;
    const shadowEmail = `${address.toLowerCase()}@web3.local`;

    return await this.uow.execute(async (factory) => {
      const accountRepo = factory.getAccountRepository();
      const citizenRepo = factory.getCitizenRepository();
      const walletRepo = factory.getWalletRepository();

      // 1. Tentar encontrar a carteira primeiro, pois um shadow email pode mudar ou ser comum.
      const existingWalletResult = await walletRepo.findByAddress(address);
      
      let userId: number;
      let citizenRecord: any;

      if (existingWalletResult.isSuccess) {
        // Conta associada já existe
        const wallet = existingWalletResult.getValue();
        userId = wallet.userId;

        // Buscar cidadão correspondente
        const citizenResult = await citizenRepo.findByUserId(userId);
        if (citizenResult.isFailure) {
          // Se não existir, devemos criar o cidadão para esta conta orfã (recuperação)
          const username = `web3_${address.slice(2, 8)}_${Math.random().toString(36).substring(2, 5)}`.toLowerCase();
          const newCitizen = Citizen.restore({
            id: 0,
            userId,
            username,
            firstName: 'Web3',
            lastName: address.slice(0, 6),
            did: `did:dao:asppibra:eth:${address.toLowerCase()}`,
            status: 'PENDING',
            publicKey: '',
          });

          const saveResult = await citizenRepo.save(newCitizen);
          if (saveResult.isFailure) return Result.fail(saveResult.error!);
          citizenRecord = newCitizen;
        } else {
          citizenRecord = citizenResult.getValue();
        }

      } else {
        // 2. Criar nova conta shadow
        const newAccount = Account.restore({
          id: 0,
          email: shadowEmail,
          password: crypto.randomUUID(), // Uncrackable fallback hash
          role: 'citizen',
          active: true
        });

        const accountSaveResult = await accountRepo.save(newAccount);
        if (accountSaveResult.isFailure) return Result.fail(accountSaveResult.error!);
        
        const savedAccount = accountSaveResult.getValue();
        userId = savedAccount.id!;

        // 3. Salvar a Wallet
        const walletSaveResult = await walletRepo.save({
          userId,
          address,
          addressNormalized: address.toLowerCase(),
          networkId,
          provenance: 'external',
          isPrimary: false // external wallets cannot be primary
        });
        
        if (walletSaveResult.isFailure) return Result.fail(walletSaveResult.error!);
        
        // 4. Criar Cidadão
        const username = `web3_${address.slice(2, 8)}_${Math.random().toString(36).substring(2, 5)}`.toLowerCase();
        const newCitizen = Citizen.restore({
          id: 0,
          userId,
          username,
          firstName: 'Web3',
          lastName: address.slice(0, 6),
          did: `did:dao:asppibra:eth:${address.toLowerCase()}`,
          status: 'PENDING',
          publicKey: '',
        });

        const citizenSaveResult = await citizenRepo.save(newCitizen);
        if (citizenSaveResult.isFailure) return Result.fail(citizenSaveResult.error!);
        citizenRecord = newCitizen;
      }

      // Retornar os dados consolidados
      return Result.ok({
        userId,
        address,
        email: shadowEmail,
        role: 'citizen',
        citizen: {
          username: citizenRecord.username,
          firstName: citizenRecord.firstName,
          lastName: citizenRecord.lastName,
          status: citizenRecord.status,
        }
      });
    });
  }
}
