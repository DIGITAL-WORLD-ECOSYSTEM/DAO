import { IUnitOfWork } from '../../../application/ports/output/IUnitOfWork';
import { Result } from '../../../shared/kernel/Result';

export class VerifyExternalIdentityUseCase {
  constructor(private uow: IUnitOfWork) {}

  /**
   * Executa a verificação/autenticação de uma Carteira Web3 Vinculada.
   * Supõe-se que a assinatura criptográfica (SIWE) já foi validada no Middleware.
   *
   * Restrição Constitucional (AF-010):
   * Carteiras desconhecidas NUNCA criam contas (auto-provisionamento estritamente proibido).
   */
  async execute(input: { address: string; networkId: number }): Promise<Result<any>> {
    const { address, networkId } = input;

    return await this.uow.execute(async (factory) => {
      const citizenRepo = factory.getCitizenRepository();
      const walletRepo = factory.getWalletRepository();

      // 1. Tentar encontrar a carteira pré-vinculada
      const existingWalletResult = await walletRepo.findByAddress(address);

      if (existingWalletResult.isFailure) {
        return Result.fail('IDENTITY_NOT_LINKED');
      }

      const wallet = existingWalletResult.getValue();

      // Validar correspondência de rede (networkId)
      if (wallet.networkId && wallet.networkId !== networkId) {
        // Se a carteira existe mas em outra rede, permitir se for a mesma chave de endereço
      }

      const userId = wallet.userId;

      // Buscar dados do cidadão vinculado
      const citizenResult = await citizenRepo.findByUserId(userId);
      const citizenRecord = citizenResult.isSuccess ? citizenResult.getValue() : null;

      return Result.ok({
        userId,
        address,
        role: 'citizen',
        citizen: citizenRecord
          ? {
              username: citizenRecord.username,
              firstName: citizenRecord.firstName,
              lastName: citizenRecord.lastName,
              status: citizenRecord.status,
            }
          : null,
      });
    });
  }
}
