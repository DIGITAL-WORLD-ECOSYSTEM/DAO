import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { CryptoCore } from '@dao/shared';
import { citizens, auditLogs } from '../../../db/schema';
import { eq } from 'drizzle-orm';

import { DIDResolver } from '../../../utils/did_resolver';
import { authSignature } from '../../../middleware/auth_signature';

/**
 * Identity Registry (SSI Handshake & DID Management)
 */

const identity = new Hono<any>();

// 🛡️ NATIVE KV RATE LIMITER (Anti-Brute Force)
identity.use('*', async (c, next) => {
  const ip = c.req.header('cf-connecting-ip') || 'anonymous';
  const key = `ratelimit:${ip}`;
  const limit = 20; // 20 requisições por minuto
  
  const current = await c.env.KV_AUTH.get(key);
  const count = current ? parseInt(current) : 0;

  if (count >= limit) {
    return c.json({ success: false, message: "Muitas tentativas. Tente novamente em 1 minuto." }, 429);
  }

  await c.env.KV_AUTH.put(key, (count + 1).toString(), { expirationTtl: 60 });
  await next();
});

// 1. Geração de Challenge (Nonce) para Handshake
identity.get('/challenge/:username', async (c: any) => {
  const username = c.req.param('username');
  const nonce = crypto.randomUUID();
  
  // Armazena no KV com expiração de 2 minutos
  await c.env.KV_AUTH.put(`nonce:${username}`, nonce, { expirationTtl: 120 });

  return c.json({
    success: true,
    challenge: nonce,
    message: "Assine este nonce com sua chave Ed25519 (Genesis) para provar sua identidade."
  });
});

// 2. Registro de Cidadão (Genesis Completion)
identity.post('/register', async (c: any) => {
  const { username, publicKey, signature, challenge } = await c.req.json();
  const db = c.get('db');

  // 1. Verificar Challenge no KV
  const storedNonce = await c.env.KV_AUTH.get(`nonce:${username}`);
  if (!storedNonce || storedNonce !== challenge) {
    return c.json({ success: false, message: "Challenge inválido ou expirado." }, 401);
  }

  // 2. Verificar Assinatura (Proof of Possession)
  const msg = new TextEncoder().encode(challenge);
  const sig = typeof signature === 'string' ? Uint8Array.from(JSON.parse(signature)) : signature;
  const pub = typeof publicKey === 'string' ? Uint8Array.from(JSON.parse(publicKey)) : publicKey;

  const isValid = CryptoCore.verify(sig, msg, pub);
  if (!isValid) {
    return c.json({ success: false, message: "Assinatura criptográfica inválida." }, 401);
  }

  const did = `did:dao:asppibra:${username.toLowerCase()}`;

  try {
    await db.insert(citizens).values({
      username,
      did,
      publicKey: JSON.stringify(Array.from(pub)),
      status: 'active'
    });

    await db.insert(auditLogs).values({
      action: 'CITIZEN_GENESIS_COMPLETE',
      status: 'success',
      metadata: { username, did }
    });

    return c.json({
      success: true,
      did,
      message: "Cidadão registrado com soberania total. Bem-vindo à DAO."
    });
  } catch (e: any) {
    return c.json({ success: false, message: "Username já ocupado ou erro no D1.", error: e.message }, 400);
  }
});

// 3. Handshake de Login (ZK-Proof)
identity.post('/login', async (c: any) => {
  const { username, signature, challenge } = await c.req.json();
  const db = c.get('db');

  const storedNonce = await c.env.KV_AUTH.get(`nonce:${username}`);
  if (!storedNonce || storedNonce !== challenge) {
    return c.json({ success: false, message: "Challenge inválido ou expirado." }, 401);
  }

  const citizen = await db.query.citizens.findFirst({
    where: eq(citizens.username, username)
  });

  // 🛡️ SECURITY CHECK: Negar login se revogado
  if (!citizen || citizen.status === 'revoked') {
    return c.json({ success: false, message: "Cidadão não encontrado ou identidade revogada." }, 404);
  }

  const pub = Uint8Array.from(JSON.parse(citizen.publicKey));
  const msg = new TextEncoder().encode(challenge);
  const sig = typeof signature === 'string' ? Uint8Array.from(JSON.parse(signature)) : signature;

  const isValid = CryptoCore.verify(sig, msg, pub);
  if (!isValid) {
    return c.json({ success: false, message: "Assinatura inválida. Acesso negado." }, 401);
  }

  const token = await sign({
    username: citizen.username,
    did: citizen.did,
    role: 'citizen',
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
  }, c.env.JWT_SECRET);

  return c.json({
    success: true,
    token,
    message: "Handshake bem-sucedido."
  });
});

// 4. Bind Passkey (Biometria) - PROTEGIDO COM ZERO-TRUST
identity.post('/passkey/bind', authSignature, async (c: any) => {
  const { username, credentialId, publicKey } = await c.req.json();
  const db = c.get('db');

  try {
    await db.update(citizens)
      .set({
        passkeyId: credentialId,
        passkeyPublicKey: publicKey
      })
      .where(eq(citizens.username, username));

    return c.json({ success: true, message: "Passkey vinculada com sucesso." });
  } catch (e: any) {
    return c.json({ success: false, message: "Erro ao vincular Passkey." }, 400);
  }
});

// 5. Setup TOTP (Google Authenticator) - PROTEGIDO COM ZERO-TRUST
identity.get('/totp/setup/:username', authSignature, async (c: any) => {
  const username = c.req.param('username');
  const secret = crypto.randomUUID().split('-')[0].toUpperCase(); 
  
  return c.json({
    success: true,
    secret,
    uri: `otpauth://totp/ASPPIBRA-DAO:${username}?secret=${secret}&issuer=ASPPIBRA-DAO`
  });
});

// 6. DID Document Resolver (W3C Standard)
identity.get('/did/:id', async (c: any) => {
  const did = c.req.param('id');
  const username = did.split(':').pop();
  const db = c.get('db');

  const citizen = await db.query.citizens.findFirst({
    where: eq(citizens.username, username)
  });

  if (!citizen) return c.json({ success: false, message: "DID not found." }, 404);

  const doc = DIDResolver.generateDocument(citizen.username, citizen.publicKey);
  return c.json(doc);
});

// 7. Revogação de Identidade (Emergência) - PROTEGIDO COM ZERO-TRUST
identity.post('/revoke', authSignature, async (c: any) => {
  const { username } = await c.req.json();
  const db = c.get('db');

  const citizen = await db.query.citizens.findFirst({
    where: eq(citizens.username, username)
  });

  if (!citizen) return c.json({ success: false, message: "Cidadão não encontrado." }, 404);

  await db.update(citizens)
    .set({ status: 'revoked' })
    .where(eq(citizens.username, username));

  await db.insert(auditLogs).values({
    action: 'CITIZEN_REVOKED',
    citizenId: citizen.id,
    status: 'success',
    metadata: { reason: 'Self-revocation requested via Zero-Trust signature' }
  });

  return c.json({ success: true, message: "Identidade revogada com sucesso." });
});

export default identity;