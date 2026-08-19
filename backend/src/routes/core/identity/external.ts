import { Hono } from 'hono';
import { z } from 'zod';
import { Bindings } from '../../../types/bindings';
import { ExternalIdentityRepository } from '../../../infrastructure/repositories/ExternalIdentityRepository';
import { SecurityAuditAdapter } from '../../../infrastructure/security/SecurityAuditAdapter';
import { AuthMethodCounterAdapter } from '../../../infrastructure/repositories/AuthMethodCounterAdapter';
import { LinkExternalIdentityUseCase } from '../../../domains/identity/usecases/LinkExternalIdentityUseCase';
import { UnlinkExternalIdentityUseCase } from '../../../domains/identity/usecases/UnlinkExternalIdentityUseCase';

type AppType = {
  Bindings: Bindings;
  Variables: { db: any; user: { userId: number; aal: number } };
};

const externalRoutes = new Hono<AppType>();

// Schemas Zod de Validação de Contrato HTTP
const LinkBodySchema = z.object({
  provider: z.enum(['google', 'github', 'discord', 'apple']),
  providerSubjectId: z.string().min(1, 'providerSubjectId é obrigatório'),
  emailSnapshot: z.string().email().optional(),
});

const UnlinkBodySchema = z.object({
  bindingId: z.string().min(1, 'bindingId é obrigatório'),
});

// Middleware simples de verificação de autenticação de sessão
externalRoutes.use('*', async (c, next) => {
  const authHeader = c.req.header('Authorization');
  // Se não houver contexto de usuário setado pelo authGuard upstream, tentar recuperar
  const user = c.get('user');
  if (!user && !authHeader) {
    return c.json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Autenticação necessária' } }, 401);
  }
  await next();
});

/**
 * GET /api/core/identity/external-identities
 * Lista todas as identidades externas vinculadas à conta do usuário autenticado.
 */
externalRoutes.get('/', async (c) => {
  const db = c.get('db');
  const user = c.get('user');
  if (!user) return c.json({ success: false, error: { code: 'UNAUTHORIZED' } }, 401);

  const externalRepo = new ExternalIdentityRepository(db);
  const bindings = await externalRepo.findByUserId(user.userId);

  return c.json({
    success: true,
    data: bindings.map((b) => ({
      id: b.id,
      provider: b.provider,
      providerSubjectId: b.providerSubjectId,
      emailAtBinding: b.emailAtBinding,
      createdAt: b.createdAt,
    })),
  });
});

/**
 * POST /api/core/identity/external-identities/link
 * Vincula uma nova identidade externa (Exige AAL2+).
 */
externalRoutes.post('/link', async (c) => {
  const db = c.get('db');
  const user = c.get('user');

  if (!user) return c.json({ success: false, error: { code: 'UNAUTHORIZED' } }, 401);

  // Guard AF-007: Exigir AAL2+ (Step-Up)
  const sessionAal = user.aal || 1;
  if (sessionAal < 2) {
    return c.json(
      {
        success: false,
        error: {
          code: 'STEP_UP_REQUIRED',
          message: 'Vínculo de identidade exige autenticação de segundo fator AAL2+ (Step-Up).',
        },
      },
      403
    );
  }

  const bodyParse = LinkBodySchema.safeParse(await c.req.json().catch(() => ({})));
  if (!bodyParse.success) {
    return c.json(
      {
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Dados de vínculo inválidos',
          details: bodyParse.error.flatten(),
        },
      },
      400
    );
  }

  const { provider, providerSubjectId, emailSnapshot } = bodyParse.data;

  const externalRepo = new ExternalIdentityRepository(db);
  const auditAdapter = new SecurityAuditAdapter(db);

  // Abstração simples de UnitOfWork usando transação do Drizzle
  const uow = {
    execute: async <T>(fn: (txCtx: any) => Promise<T>): Promise<T> => {
      if (typeof db.transaction === 'function') {
        return db.transaction(async (tx: any) => {
          return fn({ transactionId: crypto.randomUUID(), isScoped: true, nativeTx: tx });
        });
      }
      return fn({ transactionId: crypto.randomUUID(), isScoped: true, nativeTx: db });
    },
  };

  const useCase = new LinkExternalIdentityUseCase(externalRepo, auditAdapter, uow);

  const result = await useCase.execute({
    userId: user.userId,
    sessionAal,
    assertion: {
      type: 'oauth',
      provider,
      subjectId: providerSubjectId,
      emailSnapshot,
      verifiedAt: new Date(),
    },
  });

  if (result.isFailure) {
    const errorMsg = result.error || 'Falha ao vincular identidade';
    const status = errorMsg.includes('STEP_UP_REQUIRED')
      ? 403
      : errorMsg.includes('IDENTITY_ALREADY_LINKED')
      ? 409
      : 400;

    return c.json(
      {
        success: false,
        error: {
          code: errorMsg.split(':')[0],
          message: errorMsg,
        },
      },
      status
    );
  }

  return c.json({
    success: true,
    data: result.getValue(),
  });
});

/**
 * POST /api/core/identity/external-identities/unlink
 * Desvincula uma identidade externa (Exige AAL2+ e Anti-Lockout).
 */
externalRoutes.post('/unlink', async (c) => {
  const db = c.get('db');
  const user = c.get('user');

  if (!user) return c.json({ success: false, error: { code: 'UNAUTHORIZED' } }, 401);

  // Guard AF-007: Exigir AAL2+ (Step-Up)
  const sessionAal = user.aal || 1;
  if (sessionAal < 2) {
    return c.json(
      {
        success: false,
        error: {
          code: 'STEP_UP_REQUIRED',
          message: 'Desvínculo de identidade exige autenticação de segundo fator AAL2+ (Step-Up).',
        },
      },
      403
    );
  }

  const bodyParse = UnlinkBodySchema.safeParse(await c.req.json().catch(() => ({})));
  if (!bodyParse.success) {
    return c.json(
      {
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Dados de desvínculo inválidos',
          details: bodyParse.error.flatten(),
        },
      },
      400
    );
  }

  const { bindingId } = bodyParse.data;

  const externalRepo = new ExternalIdentityRepository(db);
  const authCounter = new AuthMethodCounterAdapter(db);
  const auditAdapter = new SecurityAuditAdapter(db);

  const uow = {
    execute: async <T>(fn: (txCtx: any) => Promise<T>): Promise<T> => {
      if (typeof db.transaction === 'function') {
        return db.transaction(async (tx: any) => {
          return fn({ transactionId: crypto.randomUUID(), isScoped: true, nativeTx: tx });
        });
      }
      return fn({ transactionId: crypto.randomUUID(), isScoped: true, nativeTx: db });
    },
  };

  const useCase = new UnlinkExternalIdentityUseCase(externalRepo, authCounter, auditAdapter, uow);

  const result = await useCase.execute({
    userId: user.userId,
    bindingId,
    sessionAal,
  });

  if (result.isFailure) {
    const errorMsg = result.error || 'Falha ao desvincular identidade';
    const status = errorMsg.includes('STEP_UP_REQUIRED')
      ? 403
      : errorMsg.includes('CANNOT_UNLINK_LAST_AUTHENTICATION_METHOD')
      ? 409
      : errorMsg.includes('BINDING_NOT_FOUND')
      ? 444
      : 400;

    return c.json(
      {
        success: false,
        error: {
          code: errorMsg.split(':')[0],
          message: errorMsg,
        },
      },
      status === 444 ? 404 : status
    );
  }

  return c.json({
    success: true,
    data: result.getValue(),
  });
});

export default externalRoutes;
