import { Hono } from 'hono';
import { eq, desc, sql } from 'drizzle-orm';
import { govProposals, govVotes, users, citizens } from '../../db/schema';
import { verifyRole } from '../../middleware/rbac';
import { Bindings } from '../../types/bindings';
import { success, error } from '../../utils/response';

type AppType = { Bindings: Bindings; Variables: { db: any; jwtPayload?: any } };

const governance = new Hono<AppType>();

// 1. Listar Propostas
governance.get('/proposals', async (c) => {
	const db = c.get('db');
	try {
		const proposals = await db
			.select({
				id: govProposals.id,
				title: govProposals.title,
				description: govProposals.description,
				status: govProposals.status,
				type: govProposals.type,
				createdAt: govProposals.createdAt,
				creatorName: sql<string>`COALESCE(${citizens.firstName}, ${users.email})`,
			})
			.from(govProposals)
			.leftJoin(users, eq(govProposals.creatorId, users.id))
			.leftJoin(citizens, eq(users.id, citizens.userId))
			.orderBy(desc(govProposals.createdAt));

		return success(c, 'Propostas recuperadas com sucesso.', proposals);
	} catch (err: any) {
		return error(c, 'Falha ao buscar propostas.', err.message, 500);
	}
});

// 2. Criar Proposta (Mínimo Partner)
governance.post('/proposals', verifyRole(['admin', 'partner']), async (c) => {
	const db = c.get('db');
	const payload = c.get('jwtPayload');
	const { title, description, content, type } = await c.req.json();

	if (!title || !description) {
		return error(c, 'Título e descrição são obrigatórios.', null, 400);
	}

	try {
		const [newProposal] = await db
			.insert(govProposals)
			.values({
				title,
				description,
				content,
				type: type || 'business',
				creatorId: payload.userId,
				status: 'active',
			})
			.returning();

		return success(c, 'Proposta criada com sucesso.', newProposal, 201);
	} catch (err: any) {
		return error(c, 'Falha ao criar proposta.', err.message, 500);
	}
});

// 3. Votar em Proposta (Requer Cidadania)
governance.post('/vote', verifyRole(['admin', 'partner', 'citizen']), async (c) => {
	const db = c.get('db');
	const payload = c.get('jwtPayload');
	const { proposalId, support, reason } = await c.req.json();

	if (proposalId === undefined || support === undefined) {
		return error(c, 'proposalId e support são obrigatórios.', null, 400);
	}

	try {
		// Verificar se a proposta está ativa
		const [proposal] = await db.select().from(govProposals).where(eq(govProposals.id, proposalId)).limit(1);
		if (!proposal || proposal.status !== 'active') {
			return error(c, 'Votação indisponível para esta proposta.', null, 400);
		}

		// Registrar Voto
		const [vote] = await db
			.insert(govVotes)
			.values({
				proposalId,
				voterId: payload.userId,
				support,
				reason,
				votingPower: 1, // Futuro: basear em tokens ASPPIBRA
			})
			.returning();

		return success(c, 'Voto registrado com sucesso.', vote, 201);
	} catch (err: any) {
		if (err.message.includes('UNIQUE')) {
			return error(c, 'Você já votou nesta proposta.', null, 409);
		}
		return error(c, 'Falha ao registrar voto.', err.message, 500);
	}
});

export default governance;
