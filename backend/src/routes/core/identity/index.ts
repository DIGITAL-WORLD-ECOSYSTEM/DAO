import { Hono } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { verify } from 'hono/jwt';
import { zValidator } from '@hono/zod-validator';
import { authenticator } from 'otplib';
import { CryptoCore } from '../../../utils/crypto';
import { citizens, auditLogs, users } from '../../../db/schema';
import { sql, desc, eq, and } from 'drizzle-orm';
import { rateLimit } from '../../../middleware/rate_limit';

import { DIDResolver } from '../../../utils/did_resolver';
import { authSignature } from '../../../middleware/auth_signature';
import { RegisterSsi, LoginSsi, PasskeyBind, PasskeyLogin, TotpSetup, TotpVerify, Revoke } from '@asppibra/contracts/http';
import { Bindings } from '../../../types/bindings';
import oauthRouter from './oauth';
import localRouter from './local';

import { DrizzleUnitOfWork } from '../../../infrastructure/repositories/DrizzleUnitOfWork';
import { IdentityController } from '../../../domains/identity/controllers/IdentityController';
import { AuthenticateAccountUseCase } from '../../../domains/identity/usecases/AuthenticateAccountUseCase';
import { RegisterAccountUseCase } from '../../../domains/identity/usecases/RegisterAccountUseCase';
import { ChangePasswordUseCase } from '../../../domains/identity/usecases/ChangePasswordUseCase';
import { ResetPasswordUseCase } from '../../../domains/identity/usecases/ResetPasswordUseCase';
import { VerifyExternalIdentityUseCase } from '../../../domains/identity/usecases/VerifyExternalIdentityUseCase';
import { PBKDF2PasswordHasher } from '../../../infrastructure/security/crypto/PBKDF2PasswordHasher';

const hasher = new PBKDF2PasswordHasher();

/**
 * Identity Registry (SSI Handshake & DID Management)
 */

type AppType = { Bindings: Bindings; Variables: { db: any } };

const identity = new Hono<AppType>();

// Anexar o módulo de OAuth Sub-routes
identity.route('/oauth', oauthRouter);

// Anexar o módulo de Autenticação Legacy / Manual
identity.route('/local', localRouter);

// 🛡️ NATIVE KV RATE LIMITER (Anti-Brute Force)
identity.use('*', async (c, next) => {
  const ip = c.req.header('cf-connecting-ip') || 'anonymous';
  const key = `ratelimit:${ip}`;
  const limit = 20; // 20 requisições por minuto

  const current = await c.env.KV_AUTH.get(key);
  const count = current ? parseInt(current) : 0;

  if (count >= limit) {
    return c.json(
      { success: false, message: 'Muitas tentativas. Tente novamente em 1 minuto.' },
      429
    );
  }

  try {
    await c.env.KV_AUTH.put(key, (count + 1).toString(), { expirationTtl: 60 });
  } catch (e) {
    console.warn('Rate limit KV put failed:', e);
  }
  await next();
});

// 1. Geração de Challenge (Nonce) para Handshake
identity.get('/challenge/:username', async (c) => {
  const username = c.req.param('username');
  const db = c.get('db');

  // Verificar se o cidadão existe para retornar o Vault
  const [citizen] = await db
    .select()
    .from(citizens)
    .where(eq(citizens.username, username))
    .limit(1);

  const nonce = crypto.randomUUID();

  // Armazena no KV com expiração de 5 minutos
  await c.env.KV_AUTH.put(`nonce:${username}`, nonce, { expirationTtl: 300 });

  return c.json({
    success: true,
    challenge: nonce,
    encryptedVault: citizen?.encryptedVault || null,
    message: 'Assine este nonce com sua chave Ed25519 para provar sua identidade.',
  });
});

