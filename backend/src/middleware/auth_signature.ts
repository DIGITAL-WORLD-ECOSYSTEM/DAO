import { Context, Next } from 'hono';
import { verify } from 'hono/jwt';
import { CryptoCore } from '../utils/crypto';
import { citizens } from '../db/schema';
import { eq } from 'drizzle-orm';

/**
 * Zero-Trust Signature Middleware
 * Requer o header X-Identity-Signature: Base64(Ed25519_Sign(Timestamp + Body))
 * E o header X-Identity-DID: did:dao:asppibra:<username>
 *
 * FALLBACK: Aceita JWT Bearer token se os headers de Zero-Trust estiverem ausentes.
 */
export const authSignature = async (c: Context, next: Next) => {
  const path = c.req.path;
  if (path.includes('/webhook')) {
    return next();
  }

  const signature = c.req.header('X-Identity-Signature');
  const did = c.req.header('X-Identity-DID');
  const timestamp = c.req.header('X-Identity-Timestamp');

  const hasAnyZeroTrustHeader = signature || did || timestamp;

  // --- FALLBACK JWT (Para sessões padrão de Cidadão via Web2/Social) ---
  if (!signature || !did || !timestamp) {
    if (hasAnyZeroTrustHeader) {
      return c.json({ success: false, message: 'Missing Zero-Trust credentials.' }, 401);
    }

    const { getJwtToken, verifySession } = await import('../utils/auth');
    const token = getJwtToken(c);
    if (token) {
      try {
        const { setupIdentityDI } = await import('../infrastructure/di/identity_container');
        const { sessionRepo, accountRepo } = await setupIdentityDI(c);
        const payload = await verifySession(c, token, sessionRepo, accountRepo);

        // Injetar o usuário do JWT no contexto (compatível com o que o blog espera)
        c.set('user', {
          userId: payload.userId || payload.sub,
          role: payload.role || 'citizen',
        });

        return await next();
      } catch (err) {
        return c.json({ success: false, message: 'Invalid or expired session token.' }, 401);
      }
    }
    return c.json({ success: false, message: 'Authentication required (Zero-Trust or JWT).' }, 401);
  }

  // 1. Verificar expiração do Timestamp (máximo 5 min)
  const now = Date.now();
  if (Math.abs(now - parseInt(timestamp)) > 300000) {
    return c.json({ success: false, message: 'Request signature expired.' }, 401);
  }

  // 2. Buscar Cidadão no DB
  const username = did.split(':').pop();
  if (!username) {
    return c.json({ success: false, message: 'Invalid DID format.' }, 401);
  }

  const db = c.get('db');
  const citizen = await db.query.citizens.findFirst({
    where: eq(citizens.username, username),
  });

  if (!citizen || citizen.status === 'revoked') {
    return c.json({ success: false, message: 'Citizen not found or revoked.' }, 401);
  }

  // 3. Verificar Assinatura
  const publicKey = Uint8Array.from(JSON.parse(citizen.publicKey));
  const bodyText = await c.req.raw.clone().text();
  const msg = new TextEncoder().encode(timestamp + bodyText);

  try {
    const isValid = await CryptoCore.verify(
      Uint8Array.from(
        atob(signature)
          .split('')
          .map((c) => c.charCodeAt(0))
      ),
      msg,
      publicKey
    );

    if (!isValid) {
      return c.json({ success: false, message: 'Invalid Zero-Trust signature.' }, 401);
    }

    // 🛂 INJETAR IDENTIDADE NO CONTEXTO
    if (!citizen.userId) {
      return c.json({ success: false, message: 'Citizen is not linked to a User account.' }, 403);
    }

    c.set('user', { userId: citizen.userId, role: 'citizen' });
  } catch (e) {
    return c.json({ success: false, message: 'Signature verification failed.' }, 401);
  }

  await next();
};
