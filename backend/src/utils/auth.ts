import { Context } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
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

export async function verifySession(
  c: Context, 
  token: string, 
  sessionRepository: any, 
  userRepository: any
): Promise<any> {
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

  // Validação de claims
  if (!payload.iss || payload.iss !== 'asppibra-dao') throw new Error('Invalid JWT issuer');
  if (!payload.aud || payload.aud !== 'asppibra-app') throw new Error('Invalid JWT audience');
  if (typeof payload.exp !== 'number' || payload.exp < Math.floor(Date.now() / 1000)) throw new Error('JWT expired');
  if (typeof payload.iat !== 'number' || payload.iat > Math.floor(Date.now() / 1000)) throw new Error('Invalid JWT iat');
  if (typeof payload.nbf !== 'number' || payload.nbf > Math.floor(Date.now() / 1000)) throw new Error('JWT not yet active');

  const sessionId = (payload.sid || payload.sessionId) as string;
  if (!sessionId) throw new Error('Missing session ID in JWT');

  // Validação usando o Repository Injetado
  const session = await sessionRepository.getSessionById(sessionId);

  if (!session) throw new Error('Sessão não encontrada.');
  if (session.revoked) throw new Error('Sessão foi revogada.');
  const expiresAtMs = session.expiresAt instanceof Date ? session.expiresAt.getTime() : Number(session.expiresAt);
  if (Date.now() > expiresAtMs) throw new Error('Sessão expirada.');
  
  if (session.aal !== null && session.aal !== undefined) {
    if ((payload.aal as number) > session.aal) {
      throw new Error('MFA/AAL verification mismatch.');
    }
  }

  if (payload.userId) {
    const userResult = await userRepository.findById(Number(payload.userId));
    if (userResult.isFailure) throw new Error('Usuário não encontrado.');
    const user = userResult.getValue();

    if (user.tokenVersion > (payload.tokenVersion as number)) {
      throw new Error('Token revogado globalmente devido a alteração cadastral.');
    }
    if (user.active === false || user.status !== 'active') {
      throw new Error('Usuário inativo ou bloqueado.');
    }
  }

  return payload;
}

export function setSessionCookies(c: Context, accessToken: string, refreshToken: string) {
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
}

export function clearSessionCookies(c: Context) {
  const frontendUrl = c.env.FRONTEND_URL || '';
  const secure =
    frontendUrl.startsWith('https') ||
    (!frontendUrl.includes('localhost') && !frontendUrl.includes('127.0.0.1'));

  deleteCookie(c, 'access_token', { path: '/', secure, sameSite: 'Strict' });
  deleteCookie(c, 'refresh_token', { path: '/', secure, sameSite: 'Strict' });
}