// 2. Registro de Cidadão (Genesis Completion)
identity.post('/register', zValidator('json', RegisterSsi.Schema), async (c) => {
  const { username, publicKey, signature, challenge, firstName, lastName, encryptedVault } =
    c.req.valid('json');
  const db = c.get('db');

  // 1. Verificar Challenge no KV
  const storedNonce = await c.env.KV_AUTH.get(`nonce:${username}`);
  if (!storedNonce || storedNonce !== challenge) {
    return c.json({ success: false, message: 'Challenge inválido ou expirado.' }, 401);
  }

  // 2. Verificar Assinatura (Proof of Possession)
  const msg = new TextEncoder().encode(challenge);
  const sig = typeof signature === 'string' ? Uint8Array.from(JSON.parse(signature)) : signature;
  const pub = typeof publicKey === 'string' ? Uint8Array.from(JSON.parse(publicKey)) : publicKey;

  const isValid = await CryptoCore.verify(sig, msg, pub);
  if (!isValid) {
    return c.json({ success: false, message: 'Assinatura criptográfica inválida.' }, 401);
  }

  // CMP-03: Invalidar o nonce após uso bem-sucedido (previne replay attacks)
  await c.env.KV_AUTH.delete(`nonce:${username}`);

  const did = `did:dao:asppibra:${username.toLowerCase()}`;

  try {
    const userEmail = `${username.toLowerCase()}@ssi.local`;
    let [existingUser] = await db
      .select({ id: users.id, email: users.email, role: users.role })
      .from(users)
      .where(eq(users.email, userEmail))
      .limit(1);

    let userId: number;
    let userRole: string;

    if (existingUser) {
      userId = existingUser.id;
      userRole = existingUser.role || 'citizen';
    } else {
      const [newUser] = await db
        .insert(users)
        .values({
          email: userEmail,
          password: crypto.randomUUID(),
          role: 'citizen',
          active: true,
          status: 'active',
        })
        .returning();
      userId = newUser.id;
      userRole = 'citizen';
    }

    const [citizen] = await db
      .insert(citizens)
      .values({
        userId,
        username,
        firstName,
        lastName,
        did,
        publicKey: JSON.stringify(Array.from(pub)),
        encryptedVault,
      })
      .returning();

    if (!citizen) throw new Error('Falha ao criar cidadão (D1 Returning Error).');

    await db.insert(auditLogs).values({
      targetUserId: userId,
      action: 'CITIZEN_GENESIS_COMPLETE',
      status: 'success',
      metadata: { username, did },
    });

    const { setupIdentityDI } = await import('../../../infrastructure/di/identity_container');
    const { issueSessionUseCase } = await setupIdentityDI(c);
    const sessionResult = await issueSessionUseCase.execute({
      userId,
      email: userEmail,
      role: userRole,
      aal: 1,
      firstName: citizen.firstName || '',
      lastName: citizen.lastName || '',
      username: citizen.username || '',
      tokenVersion: 1,
      ip: c.req.header('cf-connecting-ip') || '127.0.0.1',
      userAgent: c.req.header('user-agent') || ''
    });

    if (sessionResult.isFailure) throw new Error(sessionResult.error || 'Falha ao emitir sessão');
    const { accessToken, refreshToken } = sessionResult.getValue();
    const { setSessionCookies } = await import('../../../utils/auth');
    setSessionCookies(c, accessToken, refreshToken);

    return c.json({
      success: true,
      accessToken,
      encryptedVault: citizen.encryptedVault,
      user: {
        id: citizen.id,
        username: citizen.username,
        firstName: citizen.firstName,
        lastName: citizen.lastName,
        did: citizen.did,
        role: userRole,
      },
      message: 'Cidadão registrado com soberania total. Bem-vindo à DAO.',
    });
  } catch (e: any) {
    return c.json(
      { success: false, message: 'Username já ocupado ou erro no D1.', error: e.message },
      400
    );
  }
});

// 3. Handshake de Login (ZK-Proof)
identity.post('/login', zValidator('json', LoginSsi.Schema), async (c) => {
  const { username, signature, challenge, otpCode } = c.req.valid('json');
  const db = c.get('db');

  // 1. Validar Nonce e Cidadão
  const storedNonce = await c.env.KV_AUTH.get(`nonce:${username}`);
  if (!storedNonce || storedNonce !== challenge) {
    return c.json({ success: false, message: 'Challenge expirado ou inválido.' }, 401);
  }

  const citizen = await db.query.citizens.findFirst({
    where: eq(citizens.username, username),
  });

  if (!citizen || citizen.status === 'revoked') {
    return c.json({ success: false, message: 'Cidadão não encontrado ou revogado.' }, 401);
  }

  const pub = Uint8Array.from(JSON.parse(citizen.publicKey));
  const msg = new TextEncoder().encode(challenge);
  const sig = typeof signature === 'string' ? Uint8Array.from(JSON.parse(signature)) : signature;

  const isValidSig = await CryptoCore.verify(sig, msg, pub);
  if (!isValidSig) {
    return c.json({ success: false, message: 'Assinatura inválida. Acesso negado.' }, 401);
  }

  // 2. Verificar MFA (AAL2) se habilitado
  if (citizen.totpEnabled) {
    if (!otpCode) {
      return c.json(
        {
          success: false,
          mfaRequired: true,
          message: 'MFA Habilitado. Por favor, forneça o código TOTP para completar o login.',
        },
        202
      );
    }

    const { decryptTotpSecret } = await import('../../../utils/totp_crypto');
    const decryptedSecret = await decryptTotpSecret(citizen.totpSecret || '', c.env.JWT_SECRET);

    const isValidOTP = authenticator.check(otpCode, decryptedSecret);
    if (!isValidOTP) {
      return c.json({ success: false, message: 'Código MFA inválido.' }, 401);
    }
  }

  // CMP-03: Invalidar nonce após login bem-sucedido (previne replay attacks)
  await c.env.KV_AUTH.delete(`nonce:${username}`);

  // AJUSTE 2: lookup shadow user using userId from citizen
  let [userRecord] = await db
    .select({ id: users.id, role: users.role, email: users.email })
    .from(users)
    .where(eq(users.id, citizen.userId))
    .limit(1);

  let userId: number;
  let userEmail: string;
  let userRole: string;

  if (!userRecord) {
    userEmail = `${username.toLowerCase()}@ssi.local`;
    const [newUser] = await db
      .insert(users)
      .values({
        email: userEmail,
        password: crypto.randomUUID(),
        role: 'citizen',
        active: true,
        status: 'active',
      })
      .returning();
    userId = newUser.id;
    userRole = 'citizen';

    await db.update(citizens).set({ userId: userId }).where(eq(citizens.id, citizen.id));
  } else {
    userId = userRecord.id;
    userEmail = userRecord.email;
    userRole =
      userRecord.email === 'felipe.dev@empresa.com.br'
        ? 'dev'
        : userRecord.role === 'citizen'
          ? 'user'
          : userRecord.role || 'user';
  }

  const { setupIdentityDI } = await import('../../../infrastructure/di/identity_container');
  const { issueSessionUseCase } = await setupIdentityDI(c);
  const sessionResult = await issueSessionUseCase.execute({
    userId,
    email: userEmail,
    role: userRole,
    aal: citizen.totpEnabled ? 2 : 1,
    firstName: citizen.firstName || '',
    lastName: citizen.lastName || '',
    username: citizen.username || '',
    tokenVersion: 1,
    ip: c.req.header('cf-connecting-ip') || '127.0.0.1',
    userAgent: c.req.header('user-agent') || ''
  });

  if (sessionResult.isFailure) {
    return c.json({ success: false, message: sessionResult.error }, 500);
  }
  const { accessToken, refreshToken } = sessionResult.getValue();
  const { setSessionCookies } = await import('../../../utils/auth');
  setSessionCookies(c, accessToken, refreshToken);

  return c.json({
    success: true,
    accessToken,
    user: {
      id: citizen.id,
      username: citizen.username,
      firstName: citizen.firstName,
      lastName: citizen.lastName,
      did: citizen.did,
      role: userRole,
    },
    aal: citizen.totpEnabled ? 2 : 1,
    message: 'Handshake bem-sucedido. Identidade confirmada.',
  });
});

