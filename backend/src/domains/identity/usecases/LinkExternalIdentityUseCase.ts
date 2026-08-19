import { IdentityAssertion } from '../../../application/dto/IdentityAssertion';
import { TransactionContext } from '../../../application/dto/TransactionContext';
import { IExternalIdentityRepository } from '../../../application/ports/output/IExternalIdentityRepository';
import { ISecurityAuditPort } from '../../../application/ports/output/ISecurityAuditPort';
import { Result } from '../../../shared/kernel/Result';

export interface LinkExternalIdentityInput {
  readonly userId: number;
  readonly sessionAal: number;
  readonly assertion: IdentityAssertion;
}

export type LinkExternalIdentityOutput = {
  readonly success: boolean;
  readonly status: 'linked' | 'already_linked';
  readonly bindingId?: string;
};

export class LinkExternalIdentityUseCase {
  constructor(
    private readonly externalRepo: IExternalIdentityRepository,
    private readonly auditPort: ISecurityAuditPort,
    private readonly uow: { execute: <T>(fn: (txCtx: TransactionContext) => Promise<T>) => Promise<T> }
  ) {}

  public async execute(input: LinkExternalIdentityInput): Promise<Result<LinkExternalIdentityOutput>> {
    const { userId, sessionAal, assertion } = input;

    // AF-007: Exigir AAL2+ Step-Up
    if (sessionAal < 2) {
      return Result.fail('STEP_UP_REQUIRED: AAL2+ assurance is required for identity linking');
    }

    if (assertion.type !== 'oauth') {
      return Result.fail('UNSUPPORTED_LINK_ASSERTION_TYPE');
    }

    // 1. Verificar se a identidade já existe no sistema
    const existingBinding = await this.externalRepo.findByProviderSubject(
      assertion.provider,
      assertion.subjectId
    );

    if (existingBinding) {
      // Cenário A: Pertence ao próprio usuário -> Idempotente (200 OK, zero mutation, zero log)
      if (existingBinding.userId === userId) {
        return Result.ok({
          success: true,
          status: 'already_linked',
          bindingId: existingBinding.id,
        });
      }

      // Cenário B: Pertence a outro usuário -> HTTP 409 Conflict
      return Result.fail('IDENTITY_ALREADY_LINKED: This external identity is linked to another account');
    }

    // 2. Transação ACID atômica: Gravação do Vínculo + Log de Auditoria
    try {
      const result = await this.uow.execute(async (txCtx) => {
        const savedRecord = await this.externalRepo.save(
          {
            userId,
            provider: assertion.provider,
            providerSubjectId: assertion.subjectId,
            emailAtBinding: assertion.emailSnapshot,
          },
          txCtx
        );

        await this.auditPort.logEvent(
          {
            event: 'identity_linked',
            userId,
            metadata: {
              provider: assertion.provider,
              providerSubjectId: assertion.subjectId,
              bindingId: savedRecord.id,
            },
          },
          txCtx
        );

        return savedRecord;
      });

      return Result.ok({
        success: true,
        status: 'linked',
        bindingId: result.id,
      });
    } catch (error: any) {
      if (error.message?.includes('UNIQUE') || error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return Result.fail('IDENTITY_ALREADY_LINKED: This external identity is linked to another account');
      }
      return Result.fail(`LINK_FAILED: ${error.message}`);
    }
  }
}
