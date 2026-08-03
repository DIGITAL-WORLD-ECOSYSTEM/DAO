import { Context } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { eq } from 'drizzle-orm';
import { users, userSessions } from '../db/schema';

import { JwtService } from '../infrastructure/security/jwt/JwtService';

const jwtService = new JwtService();

export function decodeJwt(token: string): any {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Token JWT malformatado.');
  }
  let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const payloadStr = new TextDecoder().decode(
    new Uint8Array(Array.from(atob(base64)).map(c => c.charCodeAt(0)))
  );
  return JSON.parse(payloadStr);
}

/**
 * Hash SHA-256 para o refresh token
 */
export async function hashString(str: string): Promise<string> {
  const utf8 = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Extrai o token JWT a partir do Cookie ou do Header Authorization
 */
export function getJwtToken(c: Context): string | undefined {
  const cookieToken = getCookie(c, 'access_token');
  if (cookieToken) return cookieToken;

  const authHeader = c.req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  return undefined;
}

export async function getJwtSigningKeyForKid(kid: string, env: any): Promise<CryptoKey> {
  const secretKey = kid ? env[`JWT_SECRET_${kid.toUpperCase()}`] || env.JWT_SECRET : env.JWT_SECRET;
  const enc = new TextEncoder();

  const masterKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(secretKey),
    { name: 'HKDF' },
    false,
    ['deriveKey']
  );

  return await crypto.subtle.deriveKey(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: enc.encode('ASPPIBRA-JWT'),
      info: enc.encode('JWT-SIGNING'),
    },
    masterKey,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Valida a assinatura do token JWT e checa a revogação global por tokenVersion
 */
export async function verifySession(c: Context, token: string): Promise<any> {
  let kid = 'v1';
  try {
    const parts = token.split('.');
    if (parts.length > 0) {
  let base64 = parts[0].replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      const headerStr = new TextDecoder().decode(
        new Uint8Array(Array.from(atob(base64)).map(c => c.charCodeAt(0)))
      );
      const header = JSON.parse(headerStr);
      if (header && header.kid) {
        kid = header.kid;
      }
    }
  } catch (e) {
    throw new Error('Token JWT malformatado.');
  }

  const secretKey = kid ? c.env[`JWT_SECRET_${kid.toUpperCase()}`] || c.env.JWT_SECRET : c.env.JWT_SECRET;
  const payload = await jwtService.verify(token, secretKey);

  // Validação de claims obrigatórios (SEC-05)
  if (!payload.iss || payload.iss !== 'asppibra-dao') {
    throw new Error('Invalid JWT issuer');
  }
  if (!payload.aud || payload.aud !== 'asppibra-app') {
    throw new Error('Invalid JWT audience');
  }
  if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('JWT expired');
  }
  if (typeof payload.iat !== 'number' || payload.iat > Math.floor(Date.now() / 1000)) {
    throw new Error('Invalid JWT iat');
  }
  if (typeof payload.nbf !== 'number' || payload.nbf > Math.floor(Date.now() / 1000)) {
    throw new Error('JWT not yet active');
  }

  const sessionId = (payload.sid || payload.sessionId) as string;
  if (!sessionId) {
    throw new Error('Missing session ID in JWT');
  }

  const db = c.get('db');

  // SEC-02 & AJUSTE 5: Consultar e validar a sessão no banco
  const [session] = await db
    .select()
    .from(userSessions)
    .where(eq(userSessions.id, sessionId))
    .limit(1);

  if (!session) {
    throw new Error('Sessão não encontrada.');
  }
  if (session.revoked) {
    throw new Error('Sessão foi revogada.');
  }
  if (Date.now() > session.expiresAt.getTime()) {
    throw new Error('Sessão expirada.');
  }
  if (session.aal !== null && session.aal !== undefined) {
    if ((payload.aal as number) > session.aal) {
      throw new Error('MFA/AAL verification mismatch.');
    }
  }

  // AJUSTE 5: Validar se o usuário está ativo
  if (payload.userId) {
    const [user] = await db
      .select({
        tokenVersion: users.tokenVersion,
        active: users.active,
        status: users.status,
      })
      .from(users)
      .where(eq(users.id, Number(payload.userId)))
      .limit(1);

    if (!user) {
      throw new Error('Usuário não encontrado.');
    }
    if (user.tokenVersion > (payload.tokenVersion as number)) {
      throw new Error('Token revogado globalmente devido a alteração cadastral.');
    }
    if (user.active === false || user.status !== 'active') {
      throw new Error('Usuário inativo ou bloqueado.');
    }
  }

  return payload;
}