// 3.9 Geração de Challenge para Passkey Binding
identity.get('/passkey/challenge/:username', async (c) => {
  const username = c.req.param('username');
  const challenge = crypto.randomUUID();
  await c.env.KV_AUTH.put(`passkey_challenge:${username}`, challenge, { expirationTtl: 300 });
  return c.json({ success: true, challenge });
});

// 4. Bind Passkey (Biometria) - PROTEGIDO COM ZERO-TRUST
identity.post('/passkey/bind', authSignature, zValidator('json', PasskeyBind.Schema), async (c) => {
  const { username, credentialId, publicKey, challenge, signature } = c.req.valid('json');
  const db = c.get('db');

  const storedChallenge = await c.env.KV_AUTH.get(`passkey_challenge:${username}`);
  if (!storedChallenge || storedChallenge !== challenge) {
    return c.json({ success: false, message: 'Challenge de passkey inválido ou expirado.' }, 401);
  }

  const msg = new TextEncoder().encode(challenge);
  const sig = typeof signature === 'string' ? Uint8Array.from(JSON.parse(signature)) : signature;
  const pub = typeof publicKey === 'string' ? Uint8Array.from(JSON.parse(publicKey)) : publicKey;

  const isValid = await CryptoCore.verify(sig, msg, pub);
  if (!isValid) {
    return c.json({ success: false, message: 'Assinatura da Passkey inválida.' }, 401);
  }

  await c.env.KV_AUTH.delete(`passkey_challenge:${username}`);

  try {
    await db
      .update(citizens)
      .set({
        passkeyId: credentialId,
        passkeyPublicKey: publicKey,
      })
      .where(eq(citizens.username, username));

    return c.json({ success: true, message: 'Passkey vinculada com sucesso.' });
  } catch (e: any) {
    return c.json({ success: false, message: 'Erro ao vincular Passkey.' }, 400);
  }
});

// 4.1 Geração de Challenge para Passkey Login
identity.get('/passkey/login/challenge/:username', async (c) => {
  const username = c.req.param('username');
  const db = c.get('db');

  const citizen = await db.query.citizens.findFirst({
    where: eq(citizens.username, username),
  });

  if (!citizen || citizen.status === 'revoked' || !citizen.passkeyId || !citizen.passkeyPublicKey) {
    return c.json({ success: false, message: 'Passkey não configurada ou cidadão revogado.' }, 400);
  }

  const challenge = crypto.randomUUID();
  await c.env.KV_AUTH.put(`passkey_login_challenge:${username}`, challenge, { expirationTtl: 300 });

  return c.json({
    success: true,
    challenge,
    credentialId: citizen.passkeyId,
  });
});

// 4.2 Login via Passkey (Handshake Biométrico)
identity.post('/passkey/login', zValidator('json', PasskeyLogin.Schema), async (c) => {
  const { username, challenge, signature } = c.req.valid('json');
  const db = c.get('db');

  const storedChallenge = await c.env.KV_AUTH.get(`passkey_login_challenge:${username}`);
  if (!storedChallenge || storedChallenge !== challenge) {
    return c.json(
      { success: false, message: 'Challenge de passkey login inválido ou expirado.' },
      401
    );
  }

  const citizen = await db.query.citizens.findFirst({
    where: eq(citizens.username, username),
  });

  if (!citizen || citizen.status === 'revoked' || !citizen.passkeyPublicKey) {
    return c.json({ success: false, message: 'Cidadão não encontrado ou revogado.' }, 401);
  }

  const pub = Uint8Array.from(JSON.parse(citizen.passkeyPublicKey));
  const msg = new TextEncoder().encode(challenge);
  const sig = typeof signature === 'string' ? Uint8Array.from(JSON.parse(signature)) : signature;

  const isValid = await CryptoCore.verify(sig, msg, pub);
  if (!isValid) {
    return c.json({ success: false, message: 'Assinatura da Passkey inválida.' }, 401);
  }

  await c.env.KV_AUTH.delete(`passkey_login_challenge:${username}`);

  // Lookup user using citizen.userId
  let [userRecord] = await db
    .select({ id: users.id, role: users.role, email: users.email })
    .from(users)
    .where(eq(users.id, citizen.userId))
    .limit(1);

  let userId: number;
  let userEmail: string;
  let userRole: string;

  if (!userRecord) {
    userEmail = `${username.toLowerCase()}@ssi.local`;
    const [newUser] = await db
      .insert(users)
      .values({
        email: userEmail,
        password: crypto.randomUUID(),
        role: 'citizen',
        active: true,
        status: 'active',
      })
      .returning();
    userId = newUser.id;
    userRole = 'citizen';

    await db.update(citizens).set({ userId: userId }).where(eq(citizens.id, citizen.id));
  } else {
    userId = userRecord.id;
    userEmail = userRecord.email;
    userRole =
      userRecord.email === 'felipe.dev@empresa.com.br'
        ? 'dev'
        : userRecord.role === 'citizen'
          ? 'user'
          : userRecord.role || 'user';
  }

  const { setupIdentityDI } = await import('../../../infrastructure/di/identity_container');
  const { issueSessionUseCase } = await setupIdentityDI(c);
  const sessionResult = await issueSessionUseCase.execute({
    userId,
    email: userEmail,
    role: userRole,
    aal: 2, // Passkey/WebAuthn is AAL2 (biometric)
    firstName: citizen.firstName || '',
    lastName: citizen.lastName || '',
    username: citizen.username || '',
    tokenVersion: 1,
    ip: c.req.header('cf-connecting-ip') || '127.0.0.1',
    userAgent: c.req.header('user-agent') || ''
  });

  if (sessionResult.isFailure) {
    return c.json({ success: false, message: sessionResult.error }, 500);
  }
  const { accessToken, refreshToken } = sessionResult.getValue();
  const { setSessionCookies } = await import('../../../utils/auth');
  setSessionCookies(c, accessToken, refreshToken);

  return c.json({
    success: true,
    accessToken,
    user: {
      id: citizen.id,
      username: citizen.username,
      firstName: citizen.firstName,
      lastName: citizen.lastName,
      did: citizen.did,
      role: userRole,
    },
    aal: 2,
    message: 'Login via Passkey bem-sucedido.',
  });
});

