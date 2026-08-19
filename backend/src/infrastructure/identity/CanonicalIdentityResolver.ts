import { IIdentityResolverPort } from '../../application/ports/output/IIdentityResolverPort';
import { IdentityAssertion } from '../../application/dto/IdentityAssertion';
import { IdentityResolutionResult } from '../../application/dto/IdentityResolutionResult';
import { IExternalIdentityRepository } from '../../application/ports/output/IExternalIdentityRepository';
import { IWalletIdentityRepository } from '../../application/ports/output/IWalletIdentityRepository';
import { IPasskeyIdentityRepository } from '../../application/ports/output/IPasskeyIdentityRepository';
import { IDidIdentityRepository } from '../../application/ports/output/IDidIdentityRepository';

/**
 * Orquestrador Central de Resolução Canônica de Identidade.
 * Conecta os repositórios especializados de infraestrutura aos Use Cases
 * sem expor detalhes de banco de dados ou provedores de terceiros.
 */
export class CanonicalIdentityResolver implements IIdentityResolverPort {
  constructor(
    private readonly externalRepo: IExternalIdentityRepository,
    private readonly walletRepo: IWalletIdentityRepository,
    private readonly passkeyRepo: IPasskeyIdentityRepository,
    private readonly didRepo: IDidIdentityRepository
  ) {}

  public async resolve(assertion: IdentityAssertion): Promise<IdentityResolutionResult> {
    switch (assertion.type) {
      case 'oauth': {
        const userId = await this.externalRepo.findUserIdByProviderSubject(
          assertion.provider,
          assertion.subjectId
        );
        if (userId) {
          return {
            status: 'resolved',
            userId,
            bindingType: 'oauth',
            provider: assertion.provider,
          };
        }
        break;
      }

      case 'web3_wallet': {
        const userId = await this.walletRepo.findUserIdByWalletIdentity(
          assertion.networkId,
          assertion.subjectId.toLowerCase()
        );
        if (userId) {
          return {
            status: 'resolved',
            userId,
            bindingType: 'web3_wallet',
            provider: assertion.provider,
          };
        }
        break;
      }

      case 'passkey': {
        const userId = await this.passkeyRepo.findUserIdByCredentialId(assertion.subjectId);
        if (userId) {
          return {
            status: 'resolved',
            userId,
            bindingType: 'passkey',
            provider: assertion.provider,
          };
        }
        break;
      }

      case 'ssi_did': {
        const userId = await this.didRepo.findUserIdByDid(assertion.subjectId);
        if (userId) {
          return {
            status: 'resolved',
            userId,
            bindingType: 'ssi_did',
            provider: assertion.provider,
          };
        }
        break;
      }
    }

    return {
      status: 'not_linked',
      code: 'IDENTITY_NOT_LINKED',
      message: `No account linked for assertion type: ${assertion.type}, subjectId: ${assertion.subjectId}`,
    };
  }
}
