import { Hono } from 'hono';
import { verify } from 'hono/jwt';
import { eq, sql } from 'drizzle-orm';
import { citizens, membershipCards, users, auditLogs, bounties } from '../../db/schema';
import { Bindings } from '../../types/bindings';

/**
 * Platform Identity & Membership Routes
 */

type AppType = { 
  Bindings: Bindings; 
  Variables: { db: any } 
};

const identity = new Hono<AppType>();

import { getJwtToken, verifySession } from '../../utils/auth';

// --- MIDDLEWARE: AUTH CHECK ---
// Note: Can be extracted to a common middleware, but kept here for isolation
const verifyAuth = async (c: any, next: any) => {
  const token = getJwtToken(c);
  if (!token) {
    return c.json({ success: false, message: 'Não autorizado' }, 401);
  }
  try {
    const payload = await verifySession(c, token);
    c.set('jwtPayload', payload);
    await next();
  } catch (e) {
    return c.json({ success: false, message: 'Sessão expirada' }, 401);
  }
};

// 1. GET /profile/:username - Busca perfil detalhado (Público/Cidadão)
identity.get('/profile/:username', async (c) => {
  const username = c.req.param('username');
  const db = c.get('db');

  try {
    // Busca cidadão e o usuário vinculado
    const [result] = await db
      .select()
      .from(citizens)
      .innerJoin(users, eq(citizens.userId, users.id))
      .where(eq(citizens.username, username))
      .limit(1);

    if (!result) {
      return c.json({ success: false, message: 'Perfil não encontrado' }, 404);
    }
    
    // Sanitização de dados sensíveis
    const { password, ...userSafe } = result.users;
    
    return c.json({
      success: true,
      data: {
        ...result.citizens,
        user: userSafe
      }
    });
  } catch (e: any) {
    return c.json({ success: false, message: 'Erro ao buscar perfil', error: e.message }, 500);
  }
});

// 2. GET /me/card - Retorna a carterinha do usuário logado
identity.get('/me/card', verifyAuth, async (c) => {
  const payload = c.get('jwtPayload') as { username: string };
  const db = c.get('db');

  try {
    // 1. Achar o cidadão pelo username do JWT
    const [citizen] = await db
      .select()
      .from(citizens)
      .where(eq(citizens.username, payload.username))
      .limit(1);

    if (!citizen) {
      return c.json({ success: false, message: 'Cidadão não vinculado à conta' }, 404);
    }

    // 2. Buscar carterinha ativa
    const [card] = await db
      .select()
      .from(membershipCards)
      .where(eq(membershipCards.citizenId, citizen.id))
      .orderBy(sql`created_at DESC`)
      .limit(1);

    if (!card) {
      return c.json({ success: false, message: 'Carterinha não emitida para este perfil' }, 404);
    }

    return c.json({
      success: true,
      data: {
        citizen,
        card
      }
    });
  } catch (e: any) {
    return c.json({ success: false, message: 'Erro ao recuperar carterinha', error: e.message }, 500);
  }
});

// 3. GET /list - Lista simplificada para diretório
identity.get('/list', async (c) => {
  const db = c.get('db');
  try {
    const list = await db
      .select({
        id: citizens.id,
        username: citizens.username,
        firstName: citizens.firstName,
        lastName: citizens.lastName,
        cargoOsc: citizens.cargoOsc,
        did: citizens.did,
        avatarUrl: users.avatarUrl,
        kycStatus: users.kycStatus,
        role: users.role,
        phoneNumber: citizens.phoneNumber,
        email: users.email,
      })
      .from(citizens)
      .innerJoin(users, eq(citizens.userId, users.id))
      .limit(100);
    
    return c.json({ success: true, data: list });
  } catch (e: any) {
    return c.json({ success: false, error: e.message }, 500);
  }
});