// 5. Setup TOTP (Google Authenticator) - PROTEGIDO COM ZERO-TRUST
identity.post('/totp/setup', authSignature, zValidator('json', TotpSetup.Schema), async (c) => {
  const { username } = c.req.valid('json');
  const db = c.get('db');

  const secret = authenticator.generateSecret();
  const uri = authenticator.keyuri(username, 'ASPPIBRA-DAO', secret);

  const { encryptTotpSecret } = await import('../../../utils/totp_crypto');
  const encryptedSecret = await encryptTotpSecret(secret, c.env.JWT_SECRET);

  // Persistir o segredo no D1 (Inativo até verificação)
  await db
    .update(citizens)
    .set({
      totpSecret: encryptedSecret,
      totpEnabled: false,
    })
    .where(eq(citizens.username, username));

  return c.json({
    success: true,
    secret,
    uri,
    message: 'Segredo gerado. Por favor, verifique o código para ativar o MFA.',
  });
});

// 5.1 Verify & Enable TOTP
identity.post('/totp/verify', authSignature, zValidator('json', TotpVerify.Schema), async (c) => {
  const { username, code } = c.req.valid('json');
  const db = c.get('db');

  const citizen = await db.query.citizens.findFirst({
    where: eq(citizens.username, username),
  });

  if (!citizen || !citizen.totpSecret) {
    return c.json({ success: false, message: 'MFA não configurado para este usuário.' }, 400);
  }

  const { decryptTotpSecret } = await import('../../../utils/totp_crypto');
  const decryptedSecret = await decryptTotpSecret(citizen.totpSecret, c.env.JWT_SECRET);

  const isValid = authenticator.check(code, decryptedSecret);

  if (!isValid) {
    return c.json({ success: false, message: 'Código TOTP inválido.' }, 401);
  }

  // Ativar MFA definitivamente
  await db.update(citizens).set({ totpEnabled: true }).where(eq(citizens.username, username));

  await db.insert(auditLogs).values({
    action: 'MFA_ENABLED',
    targetUserId: citizen.userId,
    status: 'success',
    metadata: { method: 'TOTP' },
  });

  return c.json({
    success: true,
    message: 'MFA ativado com sucesso. Sua conta está agora no Nível AAL2.',
  });
});

// 6. DID Document Resolver (W3C Standard)
identity.get('/did/:id', async (c) => {
  const did = c.req.param('id');
  const username = did.split(':').pop();
  const db = c.get('db');

  if (!username) return c.json({ success: false, message: 'DID format inválido.' }, 400);

  const citizen = await db.query.citizens.findFirst({
    where: eq(citizens.username, username),
  });

  if (!citizen) return c.json({ success: false, message: 'DID not found.' }, 404);

  if (citizen.status === 'revoked') {
    return c.json(
      {
        id: citizen.did || `did:dao:asppibra:${citizen.username}`,
        deactivated: true,
      },
      410
    );
  }

  const doc = DIDResolver.generateDocument(citizen.username, citizen.publicKey);
  return c.json(doc);
});

// 7. Revogação de Identidade (Emergência) - PROTEGIDO COM ZERO-TRUST
identity.post('/revoke', authSignature, zValidator('json', Revoke.Schema), async (c) => {
  const { username } = c.req.valid('json');
  const db = c.get('db');

  const citizen = await db.query.citizens.findFirst({
    where: eq(citizens.username, username),
  });

  if (!citizen) return c.json({ success: false, message: 'Cidadão não encontrado.' }, 404);

  await db.update(citizens).set({ status: 'revoked' }).where(eq(citizens.username, username));

  await db.insert(auditLogs).values({
    action: 'CITIZEN_REVOKED',
    targetUserId: citizen.userId,
    status: 'success',
    metadata: { reason: 'Self-revocation requested via Zero-Trust signature' },
  });

  return c.json({ success: true, message: 'Identidade revogada com sucesso.' });
});

