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

    const token = await handleSocialLogin(c, {
      email: userData.email,
      firstName: userData.given_name || 'Google',
      lastName: userData.family_name || 'User',
      avatarUrl: userData.picture,
    });

    return c.redirect(`${callbackUrl}?token=${encodeURIComponent(token)}`);
  } catch (error: any) {
    console.error('Google OAuth Error:', error.message);
    return c.redirect(`${callbackUrl}?error=${encodeURIComponent(error.message)}`);
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

    const token = await handleSocialLogin(c, {
      email: email.toLowerCase(),
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(' ') || 'User',
      avatarUrl: userData.avatar_url,
    });

    return c.redirect(`${callbackUrl}?token=${encodeURIComponent(token)}`);
  } catch (error: any) {
    console.error('GitHub OAuth Error:', error.message);
    return c.redirect(`${callbackUrl}?error=${encodeURIComponent(error.message)}`);
  }
});

// ==========================================
// ENGINE: Social Login — Retorna JWT (string)
// ==========================================
async function handleSocialLogin(
  c: any,
  profile: { email: string; firstName: string; lastName: string; avatarUrl: string }
): Promise<string> {
  const db = c.get('db');

  // Bloquear desenvolvedor do login do Google
  const isGoogle = c.req.path.includes('/google');
  if (profile.email.toLowerCase() === 'felipe.dev@empresa.com.br' && isGoogle) {
    throw new Error(
      'Acesso restrito para esta conta. Desenvolvedores devem autenticar-se obrigatoriamente via GitHub + SSH.'
    );
  }

  const [existingUser] = await db
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
      avatarUrl: users.avatarUrl,
      firstName: citizens.firstName,
      lastName: citizens.lastName,
      username: citizens.username,
    })
    .from(users)
    .leftJoin(citizens, eq(users.id, citizens.userId))
    .where(eq(users.email, profile.email))
    .limit(1);

  let userId: number;
  let role = 'citizen';
  let firstName = profile.firstName;
  let lastName = profile.lastName;
  let username = '';

  if (existingUser) {
    userId = existingUser.id;
    role = existingUser.role || 'citizen';
    firstName = existingUser.firstName || profile.firstName;
    lastName = existingUser.lastName || profile.lastName;
    username = existingUser.username || '';
    if (!existingUser.avatarUrl && profile.avatarUrl) {
      await db.update(users).set({ avatarUrl: profile.avatarUrl }).where(eq(users.id, userId));
    }
  } else {
    // 1. Criar Usuário (Auth)
    const [newUser] = await db
      .insert(users)
      .values({
        email: profile.email,
        avatarUrl: profile.avatarUrl,
        emailVerified: true,
        role: 'citizen',
        password: crypto.randomUUID(), // Inacessível
      })
      .returning();

    userId = newUser.id;

    // 2. Criar Cidadão (Identidade)
    const calculatedUsername =
      profile.email.split('@')[0] + '_' + Math.random().toString(36).substring(2, 5);
    username = calculatedUsername.toLowerCase();
    await db.insert(citizens).values({
      userId,
      username,
      firstName: profile.firstName,
      lastName: profile.lastName,
      did: `did:dao:asppibra:social:${userId}`, // DID Social Provisório
      publicKey: '',
      status: 'active',
    });
  }

  const { setupIdentityDI: setupIdentity } = await import('../../../infrastructure/di/identity_container');
  const { issueSessionUseCase } = await setupIdentity(c);
  
  const userRole =
    profile.email.toLowerCase() === 'felipe.dev@empresa.com.br'
      ? 'dev'
      : role === 'citizen'
        ? 'user'
        : role || 'user';
  // Devs must start at AAL1, then authenticate SSH signature to escalate to AAL3
  const aal = 1;

  const sessionResult = await issueSessionUseCase.execute({
    userId,
    email: profile.email,
    role: userRole,
    aal,
    firstName,
    lastName,
    username,
    tokenVersion: 1,
    ip: c.req.header('cf-connecting-ip') || '127.0.0.1',
    userAgent: c.req.header('user-agent') || ''
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