export interface SessionUserInfo {
  userId: number;
  email: string;
  role: string;
  aal: number;
  firstName?: string;
  lastName?: string;
  username?: string;
}

/**
 * Cria a sessão no D1, assina o JWT de 15 minutos e configura os cookies HttpOnly
 */
export async function issueSession(
  c: Context,
  userInfo: SessionUserInfo
): Promise<{ accessToken: string; refreshToken: string }> {
  const db = c.get('db');

  // 1. Obter a tokenVersion atual do usuário
  const [user] = await db
    .select({ tokenVersion: users.tokenVersion })
    .from(users)
    .where(eq(users.id, userInfo.userId))
    .limit(1);
  const tokenVersion = user ? user.tokenVersion : 1;

  // 2. Gerar identificadores únicos
  const sessionId = crypto.randomUUID();
  const jti = crypto.randomUUID();
  const refreshToken = crypto.randomUUID();
  const refreshTokenHash = await hashString(refreshToken);

  // 3. Persistir sessão na tabela user_sessions
  const createdAt = new Date();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 dias

  await db.insert(userSessions).values({
    id: sessionId,
    userId: userInfo.userId,
    jti,
    ip: c.req.header('cf-connecting-ip') || '127.0.0.1',
    userAgent: c.req.header('user-agent') || '',
    refreshTokenHash,
    aal: userInfo.aal,
    createdAt,
    expiresAt,
    revoked: false,
  });

  // Determinar a versão da chave (KID) e derivar via HKDF
  const kid = c.env.JWT_KEY_VERSION || 'v1';
  const secretKey = kid ? c.env[`JWT_SECRET_${kid.toUpperCase()}`] || c.env.JWT_SECRET : c.env.JWT_SECRET;

  // 4. Assinar Access Token com claims hardened e kid no header
  const accessToken = await jwtService.sign(
    {
      iss: 'asppibra-dao',
      aud: 'asppibra-app',
      sub: userInfo.email,
      userId: userInfo.userId,
      role: userInfo.role,
      aal: userInfo.aal,
      jti,
      sessionId,
      sid: sessionId,
      firstName: userInfo.firstName || '',
      lastName: userInfo.lastName || '',
      username: userInfo.username || '',
      tokenVersion,
      iat: Math.floor(Date.now() / 1000),
      nbf: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15 minutos
    },
    secretKey,
    kid
  );

  // 5. Configurar Cookies seguros no Hono
  const frontendUrl = c.env.FRONTEND_URL || '';
  const secure =
    frontendUrl.startsWith('https') ||
    (!frontendUrl.includes('localhost') && !frontendUrl.includes('127.0.0.1'));

  setCookie(c, 'access_token', accessToken, {
    httpOnly: true,
    secure,
    sameSite: 'Strict',
    path: '/',
    maxAge: 15 * 60, // 15 min
  });

  setCookie(c, 'refresh_token', refreshToken, {
    httpOnly: true,
    secure,
    sameSite: 'Strict',
    path: '/',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  });

  return { accessToken, refreshToken };
}

/**
 * Limpa os cookies da sessão
 */
export function clearSessionCookies(c: Context) {
  const frontendUrl = c.env.FRONTEND_URL || '';
  const secure =
    frontendUrl.startsWith('https') ||
    (!frontendUrl.includes('localhost') && !frontendUrl.includes('127.0.0.1'));

  deleteCookie(c, 'access_token', { path: '/', secure, sameSite: 'Strict' });
  deleteCookie(c, 'refresh_token', { path: '/', secure, sameSite: 'Strict' });
}