// 8. Validação de Sessão JWT e Fetch Completo do Perfil (/me)
identity.get('/me', async (c) => {
  try {
    const { getJwtToken, verifySession } = await import('../../../utils/auth');
    const token = getJwtToken(c);
    if (!token) {
      return c.json({ success: false, message: 'Usuário não autenticado' }, 401);
    }
    const { setupIdentityDI } = await import('../../../infrastructure/di/identity_container');
    const { sessionRepo, accountRepo } = await setupIdentityDI(c);
    const payload = await verifySession(c, token, sessionRepo, accountRepo);

    const userId = payload.userId || payload.sub;
    if (!userId) {
      return c.json({ success: false, message: 'Sessão inválida (sem userId)' }, 401);
    }

    const db = c.get('db');
    const { users, citizens, wallets, userSocialLinks, userNotificationSettings } =
      await import('../../../db/schema');
    const { eq } = await import('drizzle-orm');

    // Busca o usuário
    const user = await db.query.users.findFirst({
      where: eq(users.id, Number(userId)),
    });

    if (!user) {
      return c.json({ success: false, message: 'Usuário não encontrado' }, 404);
    }

    // Busca o cidadão vinculado
    const citizen = await db.query.citizens.findFirst({
      where: eq(citizens.userId, Number(userId)),
    });

    // Busca a carteira Web3 (se houver)
    const wallet = await db.query.wallets.findFirst({
      where: eq(wallets.userId, Number(userId)),
    });

    // Busca links sociais
    const socialLinks = await db.query.userSocialLinks.findMany({
      where: eq(userSocialLinks.userId, Number(userId)),
    });
    const socialLinksMap = socialLinks.reduce(
      (acc: any, curr: any) => ({ ...acc, [curr.provider]: curr.url }),
      {}
    );

    // Busca notificações
    const notifications = await db.query.userNotificationSettings.findMany({
      where: eq(userNotificationSettings.userId, Number(userId)),
    });
    const notificationsList = notifications.filter((n: any) => n.enabled).map((n: any) => n.type);

    // Normalização: Combina os dados para o frontend respeindo a Account-Centric Constitution
    return c.json({
      success: true,
      account: {
        id: user.id,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        kycStatus: user.kycStatus,
        status: user.status,
      },
      profiles: {
        citizen: citizen
          ? {
              id: citizen.id,
              username: citizen.username || payload.username || null,
              firstName: citizen.firstName || '',
              lastName: citizen.lastName || '',
              did: citizen.did || null,
              phoneNumber: citizen.phoneNumber || '',
              cpf: citizen.cpf || '',
              rg: citizen.rg || '',
              occupation: citizen.occupation || '',
              company: citizen.company || '',
              website: citizen.website || '',
              about: citizen.about || '',
              isPublic: citizen.isPublic || false,
              country: citizen.country || '',
              state: citizen.state || '',
              city: citizen.city || '',
              zipCode: citizen.zipCode || '',
              physicalAddress: citizen.address || '',
            }
          : null,
      },
      wallet: wallet
        ? {
            address: wallet.address,
            chainId: wallet.chainId,
          }
        : null,
      socialLinks: socialLinksMap,
      notificationPreferences: notificationsList,
    });
  } catch (err) {
    return c.json({ success: false, message: 'Sessão inválida ou expirada' }, 401);
  }
});

