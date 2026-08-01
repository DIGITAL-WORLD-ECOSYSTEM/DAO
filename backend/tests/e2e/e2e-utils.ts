import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const E2E_PREFIX = `e2e_${Date.now()}`;
export const TARGET_ENV = process.env.TARGET_ENV || 'staging';
export const API_URL = TARGET_ENV === 'production' ? 'https://api.asppibra.com' : 'http://localhost:8787';

/**
 * Executa uma query SQL no Cloudflare D1 usando Wrangler
 */
export async function queryD1(sql: string): Promise<any[]> {
  try {
    // Escapa as aspas duplas no SQL para evitar problemas no shell
    const escapedSql = sql.replace(/"/g, '\\"');
    
    let command = `npx wrangler d1 execute gov-db --command "${escapedSql}" --json`;
    if (TARGET_ENV === 'staging' || TARGET_ENV === 'production') {
       command = `npx wrangler d1 execute gov-db --command "${escapedSql}" --env ${TARGET_ENV} --json`;
    } else {
       command = `npx wrangler d1 execute gov-db --command "${escapedSql}" --local --json`;
    }

    const { stdout } = await execAsync(command);
    
    // Wrangler costuma retornar logs antes do JSON real, procuramos o primeiro '['
    const jsonStart = stdout.indexOf('[');
    if (jsonStart === -1) {
      console.error('Falha ao extrair JSON do Wrangler:', stdout);
      return [];
    }
    const cleanJson = stdout.substring(jsonStart);
    const parsed = JSON.parse(cleanJson);
    return parsed[0]?.results || [];
  } catch (e: any) {
    console.error('Error executing D1 Query:', e.message);
    throw e;
  }
}

/**
 * Utilitário de Timer para checar SLA de Resposta
 */
export async function measureResponse(fn: () => Promise<Response>): Promise<{ res: Response, durationMs: number }> {
  const start = Date.now();
  const res = await fn();
  const durationMs = Date.now() - start;
  return { res, durationMs };
}
