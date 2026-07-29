import { Context } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { eq } from 'drizzle-orm';
import { users, userSessions } from '../db/schema';

function base64UrlEncode(arr: Uint8Array): string {
  const binString = String.fromCharCode(...arr);
  return btoa(binString).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64UrlDecode(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binString = atob(base64);
  const bytes = new Uint8Array(binString.length);
  for (let i = 0; i < binString.length; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  return bytes;
}

export async function signJwtWithKid(payload: any, key: CryptoKey, kid: string): Promise<string> {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
    kid,
  };
  const enc = new TextEncoder();
  const encodedHeader = base64UrlEncode(enc.encode(JSON.stringify(header)));
  const encodedPayload = base64UrlEncode(enc.encode(JSON.stringify(payload)));

  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signatureBuffer = await crypto.subtle.sign({ name: 'HMAC' }, key, enc.encode(signingInput));

  const encodedSignature = base64UrlEncode(new Uint8Array(signatureBuffer));
  return `${signingInput}.${encodedSignature}`;
}

export function decodeJwt(token: string): any {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Token JWT malformatado.');
  }
  const payloadStr = new TextDecoder().decode(base64UrlDecode(parts[1]));
  return JSON.parse(payloadStr);
}

export async function verifyJwtWithKid(token: string, key: CryptoKey): Promise<any> {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Token JWT malformatado.');
  }
  const [headerB64, payloadB64, signatureB64] = parts;

  const enc = new TextEncoder();
  const signingInput = `${headerB64}.${payloadB64}`;
  const signatureBytes = base64UrlDecode(signatureB64);

  const isValid = await crypto.subtle.verify(
    { name: 'HMAC' },
    key,
    signatureBytes,
    enc.encode(signingInput)
  );

  if (!isValid) {
    throw new Error('Assinatura JWT inválida.');
  }

  const payloadStr = new TextDecoder().decode(base64UrlDecode(payloadB64));
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
      const headerStr = new TextDecoder().decode(base64UrlDecode(parts[0]));
      const header = JSON.parse(headerStr);
      if (header && header.kid) {
        kid = header.kid;
      }
    }
  } catch (e) {
    throw new Error('Token JWT malformatado.');
  }

  const jwtKey = await getJwtSigningKeyForKid(kid, c.env);
  const payload = await verifyJwtWithKid(token, jwtKey);

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
  const jwtKey = await getJwtSigningKeyForKid(kid, c.env);

  // 4. Assinar Access Token com claims hardened e kid no header
  const accessToken = await signJwtWithKid(
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
    jwtKey,
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
