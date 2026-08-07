import { Hono } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { zValidator } from '@hono/zod-validator';
import { eq, and, gt } from 'drizzle-orm';
import { z } from 'zod';
import { users, citizens, passwordResets, userSessions } from '../../../db/schema';
import {
  Register,
  Login,
  ForgotPassword,
  ResetPassword,
} from '@asppibra/contracts/http';
import { Bindings } from '../../../types/bindings';
import { AuthenticateAccountUseCase } from '../../../domains/identity/usecases/AuthenticateAccountUseCase';
import { RegisterAccountUseCase } from '../../../domains/identity/usecases/RegisterAccountUseCase';
import { ChangePasswordUseCase } from '../../../domains/identity/usecases/ChangePasswordUseCase';
import { ResetPasswordUseCase } from '../../../domains/identity/usecases/ResetPasswordUseCase';
import { IdentityController } from '../../../domains/identity/controllers/IdentityController';
import { DrizzleUnitOfWork } from '../../../infrastructure/repositories/DrizzleUnitOfWork';
import { IdentityNotificationService } from '../../../services/identity/IdentityNotificationService';
import { clearSessionCookies } from '../../../utils/auth';

type AppType = {
  Bindings: Bindings;
  Variables: { db: any };
};

const localAuth = new Hono<AppType>();

// Middleware de rate limit para Login tradicional (Fase 1/Rate Limiting)
const loginRateLimiter = async (c: any, next: any) => {
  const ip = c.req.header('cf-connecting-ip') || 'anonymous';
  const key = `ratelimit:login:${ip}`;
  const limit = 5;

  const current = await c.env.KV_AUTH.get(key);
  const count = current ? parseInt(current) : 0;

  if (count >= limit) {
    return c.json(
      {
        success: false,
        message: 'Número de tentativas de login excedido. Tente novamente em 10 minutos.',
      },
      429
    );
  }

  try {
    await c.env.KV_AUTH.put(key, (count + 1).toString(), { expirationTtl: 600 }); // 10 minutos
  } catch (e) {
    console.warn('Rate limit KV put failed:', e);
  }
  await next();
};

import { PBKDF2PasswordHasher } from '../../../infrastructure/security/crypto/PBKDF2PasswordHasher';
const hasher = new PBKDF2PasswordHasher();
// 📝 ROTA 1: CADASTRO TRADICIONAL
// ==========================================

localAuth.post('/register', zValidator('json', Register.Schema), async (c) => {
  try {
    const db = c.get('db');
    
    // Clean Architecture Instantiation
    const uow = new DrizzleUnitOfWork(db);
    const authUseCase = new AuthenticateAccountUseCase(uow, hasher);
    const registerUseCase = new RegisterAccountUseCase(uow, hasher);
    const changePwdUseCase = new ChangePasswordUseCase(uow, hasher);
    const resetPwdUseCase = new ResetPasswordUseCase(uow, hasher);
    const controller = new IdentityController(authUseCase, registerUseCase, changePwdUseCase, resetPwdUseCase);
    
    const req = { body: c.req.valid('json'), query: {}, params: {}, headers: {} };
    const httpResponse = await controller.register(req);

    if (httpResponse.status === 201 && httpResponse.body.accountData) {
      const { issueSession } = await import('../../../utils/auth');
      const { accountData } = httpResponse.body;
      const { accessToken } = await issueSession(c, accountData);

      return c.json({
        success: true,
        message: httpResponse.body.message,
        accessToken,
        user: { 
          id: accountData.userId, 
          email: accountData.email,
          firstName: accountData.firstName,
          lastName: accountData.lastName,
          role: accountData.role 
        },
      }, 201);
    }
    
    return c.json(httpResponse.body, httpResponse.status as ContentfulStatusCode);
  } catch (err: any) {
    return c.json(
      { success: false, message: 'Falha durante registro local', details: err.message },
      500
    );
  }
});

// ==========================================
// 🔓 ROTA 2: LOGIN TRADICIONAL
// ==========================================

localAuth.post('/login', loginRateLimiter, zValidator('json', Login.Schema), async (c) => {
  try {
    const db = c.get('db');
    
    // Clean Architecture Instantiation (Strangler Bridge)
    const uow = new DrizzleUnitOfWork(db);
    const authUseCase = new AuthenticateAccountUseCase(uow, hasher);
    const registerUseCase = new RegisterAccountUseCase(uow, hasher);
    const changePwdUseCase = new ChangePasswordUseCase(uow, hasher);
    const resetPwdUseCase = new ResetPasswordUseCase(uow, hasher);
    const controller = new IdentityController(authUseCase, registerUseCase, changePwdUseCase, resetPwdUseCase);
    
    const req = { body: c.req.valid('json'), query: {}, params: {}, headers: {} };
    const httpResponse = await controller.login(req);

    if (httpResponse.status === 200 && httpResponse.body.accountData) {
      const { issueSession } = await import('../../../utils/auth');
      const { accountData } = httpResponse.body;
      const { accessToken } = await issueSession(c, accountData);

      return c.json({
        success: true,
        message: httpResponse.body.message,
        accessToken,
        user: { 
          id: accountData.userId, 
          email: accountData.email, 
          role: accountData.role 
        },
      }, 200);
    }
    
    return c.json(httpResponse.body, httpResponse.status as ContentfulStatusCode);
  } catch (err: any) {
    return c.json(
      { success: false, message: 'Falha Mestra na Validação do Cidadão', details: err.message },
      500
    );
  }
});