// 4. POST / - Criar novo usuário/cidadão via Admin
identity.post('/', verifyAuth, async (c) => {
  const db = c.get('db');
  const body = await c.req.json();

  try {
    // 1. Criar usuário (Auth)
    const [newUser] = await db.insert(users).values({
      email: body.email,
      password: body.password || '$argon2id$v=19$m=65536,t=3,p=4$default_hash', // Senha padrão ou hash
      role: body.role || 'citizen',
      kycStatus: body.kycStatus || 'pending',
      avatarUrl: body.avatarUrl,
    }).returning();

    // 2. Criar cidadão vinculado
    const [newCitizen] = await db.insert(citizens).values({
      userId: newUser.id,
      username: body.username || body.email.split('@')[0],
      firstName: body.firstName,
      lastName: body.lastName,
      cargoOsc: body.cargoOsc,
      phoneNumber: body.phoneNumber,
      nacionalidade: body.nacionalidade,
      did: body.did || `did:dao:asppibra:${newUser.id}`,
    }).returning();

    return c.json({ success: true, data: { citizen: newCitizen, user: newUser } }, 201);
  } catch (e: any) {
    return c.json({ success: false, message: 'Erro ao criar usuário', error: e.message }, 400);
  }
});

// 5. PATCH /:id - Atualizar perfil (Admin)
identity.patch('/:id', verifyAuth, async (c) => {
  const id = parseInt(c.req.param('id'));
  const db = c.get('db');
  const body = await c.req.json();

  try {
    // 1. Buscar cidadão para pegar o userId
    const [citizen] = await db.select().from(citizens).where(eq(citizens.id, id)).limit(1);
    if (!citizen) return c.json({ success: false, message: 'Cidadão não encontrado' }, 404);

    // 2. Atualizar tabela citizens
    await db.update(citizens).set({
      firstName: body.firstName,
      lastName: body.lastName,
      cargoOsc: body.cargoOsc,
      phoneNumber: body.phoneNumber,
      nacionalidade: body.nacionalidade,
    }).where(eq(citizens.id, id));

    // 3. Atualizar tabela users
    await db.update(users).set({
      role: body.role,
      kycStatus: body.kycStatus,
      avatarUrl: body.avatarUrl,
    }).where(eq(users.id, citizen.userId));

    return c.json({ success: true, message: 'Perfil atualizado com sucesso' });
  } catch (e: any) {
    return c.json({ success: false, message: 'Erro ao atualizar perfil', error: e.message }, 400);
  }
});

// 6. DELETE /:id - Remover usuário e cidadão
identity.delete('/:id', verifyAuth, async (c) => {
  const id = parseInt(c.req.param('id'));
  const db = c.get('db');

  try {
    const [citizen] = await db.select().from(citizens).where(eq(citizens.id, id)).limit(1);
    if (!citizen) return c.json({ success: false, message: 'Cidadão não encontrado' }, 404);

    // Remover referências de chaves estrangeiras que impediriam o delete físico (sem cascade nativo no SQLite)
    await db.update(auditLogs).set({ citizenId: null }).where(eq(auditLogs.citizenId, id));

    if (citizen.userId) {
      await db.update(auditLogs).set({ actorId: null }).where(eq(auditLogs.actorId, citizen.userId));
      await db.update(bounties).set({ creatorId: null }).where(eq(bounties.creatorId, citizen.userId));
      await db.update(bounties).set({ assigneeId: null }).where(eq(bounties.assigneeId, citizen.userId));

      await db.delete(users).where(eq(users.id, citizen.userId));
    }
    await db.delete(citizens).where(eq(citizens.id, id));

    return c.json({ success: true, message: 'Usuário removido com sucesso' });
  } catch (e: any) {
    return c.json({ success: false, message: 'Erro ao remover usuário', error: e.message }, 400);
  }
});

// 7. POST /bulk-delete - Remover múltiplos
identity.post('/bulk-delete', verifyAuth, async (c) => {
  const db = c.get('db');
  const { ids } = await c.req.json();

  try {
    for (const id of ids) {
       const [citizen] = await db.select().from(citizens).where(eq(citizens.id, id)).limit(1);
       if (citizen) {
         await db.update(auditLogs).set({ citizenId: null }).where(eq(auditLogs.citizenId, id));

         if (citizen.userId) {
           await db.update(auditLogs).set({ actorId: null }).where(eq(auditLogs.actorId, citizen.userId));
           await db.update(bounties).set({ creatorId: null }).where(eq(bounties.creatorId, citizen.userId));
           await db.update(bounties).set({ assigneeId: null }).where(eq(bounties.assigneeId, citizen.userId));
           await db.delete(users).where(eq(users.id, citizen.userId));
         }
         await db.delete(citizens).where(eq(citizens.id, id));
       }
    }
    return c.json({ success: true, message: `${ids.length} usuários removidos` });
  } catch (e: any) {
    return c.json({ success: false, message: 'Erro na exclusão em massa', error: e.message }, 400);
  }
});

export default identity;
