import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import { verifyRole } from '../../../middleware/rbac';
import {
  reProperties,
  rePropertyLocation,
  rePropertyLand,
  rePropertyPricing,
  citizens,
} from '../../../db/schema';
import {
  propertyCreateSchema,
  locationSchema,
  landSchema,
  pricingSchema,
} from '../../../validators/real-estate';
import { Bindings, Variables } from '../../../types/bindings';
import { Database } from '../../../db';
import { HTTPException } from 'hono/http-exception';

type AppType = {
  Bindings: Bindings;
  Variables: Variables;
};

const app = new Hono<AppType>();

// --- GET ALL PROPERTIES (Public) ---
app.get('/', async (c) => {
  const db = c.get('db');
  try {
    const properties = await db.select().from(reProperties);
    return c.json({ success: true, count: properties.length, data: properties });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// --- GET PROPERTY BY SLUG (Public) ---
app.get('/:slug', async (c) => {
  const db = c.get('db');
  const slug = c.req.param('slug');

  try {
    const property = await db.query.reProperties.findFirst({
      where: eq(reProperties.slug, slug),
    });

    if (!property) {
      return c.json({ success: false, message: 'Imóvel não encontrado' }, 404);
    }

    // In a real scenario, you'd fetch joining location, media, pricing, etc.
    const location = await db.query.rePropertyLocation.findFirst({
      where: eq(rePropertyLocation.propertyId, property.id),
    });

    return c.json({ success: true, data: { ...property, location } });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

// ==========================================
// JWT & RBAC PROTECTED ROUTES
// ==========================================
app.use('/*', verifyRole(['admin', 'partner', 'citizen']));

// --- CREATE NEW PROPERTY DRAFT ---
app.post('/', zValidator('json', propertyCreateSchema), async (c) => {
  const db = c.get('db');
  const data = c.req.valid('json');

  const payload = c.get('jwtPayload') as any;
  const userId = payload?.userId;

  if (!userId) {
    return c.json({ success: false, message: 'Conta não identificada na sessão' }, 401);
  }

  try {
    const slug =
      data.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '') +
      '-' +
      Date.now().toString().slice(-4);
    const uuid = crypto.randomUUID();

    const [property] = await db
      .insert(reProperties)
      .values({
        title: data.title,
        slug,
        uuid,
        propertyType: data.propertyType,
        registrationNumberRgi: data.registrationNumberRgi,
        iptuNumber: data.iptuNumber,
        notes: data.notes,
        userId,
      })
      .returning();

    return c.json({ success: true, message: 'Imóvel criado com sucesso', data: property }, 201);
  } catch (error: any) {
    return c.json({ success: false, message: 'Erro ao criar imóvel', error: error.message }, 500);
  }
});

// --- ADD/UPDATE LOCATION ---
app.post('/:id/location', zValidator('json', locationSchema), async (c) => {
  const db = c.get('db');
  const propertyId = parseInt(c.req.param('id'), 10);
  const data = c.req.valid('json');

  try {
    const user = c.get('user');
    const citizen = await db.query.citizens.findFirst({
      where: eq(citizens.userId, user.userId),
    });

    if (!citizen) {
      throw new HTTPException(403, { message: 'Cidadão não encontrado para este usuário' });
    }

    const property = await db.query.reProperties.findFirst({
      where: eq(reProperties.id, propertyId),
    });

    if (!property) {
      throw new HTTPException(404, { message: 'Imóvel não encontrado' });
    }

    if (property.userId !== citizen.userId) {
      throw new HTTPException(403, { message: 'Você não tem permissão para alterar este imóvel' });
    }

    // Apaga anterior se houver (relacionamento 1:1) e insere novo
    await db.delete(rePropertyLocation).where(eq(rePropertyLocation.propertyId, propertyId));

    const [location] = await db
      .insert(rePropertyLocation)
      .values({
        propertyId,
        ...data,
      })
      .returning();

    return c.json({ success: true, data: location });
  } catch (error: any) {
    if (error instanceof HTTPException) throw error;
    return c.json({ success: false, message: error.message }, 500);
  }
});

// --- ADD PRICING ---
app.post('/:id/pricing', zValidator('json', pricingSchema), async (c) => {
  const db = c.get('db');
  const propertyId = parseInt(c.req.param('id'), 10);
  const data = c.req.valid('json');

  try {
    const user = c.get('user');
    const citizen = await db.query.citizens.findFirst({
      where: eq(citizens.userId, user.userId),
    });

    if (!citizen) {
      throw new HTTPException(403, { message: 'Cidadão não encontrado para este usuário' });
    }

    const property = await db.query.reProperties.findFirst({
      where: eq(reProperties.id, propertyId),
    });

    if (!property) {
      throw new HTTPException(404, { message: 'Imóvel não encontrado' });
    }

    if (property.userId !== citizen.userId) {
      throw new HTTPException(403, { message: 'Você não tem permissão para alterar este imóvel' });
    }

    const [pricing] = await db
      .insert(rePropertyPricing)
      .values({
        propertyId,
        ...data,
      })
      .returning();

    return c.json({ success: true, data: pricing });
  } catch (error: any) {
    if (error instanceof HTTPException) throw error;
    return c.json({ success: false, message: error.message }, 500);
  }
});

export default app;