// ==========================================
// 🔄 ROTA 2.5: CHANGE PASSWORD
// ==========================================
// TODO(Dev): Substituir req.params.userId por uma extração do JWT logado.
localAuth.post('/change-password/:userId', async (c) => {
  try {
    const db = c.get('db');
    const uow = new DrizzleUnitOfWork(db);
    const authUseCase = new AuthenticateAccountUseCase(uow, hasher);
    const registerUseCase = new RegisterAccountUseCase(uow, hasher);
    const changePwdUseCase = new ChangePasswordUseCase(uow, hasher);
    const resetPwdUseCase = new ResetPasswordUseCase(uow, hasher);
    const controller = new IdentityController(authUseCase, registerUseCase, changePwdUseCase, resetPwdUseCase);

    const body = await c.req.json();
    const req = { 
      body, 
      query: {}, 
      params: { userId: c.req.param('userId') }, 
      headers: {} 
    };
    
    const httpResponse = await controller.changePassword(req);
    
    return c.json(httpResponse.body, httpResponse.status as ContentfulStatusCode);
  } catch (err: any) {
    return c.json({ success: false, message: 'Erro interno', details: err.message }, 500);
  }
});

// ==========================================
// 📧 ROTA 3: ESQUECEU A SENHA (FORGOT)
// ==========================================

localAuth.post('/forgot-password', zValidator('json', ForgotPassword.Schema), async (c) => {
  const { email } = c.req.valid('json');
  const db = c.get('db');

  try {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    // Se o usuário existir e tiver conta manual (não-OAuth Exclusivo).
    if (user && user.password && user.password.includes(':')) {
      const resetToken = crypto.randomUUID(); // Token Único Seguro

      // Insere o Token na Tabela para Expiração em 1 Hora
      await db.insert(passwordResets).values({
        userId: user.id,
        token: resetToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        used: false,
      });

      const notificationService = new IdentityNotificationService(c.env);
      await notificationService.sendPasswordRecovery(user.email, resetToken);
    }

    // Retorna Sucesso Mudo/Silencioso (Anti-Enumeração)
    // Protege contra hackers querendo descobrir quais emails existem no sistema
    return c.json({
      success: true,
      message: 'Se o e-mail existir, um link de recuperação será enviado em breve.',
    });
  } catch (err: any) {
    // Nunca retornar details: err.message em produção para evitar leaks (R5)
    return c.json(
      { success: false, message: 'Ocorreu um erro interno. Tente novamente.' },
      500
    );
  }
});

// ==========================================
// 🛡️ ROTA 4: RESET DE SENHA (Ação via Token)
// ==========================================

localAuth.post('/reset-password', zValidator('json', ResetPassword.Schema), async (c) => {
  try {
    const db = c.get('db');
    const uow = new DrizzleUnitOfWork(db);
    const authUseCase = new AuthenticateAccountUseCase(uow, hasher);
    const registerUseCase = new RegisterAccountUseCase(uow, hasher);
    const changePwdUseCase = new ChangePasswordUseCase(uow, hasher);
    const resetPwdUseCase = new ResetPasswordUseCase(uow, hasher);
    const controller = new IdentityController(authUseCase, registerUseCase, changePwdUseCase, resetPwdUseCase);

    const body = c.req.valid('json');
    const req = { body, query: {}, params: {}, headers: {} };
    
    const httpResponse = await controller.resetPassword(req);
    
    // Revogar todas as sessões se o reset foi bem-sucedido (R8)
    if (httpResponse.status === 200) {
      const [reset] = await db.select().from(passwordResets).where(eq(passwordResets.token, body.token)).limit(1);
      if (reset) {
        await db.update(userSessions)
          .set({ revoked: true })
          .where(eq(userSessions.userId, reset.userId));
        clearSessionCookies(c);
      }
    }
    
    return c.json(httpResponse.body, httpResponse.status as ContentfulStatusCode);
  } catch (err: any) {
    return c.json(
      { success: false, message: 'Ocorreu um erro interno. Tente novamente.' },
      500
    );
  }
});

// ==========================================
// 🛡️ ROTA 5: REENVIO DE CÓDIGO (Verify Resend)
// ==========================================

const VerifyResendSchema = z.object({
  email: z.string().email(),
});

localAuth.post('/verify/resend', zValidator('json', VerifyResendSchema), async (c) => {
  const { email } = c.req.valid('json');
  const db = c.get('db');
  const ip = c.req.header('cf-connecting-ip') || 'anonymous';
  const rateLimitKey = `ratelimit:verify_resend:${email}:${ip}`;

  try {
    const lastSent = await c.env.KV_AUTH.get(rateLimitKey);
    if (lastSent) {
      const timePassed = Date.now() - parseInt(lastSent, 10);
      const backoffLevels = [60000, 120000, 300000]; // 60s, 120s, 300s
      // Basic anti-spam: require at least 60s between sends
      if (timePassed < 60000) {
        return c.json({ success: false, message: 'TooManyRequests' }, 429);
      }
    }

    // Set rate limit cooldown in KV
    await c.env.KV_AUTH.put(rateLimitKey, Date.now().toString(), { expirationTtl: 60 });

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    // Anti-enumeração: sempre dizer que foi enviado
    if (user && user.status !== 'verified') {
      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits

      // TODO: Save code to DB to verify later
      
      const notificationService = new IdentityNotificationService(c.env);
      await notificationService.sendVerificationCode(user.email, verifyCode);
    }

    return c.json({
      success: true,
      message: 'Código reenviado com sucesso. Verifique seu e-mail.',
    });
  } catch (err: any) {
    return c.json(
      { success: false, message: 'Ocorreu um erro interno. Tente novamente.' },
      500
    );
  }
});

export default localAuth;
