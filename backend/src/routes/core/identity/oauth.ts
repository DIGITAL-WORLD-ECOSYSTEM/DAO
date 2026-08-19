import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { eq } from 'drizzle-orm';
import { users, citizens } from '../../../db/schema';
import { Bindings } from '../../../types/bindings';

type AppType = {
  Bindings: Bindings;
  Variables: { db: any };
};

const oauth = new Hono<AppType>();

// ==========================================
// HELPER: URL base do frontend
// ==========================================

function getFrontendUrl(c: any): string {
  return c.env.FRONTEND_URL || 'https://www.asppibra.com';
}

// ==========================================
// 1. GOOGLE OAUTH2 FLOW
// ==========================================

oauth.get('/google/login', (c) => {
  const clientId = c.env.GOOGLE_CLIENT_ID;
  const redirectUri = `${new URL(c.req.url).origin}/api/core/identity/oauth/google/callback`;
  const scope = encodeURIComponent('email profile');

  const referer = c.req.header('Referer');
  let origin = c.env.FRONTEND_URL || 'https://www.asppibra.com';
  if (referer) {
    try {
      origin = new URL(referer).origin;
    } catch {}
  }

  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth` +
    `?client_id=${clientId}` +
    `&redirect_uri=${redirectUri}` +
    `&response_type=code` +
    `&scope=${scope}` +
    `&access_type=offline` +
    `&prompt=consent` +
    `&state=${encodeURIComponent(origin)}`;

  return c.redirect(authUrl);
});

oauth.get('/google/callback', async (c) => {
  const code = c.req.query('code');
  const state = c.req.query('state');
  const frontendUrl = state ? decodeURIComponent(state) : getFrontendUrl(c);
  const callbackUrl = `${frontendUrl}/auth/oauth/callback`;

  if (!code) return c.redirect(`${callbackUrl}?error=no_code`);

  const redirectUri = `${new URL(c.req.url).origin}/api/core/identity/oauth/google/callback`;

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: c.env.GOOGLE_CLIENT_ID,
        client_secret: c.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    const tokenData: any = await tokenRes.json();
    if (tokenData.error) throw new Error(tokenData.error_description || tokenData.error);

    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData: any = await userRes.json();

    const providerSubjectId = String(userData.id || userData.sub);

    const token = await handleSocialLogin(c, {
      provider: 'google',
      providerSubjectId,
      email: userData.email,
      firstName: userData.given_name || 'Google',
      lastName: userData.family_name || 'User',
      avatarUrl: userData.picture,
    });

    return c.redirect(`${callbackUrl}?token=${encodeURIComponent(token)}`);
  } catch (error: any) {
    console.error('Google OAuth Error:', error.message);
    const errCode = error.message.includes('IDENTITY_NOT_LINKED') ? 'IDENTITY_NOT_LINKED' : error.message;
    return c.redirect(`${callbackUrl}?error=${encodeURIComponent(errCode)}`);
  }
});

// ==========================================
// 2. GITHUB OAUTH2 FLOW
// ==========================================

oauth.get('/github/login', (c) => {
  const clientId = c.env.GITHUB_CLIENT_ID;
  const redirectUri = `${new URL(c.req.url).origin}/api/core/identity/oauth/github/callback`;
  const scope = 'user:email';

  const referer = c.req.header('Referer');
  let origin = c.env.FRONTEND_URL || 'https://www.asppibra.com';
  if (referer) {
    try {
      origin = new URL(referer).origin;
    } catch {}
  }

  const authUrl =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${clientId}` +
    `&redirect_uri=${redirectUri}` +
    `&scope=${scope}` +
    `&state=${encodeURIComponent(origin)}`;

  return c.redirect(authUrl);
});

oauth.get('/github/callback', async (c) => {
  const code = c.req.query('code');
  const state = c.req.query('state');
  const frontendUrl = state ? decodeURIComponent(state) : getFrontendUrl(c);
  const callbackUrl = `${frontendUrl}/auth/oauth/callback`;

  if (!code) return c.redirect(`${callbackUrl}?error=no_code`);

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: c.env.GITHUB_CLIENT_ID,
        client_secret: c.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData: any = await tokenRes.json();
    if (tokenData.error) throw new Error(tokenData.error_description || tokenData.error);

    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        'User-Agent': 'Cloudflare-Worker',
      },
    });
    const userData: any = await userRes.json();

    // O e-mail pode ser privado — buscar nos e-mails verificados
    let email = userData.email;
    if (!email) {
      const emailRes = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          'User-Agent': 'Cloudflare-Worker',
        },
      });
      const emailsData: any = await emailRes.json();
      const primaryEmail = emailsData.find((e: any) => e.primary && e.verified);
      email = primaryEmail?.email;
    }

    if (!email) throw new Error('Não foi possível acessar o e-mail público do Github.');

    const nameParts = (userData.name || 'GitHub User').split(' ');
    const providerSubjectId = String(userData.id);

    const token = await handleSocialLogin(c, {
      provider: 'github',
      providerSubjectId,
      email: email.toLowerCase(),
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(' ') || 'User',
      avatarUrl: userData.avatar_url,
    });

    return c.redirect(`${callbackUrl}?token=${encodeURIComponent(token)}`);
  } catch (error: any) {
    console.error('GitHub OAuth Error:', error.message);
    const errCode = error.message.includes('IDENTITY_NOT_LINKED') ? 'IDENTITY_NOT_LINKED' : error.message;
    return c.redirect(`${callbackUrl}?error=${encodeURIComponent(errCode)}`);
  }
});