// 8.1 Atualização de Perfil (Self-Service)
const profileUpdateRateLimiter = rateLimit({ windowMs: 60000, maxRequests: 10 });
identity.patch('/me', profileUpdateRateLimiter, async (c) => {
  try {
    const { getJwtToken, verifySession } = await import('../../../utils/auth');
    const token = getJwtToken(c);
    if (!token) return c.json({ success: false, message: 'Não autorizado' }, 401);

    const { setupIdentityDI } = await import('../../../infrastructure/di/identity_container');
    const { sessionRepo, accountRepo } = await setupIdentityDI(c);
    const payload = await verifySession(c, token, sessionRepo, accountRepo);
    const userId = Number(payload.userId || payload.sub);

    const body = await c.req.json();
    const db = c.get('db');
    const { users, citizens, userSocialLinks, userNotificationSettings } =
      await import('../../../db/schema');
    const { eq, and } = await import('drizzle-orm');

    // 1. Atualizar users (Account) se fornecido
    if (body.account) {
      const accountUpdates: any = {};
      if (body.account.avatarUrl !== undefined) accountUpdates.avatarUrl = body.account.avatarUrl;
      if (Object.keys(accountUpdates).length > 0) {
        await db.update(users).set(accountUpdates).where(eq(users.id, userId));
      }
    }

    // 2. Atualizar citizens (Profile)
    if (body.profiles && body.profiles.citizen) {
      const citizenUpdates: any = {};
      const payloadCitizen = body.profiles.citizen;
      
      if (payloadCitizen.firstName !== undefined) citizenUpdates.firstName = payloadCitizen.firstName;
      if (payloadCitizen.lastName !== undefined) citizenUpdates.lastName = payloadCitizen.lastName;
      if (payloadCitizen.username !== undefined) citizenUpdates.username = payloadCitizen.username;
      if (payloadCitizen.phoneNumber !== undefined) citizenUpdates.phoneNumber = payloadCitizen.phoneNumber;
      if (payloadCitizen.cpf !== undefined) citizenUpdates.cpf = payloadCitizen.cpf;
      if (payloadCitizen.rg !== undefined) citizenUpdates.rg = payloadCitizen.rg;
      if (payloadCitizen.occupation !== undefined) citizenUpdates.occupation = payloadCitizen.occupation;
      if (payloadCitizen.company !== undefined) citizenUpdates.company = payloadCitizen.company;
      if (payloadCitizen.website !== undefined) citizenUpdates.website = payloadCitizen.website;
      if (payloadCitizen.about !== undefined) citizenUpdates.about = payloadCitizen.about;
      if (payloadCitizen.isPublic !== undefined) citizenUpdates.isPublic = payloadCitizen.isPublic;

      if (payloadCitizen.country !== undefined) citizenUpdates.country = payloadCitizen.country;
      if (payloadCitizen.state !== undefined) citizenUpdates.state = payloadCitizen.state;
      if (payloadCitizen.city !== undefined) citizenUpdates.city = payloadCitizen.city;
      if (payloadCitizen.zipCode !== undefined) citizenUpdates.zipCode = payloadCitizen.zipCode;
      if (payloadCitizen.address !== undefined) citizenUpdates.address = payloadCitizen.address;

      if (Object.keys(citizenUpdates).length > 0) {
        const citizen = await db.query.citizens.findFirst({ where: eq(citizens.userId, userId) });
        if (citizen) {
          await db.update(citizens).set(citizenUpdates).where(eq(citizens.id, citizen.id));
        } else {
          await db.insert(citizens).values({
            userId,
            username: citizenUpdates.username || `user_${userId}`,
            ...citizenUpdates,
          });
        }
      }
    }

    // 3. Atualizar Redes Sociais
    if (body.socialLinks && typeof body.socialLinks === 'object') {
      for (const [provider, url] of Object.entries(body.socialLinks)) {
        const existing = await db.query.userSocialLinks.findFirst({
          where: and(eq(userSocialLinks.userId, userId), eq(userSocialLinks.provider, provider)),
        });
        if (existing) {
          if (url) {
            await db
              .update(userSocialLinks)
              .set({ url: String(url) })
              .where(eq(userSocialLinks.id, existing.id));
          } else {
            await db.delete(userSocialLinks).where(eq(userSocialLinks.id, existing.id));
          }
        } else if (url) {
          await db.insert(userSocialLinks).values({ userId, provider, url: String(url) });
        }
      }
    }

    // 4. Atualizar Notificações
    if (Array.isArray(body.notificationPreferences)) {
      await db.delete(userNotificationSettings).where(eq(userNotificationSettings.userId, userId));
      const newPrefs = body.notificationPreferences.map((type: string) => ({
        userId,
        type,
        enabled: true,
      }));
      if (newPrefs.length > 0) {
        await db.insert(userNotificationSettings).values(newPrefs);
      }
    }

    return c.json({ success: true, message: 'Perfil atualizado com sucesso' });
  } catch (e: any) {
    return c.json({ success: false, message: 'Erro ao atualizar perfil', error: e.message }, 400);
  }
});

// 8.2 Troca de Senha
identity.post('/change-password', async (c) => {
  try {
    const { getJwtToken, verifySession } = await import('../../../utils/auth');
    const { PBKDF2PasswordHasher } = await import('../../../infrastructure/security/crypto/PBKDF2PasswordHasher');
    const hasher = new PBKDF2PasswordHasher();
    const token = getJwtToken(c);
    if (!token) return c.json({ success: false, message: 'Não autorizado' }, 401);

    const { setupIdentityDI } = await import('../../../infrastructure/di/identity_container');
    const { sessionRepo, accountRepo } = await setupIdentityDI(c);
    const payload = await verifySession(c, token, sessionRepo, accountRepo);
    const userId = Number(payload.userId || payload.sub);

    const { oldPassword, newPassword } = await c.req.json();
    if (!oldPassword || !newPassword) {
      return c.json({ success: false, message: 'Senhas não fornecidas' }, 400);
    }

    const db = c.get('db');
    const { users } = await import('../../../db/schema');
    const { eq } = await import('drizzle-orm');

    const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
    if (!user || !user.password)
      return c.json({ success: false, message: 'Usuário não suporta troca de senha local' }, 404);

    if (!user.password.includes(':')) {
      return c.json(
        {
          success: false,
          message:
            'Este e-mail está emparelhado a um provedor OAuth ou Web3. A troca de senha deve ser feita por lá.',
        },
        401
      );
    }

    const isMatched = await hasher.verify(oldPassword, user.password);
    if (!isMatched) {
      return c.json({ success: false, message: 'Senha atual incorreta' }, 401);
    }

    const secureHash = await hasher.hash(newPassword);
    await db.update(users).set({ password: secureHash }).where(eq(users.id, userId));

    return c.json({ success: true, message: 'Senha alterada com sucesso' });
  } catch (e: any) {
    return c.json({ success: false, message: 'Erro ao alterar senha', error: e.message }, 400);
  }
});
// ======================================================================
// === 9. WEB3 SIWE (Sign-In With Ethereum) ===
// ======================================================================

identity.get('/web3/nonce', async (c) => {
  const addressRaw = c.req.query('address');
  if (!addressRaw) return c.json({ success: false, message: 'Address required' }, 400);

  let address;
  try {
    const { getAddress } = await import('viem');
    address = getAddress(addressRaw);
  } catch (e) {
    return c.json({ success: false, message: 'Invalid address format' }, 400);
  }

  const nonce = crypto.randomUUID();
  await c.env.KV_AUTH.put(`web3_nonce:${address}`, nonce, { expirationTtl: 600 });

  return c.json({
    success: true,
    nonce,
    message: `Sign this message to authenticate your wallet to ASPPIBRA DAO.\n\nNonce: ${nonce}`,
  });
});

