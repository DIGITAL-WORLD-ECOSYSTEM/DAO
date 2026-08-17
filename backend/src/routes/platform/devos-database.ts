import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { Bindings, Variables } from '../../types/bindings';
import { error, success } from '../../utils/response';
import { auditLogsImmutable } from '../../db/schema';
import * as schema from '../../db/schema';
import { CryptoVault } from '../../utils/crypto';

const router = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// ----------------------------------------------------------------------
// Rota 1: Coleta das Tabelas (Table Explorer)
// ----------------------------------------------------------------------
router.get('/tables', async (c) => {
  try {
    // Acessando o D1 bruto pela Cloudflare env (não via Drizzle)
    const db = c.env.DB;

    if (!db) {
      return error(
        c,
        'Cloudflare D1 binding (DB) not found in context environment.',
        'D1_NOT_FOUND',
        500
      );
    }

    const tablesList = [
      'users',
      'sessions',
      'integration_configs',
      'integration_secrets',
      'integration_secret_versions',
      'audit_logs_immutable',
    ];

    const tablesData = [];

    for (const tableName of tablesList) {
      try {
        const countStmt = db.prepare(`SELECT COUNT(*) as count FROM "${tableName}"`);
        const countResult = await countStmt.first<{ count: number }>();

        let domain = 'UNKNOWN';
        if (tableName.includes('users') || tableName.includes('sessions')) domain = 'CORE';
        else if (tableName.includes('integration') || tableName.includes('audit'))
          domain = 'PLATFORM';
        else domain = 'APP';

        tablesData.push({
          name: tableName,
          rows: countResult?.count || 0,
          domain: domain,
          size: 'N/A',
        });
      } catch (e) {
        console.warn(`Failed to count table ${tableName}`, e);
      }
    }

    return success(c, 'Tabelas recuperadas com sucesso', { tables: tablesData });
  } catch (e: any) {
    return error(c, 'Falha ao buscar tabelas no D1', e.message, 500);
  }
});

// ----------------------------------------------------------------------
// Rota 2: Métricas de Saúde (Hero Panel)
// ----------------------------------------------------------------------
router.get('/metrics', async (c) => {
  try {
    const db = c.env.DB;
    if (!db) throw new Error('DB binding missing');

    // PRAGMA blocked by D1 SQLITE_AUTH, mocking size for now
    const sizeMB = '1.42';

    // Dispara um ping simples para checar latência
    const start = Date.now();
    await db.prepare('SELECT 1').first();
    const latency = Date.now() - start;

    return success(c, 'Métricas recuperadas', {
      sizeMB,
      latencyMs: latency,
      status: 'Excellent',
      score: 99,
      pendingWrites: 0,
      lockedEvents: 0,
    });
  } catch (e: any) {
    return error(c, 'Falha ao buscar métricas', e.message, 500);
  }
});

// ----------------------------------------------------------------------
// Rota 3: SQL Command Center (Execução Arbitrária)
// ----------------------------------------------------------------------
const querySchema = z.object({
  query: z.string().min(3),
  mfaVerified: z.boolean().default(false),
  eventHash: z.string().optional(),
});

router.post('/query', zValidator('json', querySchema), async (c) => {
  try {
    const db = c.env.DB;
    const drizzle = c.get('db');
    const { query, mfaVerified } = c.req.valid('json');

    if (!db) throw new Error('DB binding missing');

    const isMutative = /^(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE)/i.test(query.trim());

    if (isMutative) {
      if (!mfaVerified) {
        return error(c, 'Operação Nuclear negada.', 'NUCLEAR_MFA_REQUIRED', 403);
      }

      // Audita a execução nuclear antes de rodar
      const auditPayload = { action: 'SQL_EXECUTION', query };
      const eventHash = await CryptoVault.generateEventHash(auditPayload, 'GENESIS');

      await drizzle.insert(auditLogsImmutable).values({
        id: crypto.randomUUID(),
        action: 'DATABASE_NUCLEAR_QUERY',
        eventHash: eventHash,
        actorId: 1, // DevOS Root User (mock)
        actorIp: c.req.header('cf-connecting-ip') || '127.0.0.1',
        reason: JSON.stringify(auditPayload),
      });
    }

    // Executa a query
    const stmt = db.prepare(query);

    // Determina se deve retornar linhas ou apenas sucesso (ex: em DROPs)
    const { results, success: executionSuccess, error: dbError } = await stmt.all();

    if (!executionSuccess) {
      throw new Error(dbError || 'Erro de execução nativa do D1');
    }

    return success(c, 'Query executada', { results, mutative: isMutative });
  } catch (e: any) {
    return error(c, 'Falha na execução SQL', e.message, 500);
  }
});

export default router;
