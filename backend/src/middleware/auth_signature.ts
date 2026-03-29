import { Context, Next } from 'hono';
import { CryptoCore } from '@dao/shared';
import { citizens } from '../db/schema';
import { eq } from 'drizzle-orm';

/**
 * Zero-Trust Signature Middleware
 * Requer o header X-Identity-Signature: Base64(Ed25519_Sign(Timestamp + Body))
 * E o header X-Identity-DID: did:dao:asppibra:<username>
 */
export const authSignature = async (c: Context, next: Next) => {
  const signature = c.req.header('X-Identity-Signature');
  const did = c.req.header('X-Identity-DID');
  const timestamp = c.req.header('X-Identity-Timestamp');
  
  if (!signature || !did || !timestamp) {
    return c.json({ success: false, message: "Missing Zero-Trust credentials (Signature/DID/Timestamp)." }, 401);
  }

  // 1. Verificar expiração do Timestamp (máximo 5 min)
  const now = Date.now();
  if (Math.abs(now - parseInt(timestamp)) > 300000) {
    return c.json({ success: false, message: "Request signature expired." }, 401);
  }

  // 2. Buscar Cidadão no DB
  const username = did.split(':').pop();
  if (!username) {
    return c.json({ success: false, message: "Invalid DID format." }, 401);
  }

  const db = c.get('db');
  const citizen = await db.query.citizens.findFirst({
    where: eq(citizens.username, username)
  });

  if (!citizen || citizen.status === 'revoked') {
    return c.json({ success: false, message: "Citizen not found or revoked." }, 401);
  }

  // 3. Verificar Assinatura
  const publicKey = Uint8Array.from(JSON.parse(citizen.publicKey));
  const bodyText = await c.req.raw.clone().text();
  const msg = new TextEncoder().encode(timestamp + bodyText);
  
  try {
    const isValid = CryptoCore.verify(
      Uint8Array.from(atob(signature).split('').map(c => c.charCodeAt(0))),
      msg,
      publicKey
    );

    if (!isValid) {
      return c.json({ success: false, message: "Invalid Zero-Trust signature." }, 401);
    }
  } catch (e) {
    return c.json({ success: false, message: "Signature verification failed." }, 401);
  }

  await next();
};
