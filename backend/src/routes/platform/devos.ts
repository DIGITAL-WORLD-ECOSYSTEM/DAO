import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { Bindings, Variables } from '../../types/bindings';
import { CryptoVault } from '../../utils/crypto-vault';
import { integrationConfigs, integrationSecrets, auditLogsImmutable } from '../../db/schema';
import { error, success } from '../../utils/response';
import { AuditService } from '../../services/audit';

const router = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Rota 1: Lista todas as integrações (Configs) e o status das chaves
router.get('/apis', async (c) => {
	const db = c.get('db');
	try {
		// Busca todas as configurações
		const configs = await db.select().from(integrationConfigs);
		
		// Busca status das chaves (sem expor o segredo)
		const secrets = await db
			.select({
				id: integrationSecrets.id,
				providerId: integrationSecrets.configId,
				keyName: integrationSecrets.keyName,
				ownerTeam: integrationSecrets.ownerRole,
				expiresAt: integrationSecrets.leaseExpiresAt,
				updatedAt: integrationSecrets.updatedAt,
			})
			.from(integrationSecrets);

		// Mesclando os dados (Config + Metadata dos Segredos)
		const payload = configs.map(config => {
			const providerSecrets = secrets.filter(s => s.providerId === config.id);
			return {
				...config,
				secretsCount: providerSecrets.length,
				secrets: providerSecrets
			};
		});

		return success(c, 'Integrações recuperadas com sucesso', { integrations: payload });
	} catch (e: any) {
		return error(c, 'Falha ao buscar integrações', e.message, 500);
	}
});

// Schema de validação para rotação de chave
const rotateSchema = z.object({
	providerId: z.string(),
	keyName: z.string(),
	plainTextSecret: z.string().min(1, 'A chave não pode estar vazia'),
	ownerTeam: z.string().default('DevOS Team'),
	expiresInDays: z.number().optional()
});

// Rota 2: Rotacionar ou Criar uma nova Chave (CryptoVault em Ação)
router.post('/apis/rotate', zValidator('json', rotateSchema), async (c) => {
	const db = c.get('db');
	const { providerId, keyName, plainTextSecret, ownerTeam, expiresInDays } = c.req.valid('json');

	const env = c.env as any;
	const masterSecret = env.MASTER_SECRET || 'fallback_master_secret_development';
	if (!env.MASTER_SECRET) {
		console.warn('⚠️ MASTER_SECRET não definida no env. Usando fallback de desenvolvimento.');
	}

	try {
		// 1. Criptografa a chave usando AES-256-GCM Edge
		const encryptedString = await CryptoVault.encrypt(plainTextSecret, masterSecret);
		
		let expiresAt = null;
		if (expiresInDays) {
			expiresAt = new Date();
			expiresAt.setDate(expiresAt.getDate() + expiresInDays);
		}

		// 2. Tenta encontrar a chave existente
		const existingSecret = await db.select().from(integrationSecrets)
			.where(eq(integrationSecrets.configId, providerId))
			.limit(1);

		let result;
		if (existingSecret.length > 0 && existingSecret[0].keyName === keyName) {
			// Atualiza existente
			result = await db.update(integrationSecrets)
				.set({
					encryptedValue: encryptedString,
					updatedAt: new Date(),
					leaseExpiresAt: expiresAt,
					ownerRole: ownerTeam
				})
				.where(eq(integrationSecrets.id, existingSecret[0].id))
				.returning();
		} else {
			// Cria nova chave
			result = await db.insert(integrationSecrets).values({
				id: crypto.randomUUID(),
				configId: providerId,
				keyName,
				encryptedValue: encryptedString,
				ownerRole: ownerTeam,
				leaseExpiresAt: expiresAt
			}).returning();
		}

		// 3. Auditoria Imutável (Simulação do Blockchain Hash)
		const auditPayload = { action: 'ROTATE_SECRET', providerId, keyName };
		const eventHash = await CryptoVault.generateEventHash(auditPayload, 'GENESIS');
		
		await db.insert(auditLogsImmutable).values({
			id: crypto.randomUUID(),
			action: 'ROTATE_SECRET',
			eventHash: eventHash,
			actorId: 1, // Mock
			actorIp: c.req.header('cf-connecting-ip') || '127.0.0.1',
			reason: JSON.stringify(auditPayload)
		});

		return success(c, 'Chave rotacionada e selada com sucesso', { 
			id: result[0].id, 
			provider: providerId,
			eventHash 
		});
	} catch (e: any) {
		return error(c, 'Falha catastrófica na criptografia ou salvamento', e.message, 500);
	}
});

export default router;