identity.post('/web3/verify', async (c) => {
  const { message, signature, address: addressRaw } = await c.req.json();
  const db = c.get('db');

  if (!message || !signature || !addressRaw) {
    return c.json({ success: false, message: 'Missing payload' }, 400);
  }

  let address: string;
  try {
    const { getAddress } = await import('viem');
    address = getAddress(addressRaw);
  } catch (e) {
    return c.json({ success: false, message: 'Invalid address format' }, 400);
  }

  const storedNonce = await c.env.KV_AUTH.get(`web3_nonce:${address}`);
  if (!storedNonce || !message.includes(storedNonce)) {
    return c.json({ success: false, message: 'Nonce expirado ou inválido.' }, 401);
  }

  try {
    const { verifyMessage } = await import('viem');
    const isValid = await verifyMessage({ address: address as any, message, signature });
    if (!isValid) throw new Error('Signature invalid');
  } catch (e) {
    return c.json({ success: false, message: 'Assinatura criptográfica inválida' }, 401);
  }

  await c.env.KV_AUTH.delete(`web3_nonce:${address}`);

  const { setupIdentityDI } = await import('../../../infrastructure/di/identity_container');
  const { controller, issueSessionUseCase } = await setupIdentityDI(c);

  const req = { body: { message, signature, address: addressRaw }, query: {}, params: {}, headers: {} };
  const httpResponse = await controller.verifyWeb3(req);

  if (httpResponse.status !== 200 || !httpResponse.body.accountData) {
    return c.json(httpResponse.body, httpResponse.status as ContentfulStatusCode);
  }

  const { accountData } = httpResponse.body;
  
  const sessionResult = await issueSessionUseCase.execute({
    userId: accountData.userId,
    email: accountData.email,
    role: accountData.role,
    aal: 1, // SIWE is factor 1
    firstName: accountData.citizen?.firstName || 'Web3',
    lastName: accountData.citizen?.lastName || address.slice(0, 6),
    username: accountData.citizen?.username || address.slice(0, 8),
    tokenVersion: 1,
    ip: c.req.header('cf-connecting-ip') || '127.0.0.1',
    userAgent: c.req.header('user-agent') || ''
  });

  if (sessionResult.isFailure) throw new Error(sessionResult.error || 'Falha ao emitir sessão SSI');
  const { accessToken, refreshToken: newRefreshToken } = sessionResult.getValue();
  const { setSessionCookies } = await import('../../../utils/auth');
  setSessionCookies(c, accessToken, newRefreshToken);

  return c.json({
    success: true,
    accessToken,
    user: { id: accountData.userId, address, role: accountData.role },
    message: httpResponse.body.message,
  });
});

// ======================================================================
// === 10. REFRESH E LOGOUT DE SESSÃO ===
// ======================================================================

identity.post('/logout', async (c) => {
  const { getJwtToken, verifySession, clearSessionCookies } = await import('../../../utils/auth');
  const token = getJwtToken(c);

  if (token) {
    try {
      const { setupIdentityDI } = await import('../../../infrastructure/di/identity_container');
      const { sessionRepo, accountRepo } = await setupIdentityDI(c);
      const payload = await verifySession(c, token, sessionRepo, accountRepo);
      if (payload.sessionId) {
        const db = c.get('db');
        const { userSessions } = await import('../../../db/schema');
        const { eq } = await import('drizzle-orm');
        // Marcar sessão como revogada no banco
        await db
          .update(userSessions)
          .set({ revokedAt: new Date(), revocationReason: 'User logout' })
          .where(eq(userSessions.id, payload.sessionId));
      }
    } catch (e) {
      // Ignora se o token já for inválido/expirado
    }
  }

  // Limpar cookies
  clearSessionCookies(c);

  return c.json({
    success: true,
    message: 'Sessão encerrada com sucesso.',
  });
});

identity.post('/refresh', async (c) => {
  const { getCookie } = await import('hono/cookie');
  const refreshToken = getCookie(c, 'refresh_token');

  if (!refreshToken) {
    return c.json({ success: false, message: 'Refresh token não fornecido.' }, 401);
  }

  const db = c.get('db');
  const { userSessions, users, citizens } = await import('../../../db/schema');
  const { and, eq, isNull } = await import('drizzle-orm');
  const { clearSessionCookies } = await import('../../../utils/auth');
  const hashString = async (str: string) => {
    const utf8 = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  };

  try {
    const tokenHash = await hashString(refreshToken);

    // Buscar sessão ativa correspondente
    const [session] = await db
      .select()
      .from(userSessions)
      .where(and(eq(userSessions.refreshTokenHash, tokenHash), isNull(userSessions.revokedAt)))
      .limit(1);

    if (!session) {
      clearSessionCookies(c);
      return c.json({ success: false, message: 'Sessão não encontrada ou revogada.' }, 401);
    }

    // Validar expiração
    if (Date.now() > session.expiresAt.getTime()) {
      // Marcar como revogado se expirou
      await db.update(userSessions).set({ revokedAt: new Date(), revocationReason: 'Session expired' }).where(eq(userSessions.id, session.id));
      clearSessionCookies(c);
      return c.json({ success: false, message: 'Sessão expirada.' }, 401);
    }

    // Obter dados do usuário para reemitir o token
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        firstName: citizens.firstName,
        lastName: citizens.lastName,
        username: citizens.username,
      })
      .from(users)
      .leftJoin(citizens, eq(users.id, citizens.userId))
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user) {
      clearSessionCookies(c);
      return c.json({ success: false, message: 'Usuário não encontrado.' }, 401);
    }

    // Rotação de Refresh Token (RTR): Revogar sessão antiga
    await db.update(userSessions).set({ revokedAt: new Date(), revocationReason: 'RTR Rotation' }).where(eq(userSessions.id, session.id));

    // Emitir nova sessão
    const userRole =
      user.email === 'felipe.dev@empresa.com.br'
        ? 'dev'
        : user.role === 'citizen'
          ? 'user'
          : user.role || 'user';
    const aal = userRole === 'dev' ? session.aal || 1 : session.aal || 1;

    const { setupIdentityDI } = await import('../../../infrastructure/di/identity_container');
    const { issueSessionUseCase } = await setupIdentityDI(c);
    const sessionResult = await issueSessionUseCase.execute({
      userId: user.id,
      email: user.email,
      role: userRole,
      aal,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: user.username || '',
      tokenVersion: 1,
      ip: c.req.header('cf-connecting-ip') || '127.0.0.1',
      userAgent: c.req.header('user-agent') || ''
    });

    if (sessionResult.isFailure) throw new Error(sessionResult.error || 'Falha ao emitir sessão');
    const { accessToken, refreshToken: newRefreshToken } = sessionResult.getValue();
    const { setSessionCookies } = await import('../../../utils/auth');
    setSessionCookies(c, accessToken, newRefreshToken);

    return c.json({
      success: true,
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: userRole,
      },
    });
  } catch (err: any) {
    clearSessionCookies(c);
    return c.json(
      { success: false, message: 'Erro ao rotacionar sessão', details: err.message },
      401
    );
  }
});

