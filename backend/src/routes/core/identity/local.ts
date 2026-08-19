import { Hono } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
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
import { RequestPasswordResetUseCase } from '../../../domains/identity/usecases/RequestPasswordResetUseCase';
import { IssueSessionUseCase } from '../../../domains/identity/usecases/IssueSessionUseCase';
import { IdentityController } from '../../../domains/identity/controllers/IdentityController';
import { DrizzleUnitOfWork } from '../../../infrastructure/repositories/DrizzleUnitOfWork';
import { DrizzleSessionRepository } from '../../../infrastructure/repositories/DrizzleSessionRepository';
import { DrizzlePasswordResetRepository } from '../../../infrastructure/repositories/DrizzlePasswordResetRepository';
import { ResendNotificationAdapter } from '../../../infrastructure/notifications/ResendNotificationAdapter';
import { JwtService } from '../../../infrastructure/security/jwt/JwtService';
import { DrizzleAccountRepository as AccountRepository } from '../../../infrastructure/repositories/DrizzleAccountRepository';
import { clearSessionCookies, setSessionCookies, getJwtSigningKeyForKid } from '../../../utils/auth';

type AppType = {
  Bindings: Bindings;
  Variables: { db: any };
};

const localAuth = new Hono<AppType>();

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
    await c.env.KV_AUTH.put(key, (count + 1).toString(), { expirationTtl: 600 });
  } catch (e) {
    console.warn('Rate limit KV put failed:', e);
  }
  await next();
};

import { PBKDF2PasswordHasher } from '../../../infrastructure/security/crypto/PBKDF2PasswordHasher';
const hasher = new PBKDF2PasswordHasher();

import { setupIdentityDI as setupIdentity } from '../../../infrastructure/di/identity_container';

localAuth.post('/register', zValidator('json', Register.Schema), async (c) => {
  try {
    const { controller, issueSessionUseCase } = await setupIdentity(c);
    const req = { body: c.req.valid('json'), query: {}, params: {}, headers: {} };
    
    const httpResponse = await controller.register(req);

    if (httpResponse.status === 201 && httpResponse.body.accountData) {
      const { accountData } = httpResponse.body;
      return c.json({
        success: true,
        message: httpResponse.body.message,
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

localAuth.post('/login', loginRateLimiter, zValidator('json', Login.Schema), async (c) => {
  try {
    const { controller, issueSessionUseCase } = await setupIdentity(c);
    const req = { body: c.req.valid('json'), query: {}, params: {}, headers: {} };
    
    const httpResponse = await controller.login(req);

    if (httpResponse.status === 200 && httpResponse.body.accountData) {
      const { accountData } = httpResponse.body;
      
      const sessionResult = await issueSessionUseCase.execute({
        ...accountData,
        tokenVersion: 1, // TODO: Fetch real tokenVersion from Account entity
        ip: c.req.header('cf-connecting-ip') || '127.0.0.1',
        userAgent: c.req.header('user-agent') || ''
      });

      if (sessionResult.isSuccess) {
        const { accessToken, refreshToken } = sessionResult.getValue();
        setSessionCookies(c, accessToken, refreshToken);

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
    }
    
    return c.json(httpResponse.body, httpResponse.status as ContentfulStatusCode);
  } catch (err: any) {
    return c.json(
      { success: false, message: 'Falha Mestra na Validação do Cidadão', details: err.message },
      500
    );
  }
});

localAuth.post('/change-password/:userId', async (c) => {
  try {
    const { controller } = await setupIdentity(c);
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

localAuth.post('/forgot-password', zValidator('json', ForgotPassword.Schema), async (c) => {
  try {
    const { controller } = await setupIdentity(c);
    const body = c.req.valid('json');
    const req = { body, query: {}, params: {}, headers: {} };
    
    const httpResponse = await controller.forgotPassword(req);
    return c.json(httpResponse.body, httpResponse.status as ContentfulStatusCode);
  } catch (err: any) {
    return c.json(
      { success: false, message: 'Ocorreu um erro interno. Tente novamente.' },
      500
    );
  }
});

localAuth.post('/reset-password', zValidator('json', ResetPassword.Schema), async (c) => {
  try {
    const { controller, sessionRepo } = await setupIdentity(c);
    const body = c.req.valid('json');
    const req = { body, query: {}, params: {}, headers: {} };
    
    const httpResponse = await controller.resetPassword(req);
    
    if (httpResponse.status === 200) {
      clearSessionCookies(c);
    }
    
    return c.json(httpResponse.body, httpResponse.status as ContentfulStatusCode);
  } catch (err: any) {
    return c.json(
      { success: false, message: 'Ocorreu um erro interno. Tente novamente.' },
      500
    );
  }
});

const VerifyResendSchema = z.object({ email: z.string().email() });

localAuth.post('/verify/resend', zValidator('json', VerifyResendSchema), async (c) => {
  const { email } = c.req.valid('json');
  const ip = c.req.header('cf-connecting-ip') || 'anonymous';
  const rateLimitKey = `ratelimit:verify_resend:${email}:${ip}`;

  try {
    const lastSent = await c.env.KV_AUTH.get(rateLimitKey);
    if (lastSent) {
      const timePassed = Date.now() - parseInt(lastSent, 10);
      if (timePassed < 60000) {
        return c.json({ success: false, message: 'TooManyRequests' }, 429);
      }
    }
    await c.env.KV_AUTH.put(rateLimitKey, Date.now().toString(), { expirationTtl: 60 });

    const notificationAdapter = new ResendNotificationAdapter(c.env);
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); 
    
    // Antienumeração não faz lookup no DB aqui; 
    // Em um cenário real, VerifyEmailRequestUseCase validaria. Para resend genérico:
    try {
      await notificationAdapter.sendVerificationCode(email, verifyCode);
    } catch(e) {
      // Falha silenciosa para antienumeração
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