// ==========================================
// ENGINE: Social Login — Retorna JWT (string)
// ==========================================
async function handleSocialLogin(
  c: any,
  profile: {
    provider: 'google' | 'github';
    providerSubjectId: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
  }
): Promise<string> {
  const db = c.get('db');

  // Bloquear desenvolvedor do login do Google
  if (profile.email.toLowerCase() === 'felipe.dev@empresa.com.br' && profile.provider === 'google') {
    throw new Error(
      'Acesso restrito para esta conta. Desenvolvedores devem autenticar-se obrigatoriamente via GitHub + SSH.'
    );
  }

  // Instanciar repositórios e resolver de identidade canônica
  const { ExternalIdentityRepository } = await import('../../../infrastructure/repositories/ExternalIdentityRepository');
  const { WalletIdentityRepository } = await import('../../../infrastructure/repositories/WalletIdentityRepository');
  const { PasskeyIdentityRepository } = await import('../../../infrastructure/repositories/PasskeyIdentityRepository');
  const { DidIdentityRepository } = await import('../../../infrastructure/repositories/DidIdentityRepository');
  const { CanonicalIdentityResolver } = await import('../../../infrastructure/identity/CanonicalIdentityResolver');

  const externalRepo = new ExternalIdentityRepository(db);
  const walletRepo = new WalletIdentityRepository(db);
  const passkeyRepo = new PasskeyIdentityRepository(db);
  const didRepo = new DidIdentityRepository(db);

  const resolver = new CanonicalIdentityResolver(externalRepo, walletRepo, passkeyRepo, didRepo);

  // 1. Resolver a identidade vinculada
  const resolution = await resolver.resolve({
    type: 'oauth',
    provider: profile.provider,
    subjectId: profile.providerSubjectId,
    emailSnapshot: profile.email,
    verifiedAt: new Date(),
  });

  // AF-003: Rejeitar identidades não vinculadas sem criar usuário
  if (resolution.status === 'not_linked') {
    throw new Error('IDENTITY_NOT_LINKED');
  }

  const userId = resolution.userId;

  const [existingUser] = await db
    .select({
      id: users.id,
      email: users.email,
      legalFirstName: citizens.legalFirstName,
      legalLastName: citizens.legalLastName,
    })
    .from(users)
    .leftJoin(citizens, eq(users.id, citizens.userId))
    .where(eq(users.id, userId))
    .limit(1);

  if (!existingUser) {
    throw new Error('IDENTITY_NOT_LINKED');
  }

  const firstName = existingUser.legalFirstName || profile.firstName;
  const lastName = existingUser.legalLastName || profile.lastName;
  const username = existingUser.email ? existingUser.email.split('@')[0] : `user_${userId}`;

  const { setupIdentityDI: setupIdentity } = await import('../../../infrastructure/di/identity_container');
  const { issueSessionUseCase } = await setupIdentity(c);

  const userRole =
    profile.email.toLowerCase() === 'felipe.dev@empresa.com.br'
      ? 'dev'
      : 'user';

  const aal = 1;

  const sessionResult = await issueSessionUseCase.execute({
    userId,
    email: existingUser.email || profile.email,
    role: userRole,
    aal,
    firstName,
    lastName,
    username,
    tokenVersion: 1,
    ip: c.req.header('cf-connecting-ip') || '127.0.0.1',
    userAgent: c.req.header('user-agent') || '',
  });

  if (sessionResult.isFailure) {
    throw new Error(sessionResult.error || 'Falha ao emitir sessão OAUTH');
  }

  const { accessToken, refreshToken } = sessionResult.getValue();
  const { setSessionCookies } = await import('../../../utils/auth');
  setSessionCookies(c, accessToken, refreshToken);

  return accessToken;
}

export default oauth;