// === 11. DEVELOPER SSH MFA CHALLENGE & VERIFICATION ===

identity.get('/developer/challenge', async (c) => {
  const { getJwtToken, verifySession } = await import('../../../utils/auth');
  const token = getJwtToken(c);
  if (!token) return c.json({ success: false, message: 'Autenticação requerida.' }, 401);

  try {
    const { setupIdentityDI } = await import('../../../infrastructure/di/identity_container');
    const { sessionRepo, accountRepo } = await setupIdentityDI(c);
    const payload = await verifySession(c, token, sessionRepo, accountRepo);
    if (payload.role !== 'dev') {
      return c.json({ success: false, message: 'Acesso negado para esta função.' }, 403);
    }

    const challenge = crypto.randomUUID();
    await c.env.KV_AUTH.put(`developer_challenge:${payload.userId}`, challenge, {
      expirationTtl: 300,
    });

    return c.json({ success: true, challenge });
  } catch (e: any) {
    return c.json({ success: false, message: 'Sessão inválida.', details: e.message }, 401);
  }
});

identity.post('/developer/verify-ssh', async (c) => {
  const { getJwtToken, verifySession } = await import('../../../utils/auth');
  const token = getJwtToken(c);
  if (!token) return c.json({ success: false, message: 'Autenticação requerida.' }, 401);

  try {
    const { setupIdentityDI } = await import('../../../infrastructure/di/identity_container');
    const { sessionRepo, accountRepo } = await setupIdentityDI(c);
    const payload = await verifySession(c, token, sessionRepo, accountRepo);
    if (payload.role !== 'dev') {
      return c.json({ success: false, message: 'Acesso negado para esta função.' }, 403);
    }

    const { signature } = await c.req.json();
    if (!signature) {
      return c.json({ success: false, message: 'Assinatura SSH requerida.' }, 400);
    }

    const storedChallenge = await c.env.KV_AUTH.get(`developer_challenge:${payload.userId}`);
    if (!storedChallenge) {
      return c.json({ success: false, message: 'Desafio expirado ou não encontrado.' }, 400);
    }

    const sshKey = c.env.DEVELOPER_SSH_KEY;
    if (!sshKey) {
      return c.json(
        { success: false, message: 'Chave SSH do desenvolvedor não configurada no ambiente.' },
        500
      );
    }

    const { verifySshEd25519Signature } = await import('../../../utils/ssh_crypto');
    const isValid = await verifySshEd25519Signature(sshKey, signature, storedChallenge);
    if (!isValid) {
      return c.json({ success: false, message: 'Assinatura SSH inválida.' }, 401);
    }

    // 1. Invalida o desafio
    await c.env.KV_AUTH.delete(`developer_challenge:${payload.userId}`);

    // 2. Atualiza aal = 3 no banco para a sessão atual
    const db = c.get('db');
    const { userSessions } = await import('../../../db/schema');
    await db.update(userSessions).set({ aal: 3 }).where(eq(userSessions.id, payload.sessionId));

    // 3. Emite um novo token de acesso com aal = 3
    const kid = c.env.JWT_KEY_VERSION || 'v1';
    const { JwtService } = await import('../../../infrastructure/security/jwt/JwtService');
    const jwtService = new JwtService();

    const newPayload = {
      ...payload,
      aal: 3,
      exp: Math.floor(Date.now() / 1000) + 15 * 60,
    };
    const newAccessToken = await jwtService.sign(newPayload, c.env.JWT_SECRET, kid);

    // 4. Salva no Cookie de sessão do Hono
    const { setCookie } = await import('hono/cookie');
    const frontendUrl = c.env.FRONTEND_URL || '';
    const secure =
      frontendUrl.startsWith('https') ||
      (!frontendUrl.includes('localhost') && !frontendUrl.includes('127.0.0.1'));

    setCookie(c, 'access_token', newAccessToken, {
      httpOnly: true,
      secure,
      sameSite: 'Strict',
      path: '/',
      maxAge: 15 * 60,
    });

    return c.json({
      success: true,
      accessToken: newAccessToken,
      message: 'Verificação SSH bem-sucedida. Sessão elevada para AAL3.',
    });
  } catch (e: any) {
    return c.json({ success: false, message: 'Erro na verificação SSH.', details: e.message }, 401);
  }
});

export default identity;
