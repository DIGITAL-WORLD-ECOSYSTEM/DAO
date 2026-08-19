import { describe, it, expect } from 'vitest';
import { CanonicalIdentityResolver } from '../src/infrastructure/identity/CanonicalIdentityResolver';
import { LinkExternalIdentityUseCase } from '../src/domains/identity/usecases/LinkExternalIdentityUseCase';
import { UnlinkExternalIdentityUseCase } from '../src/domains/identity/usecases/UnlinkExternalIdentityUseCase';

// Mocks de Repositórios e Adapters
class MockExternalRepo {
  private bindings: any[] = [];

  async findUserIdByProviderSubject(provider: string, subjectId: string) {
    const b = this.bindings.find((x) => x.provider === provider && x.providerSubjectId === subjectId);
    return b ? b.userId : null;
  }

  async findByProviderSubject(provider: string, subjectId: string) {
    const b = this.bindings.find((x) => x.provider === provider && x.providerSubjectId === subjectId);
    return b || null;
  }

  async findByUserId(userId: number) {
    return this.bindings.filter((x) => x.userId === userId);
  }

  async save(dto: any) {
    const record = {
      id: `ext_${Date.now()}_${Math.random()}`,
      userId: dto.userId,
      provider: dto.provider,
      providerSubjectId: dto.providerSubjectId,
      emailAtBinding: dto.emailAtBinding,
      createdAt: new Date(),
    };
    this.bindings.push(record);
    return record;
  }

  async delete(id: string) {
    this.bindings = this.bindings.filter((x) => x.id !== id);
  }
}

class MockWalletRepo {
  async findUserIdByWalletIdentity(networkId: number, address: string) {
    return null;
  }
}

class MockPasskeyRepo {
  async findUserIdByCredentialId(credId: string) {
    return null;
  }
}

class MockDidRepo {
  async findUserIdByDid(did: string) {
    return null;
  }
}

class MockAuditPort {
  public logs: any[] = [];
  async logEvent(event: any) {
    this.logs.push(event);
  }
}

class MockAuthMethodCounter {
  constructor(public primaryCount: number) {}
  async countPrimaryMethods(userId: number) {
    return this.primaryCount;
  }
}

const mockUow = {
  execute: async (fn: any) => fn({ transactionId: 'test_tx', isScoped: true }),
};

describe('Account-First Identity Resolution & Use Cases', () => {
  it('CanonicalIdentityResolver returns IDENTITY_NOT_LINKED for unknown assertions', async () => {
    const externalRepo = new MockExternalRepo();
    const walletRepo = new MockWalletRepo();
    const passkeyRepo = new MockPasskeyRepo();
    const didRepo = new MockDidRepo();

    const resolver = new CanonicalIdentityResolver(
      externalRepo as any,
      walletRepo as any,
      passkeyRepo as any,
      didRepo as any
    );

    const result = await resolver.resolve({
      type: 'oauth',
      provider: 'google',
      subjectId: 'google_unknown_123',
      verifiedAt: new Date(),
    });

    expect(result.status).toBe('not_linked');
    if (result.status === 'not_linked') {
      expect(result.code).toBe('IDENTITY_NOT_LINKED');
    }
  });

  it('LinkExternalIdentityUseCase fails when sessionAal < 2 (AF-007)', async () => {
    const externalRepo = new MockExternalRepo();
    const auditPort = new MockAuditPort();
    const useCase = new LinkExternalIdentityUseCase(externalRepo as any, auditPort as any, mockUow);

    const result = await useCase.execute({
      userId: 100,
      sessionAal: 1, // AAL1
      assertion: {
        type: 'oauth',
        provider: 'github',
        subjectId: 'gh_12345',
        verifiedAt: new Date(),
      },
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('STEP_UP_REQUIRED');
  });

  it('LinkExternalIdentityUseCase links successfully at AAL2 and is idempotent for same user', async () => {
    const externalRepo = new MockExternalRepo();
    const auditPort = new MockAuditPort();
    const useCase = new LinkExternalIdentityUseCase(externalRepo as any, auditPort as any, mockUow);

    // Primeira chamada -> Vínculo realizado
    const result1 = await useCase.execute({
      userId: 100,
      sessionAal: 2, // AAL2
      assertion: {
        type: 'oauth',
        provider: 'google',
        subjectId: 'g_888',
        verifiedAt: new Date(),
      },
    });

    expect(result1.isSuccess).toBe(true);
    expect(result1.getValue().status).toBe('linked');
    expect(auditPort.logs.length).toBe(1);

    // Segunda chamada idêntica -> Retorna 'already_linked' sem duplicar log
    const result2 = await useCase.execute({
      userId: 100,
      sessionAal: 2,
      assertion: {
        type: 'oauth',
        provider: 'google',
        subjectId: 'g_888',
        verifiedAt: new Date(),
      },
    });

    expect(result2.isSuccess).toBe(true);
    expect(result2.getValue().status).toBe('already_linked');
    expect(auditPort.logs.length).toBe(1); // Manteve 1 log
  });

  it('UnlinkExternalIdentityUseCase enforces Anti-Lockout (AF-008)', async () => {
    const externalRepo = new MockExternalRepo();
    const auditPort = new MockAuditPort();

    // Inserir um vínculo para o teste
    const saved = await externalRepo.save({
      userId: 100,
      provider: 'github',
      providerSubjectId: 'gh_999',
    });

    // Simulador onde o usuário só tem 1 método primário restante
    const authCounter = new MockAuthMethodCounter(1);
    const useCase = new UnlinkExternalIdentityUseCase(
      externalRepo as any,
      authCounter as any,
      auditPort as any,
      mockUow
    );

    const result = await useCase.execute({
      userId: 100,
      bindingId: saved.id,
      sessionAal: 2,
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('CANNOT_UNLINK_LAST_AUTHENTICATION_METHOD');
  });

  it('UnlinkExternalIdentityUseCase succeeds when primaryAuthMethods >= 2', async () => {
    const externalRepo = new MockExternalRepo();
    const auditPort = new MockAuditPort();

    const saved = await externalRepo.save({
      userId: 100,
      provider: 'github',
      providerSubjectId: 'gh_999',
    });

    // Simulador onde o usuário tem 2 ou mais métodos primários
    const authCounter = new MockAuthMethodCounter(2);
    const useCase = new UnlinkExternalIdentityUseCase(
      externalRepo as any,
      authCounter as any,
      auditPort as any,
      mockUow
    );

    const result = await useCase.execute({
      userId: 100,
      bindingId: saved.id,
      sessionAal: 2,
    });

    expect(result.isSuccess).toBe(true);
    expect(result.getValue().success).toBe(true);
    expect(auditPort.logs.some((l) => l.event === 'identity_unlinked')).toBe(true);
  });
});
