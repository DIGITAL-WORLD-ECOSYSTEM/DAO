/**
 * Project: Governance System (ASPPIBRA DAO)
 * Role: Blog & SocialFi API (Unified & Revised)
 * Version: 2.1.0
 */

import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { desc, eq, sql } from 'drizzle-orm';
import { posts, users, citizens, postFavorites, postComments, auditLogs } from '../../db/schema'; // Added postComments
import { authSignature } from '../../middleware/auth_signature';
import { Database } from '../../db';

// Schema Zod para criação/edição, alinhado ao banco de dados
const createPostSchema = z.object({
	title: z.string().min(3, 'O título é muito curto'),
	content: z.string().min(10, 'O conteúdo é muito curto'),
	slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug inválido'),
	description: z.string().max(160, 'A descrição é muito longa').optional(),
	category: z.string().optional().default('Tecnologia'),
	coverUrl: z.string().url('URL da imagem de capa inválida').optional(),
	coverAlt: z.string().optional(),
	tags: z.array(z.string()).optional().default([]),
	metaTitle: z.string().optional(),
	metaDescription: z.string().optional(),
	metaKeywords: z.array(z.string()).optional().default([]),
	status: z.enum(['draft', 'review', 'published', 'archived']).optional().default('draft'),
	isFeatured: z.boolean().optional().default(false),
	isTrending: z.boolean().optional().default(false),
});

const commentSchema = z.object({
	content: z.string().min(1, 'O comentário não pode estar vazio'),
});

// Schema Zod para validar o parâmetro :id
const postIdSchema = z.object({
	id: z.string().regex(/^\d+$/, 'ID de post inválido').transform(Number),
});

type AppType = {
	Bindings: { DB: D1Database; JWT_SECRET: string; STORAGE: R2Bucket };
	Variables: { db: Database; user: { userId: number; role: string } };
};

const extractR2Key = (url?: string | null) => {
	if (!url || !url.includes('/public/')) return null;
	return url.split('/public/')[1];
};

const ALLOWED_STORAGE_PREFIXES = ['media', 'document', 'posts', 'avatars'];

const blog = new Hono<AppType>();

// =================================================================
// 1. ROTAS PÚBLICAS (LEITURA)
// =================================================================

// Estatísticas de Posts (Contagens para Dashboard)
blog.get('/stats', async (c) => {
	const db = c.get('db');
	try {
		const [all] = await db.select({ count: sql<number>`count(*)` }).from(posts);
		const [published] = await db
			.select({ count: sql<number>`count(*)` })
			.from(posts)
			.where(eq(posts.status, 'published'));
		const [draft] = await db
			.select({ count: sql<number>`count(*)` })
			.from(posts)
			.where(eq(posts.status, 'draft'));
		const [review] = await db
			.select({ count: sql<number>`count(*)` })
			.from(posts)
			.where(eq(posts.status, 'review'));
		const [archived] = await db
			.select({ count: sql<number>`count(*)` })
			.from(posts)
			.where(eq(posts.status, 'archived'));

		return c.json({
			success: true,
			data: {
				all: all.count,
				published: published.count,
				draft: draft.count,
				review: review.count,
				archived: archived.count,
			},
		});
	} catch (error) {
		console.error('Erro ao buscar estatísticas:', error);
		return c.json({ success: false, message: 'Erro ao carregar estatísticas.' }, 500);
	}
});

blog.get('/', async (c) => {
	const db = c.get('db');
	const category = c.req.query('category');
	const status = c.req.query('status'); // 'all', 'published', 'draft', 'review', 'archived'
	const sortBy = c.req.query('sortBy') || 'latest';
	const page = Number(c.req.query('page') || 1);
	const limit = Number(c.req.query('limit') || 100);
	const offset = (page - 1) * limit;

	try {
		const query = db
			.select({
				id: posts.id,
				title: posts.title,
				slug: posts.slug,
				description: posts.description,
				category: posts.category,
				coverUrl: posts.coverUrl,
				coverAlt: posts.coverAlt,
				totalViews: posts.totalViews,
				totalFavorites: posts.totalFavorites,
				isFeatured: posts.isFeatured,
				isTrending: posts.isTrending,
				status: posts.status,
				createdAt: posts.createdAt,
				author: {
					id: users.id,
					name: sql<string>`${citizens.firstName} || ' ' || ${citizens.lastName}`,
					avatarUrl: users.avatarUrl,
				},
			})
			.from(posts)
			.leftJoin(users, eq(posts.authorId, users.id))
			.leftJoin(citizens, eq(posts.authorId, citizens.userId))
			.$dynamic();

		const whereConditions = [];

		if (status && status !== 'all') whereConditions.push(eq(posts.status, status as any));
		// Se for 'all' ou não especificado, não filtra por status aqui para listar todos no dashboard
		// mas na home o frontend deve passar 'status=published'

		// Filtro de Categoria (Case-insensitive para SQLite/Drizzle)
		if (category) {
			whereConditions.push(sql`LOWER(${posts.category}) = LOWER(${category})`);
		}

		if (whereConditions.length > 0) {
			query.where(sql`${sql.join(whereConditions, sql` AND `)}`);
		}

		// Ordenação
		if (sortBy === 'latest') query.orderBy(desc(posts.createdAt));
		else if (sortBy === 'oldest') query.orderBy(posts.createdAt);
		else if (sortBy === 'popular') query.orderBy(desc(posts.totalViews));

		const data = await query.limit(limit).offset(offset);

		// Contagem para paginação (Respeitando filtros)
		const countQuery = db
			.select({ count: sql<number>`count(*)` })
			.from(posts)
			.$dynamic();
		if (whereConditions.length > 0) {
			countQuery.where(sql`${sql.join(whereConditions, sql` AND `)}`);
		}
		const [{ count }] = await countQuery;

		return c.json({
			success: true,
			data,
			pagination: {
				total: count,
				page,
				limit,
				pages: Math.ceil(count / limit),
			},
		});
	} catch (error: any) {
		console.error('Erro ao buscar feed:', error);
		return c.json({ success: false, message: `Erro ao buscar feed: ${error.message || 'Erro desconhecido'}` }, 500);
	}
});

// Busca de Posts
blog.get('/search', async (c) => {
	const db = c.get('db');
	const query = c.req.query('q');

	if (!query) return c.json({ success: true, data: [] });

	try {
		const page = Number(c.req.query('page') || 1);
		const limit = Number(c.req.query('limit') || 100);
		const offset = (page - 1) * limit;

		const data = await db
			.select({
				id: posts.id,
				title: posts.title,
				slug: posts.slug,
				coverUrl: posts.coverUrl,
			})
			.from(posts)
			.where(sql`${posts.title} LIKE ${`%${query}%`}`)
			.limit(limit)
			.offset(offset);

		const [{ count }] = await db
			.select({ count: sql<number>`count(*)` })
			.from(posts)
			.where(sql`${posts.title} LIKE ${`%${query}%`}`);

		return c.json({
			success: true,
			data,
			pagination: {
				total: count,
				page,
				limit,
				pages: Math.ceil(count / limit),
			},
		});
	} catch (error: any) {
		console.error('Erro na busca de posts:', error);
		return c.json({ success: false, message: `Erro na busca: ${error.message || 'Erro desconhecido'}` }, 500);
	}
});

blog.get('/:slug', async (c) => {
	const db = c.get('db');
	const slug = c.req.param('slug');

	try {
		const [post] = await db
			.select({
				id: posts.id,
				title: posts.title,
				content: posts.content,
				description: posts.description,
				slug: posts.slug,
				category: posts.category,
				tags: posts.tags,
				coverUrl: posts.coverUrl,
				coverAlt: posts.coverAlt,
				metaTitle: posts.metaTitle,
				metaDescription: posts.metaDescription,
				metaKeywords: posts.metaKeywords,
				totalViews: posts.totalViews,
				totalFavorites: posts.totalFavorites,
				createdAt: posts.createdAt,
				author: {
					id: users.id,
					name: sql<string>`${citizens.firstName} || ' ' || ${citizens.lastName}`,
					avatarUrl: users.avatarUrl,
				},
			})
			.from(posts)
			.leftJoin(users, eq(posts.authorId, users.id))
			.leftJoin(citizens, eq(posts.authorId, citizens.userId))
			.where(eq(posts.slug, slug));

		if (!post) return c.json({ success: false, message: 'Post não encontrado' }, 404);

		const favorites = await db
			.select({
				name: sql<string>`${citizens.firstName}`,
				avatarUrl: users.avatarUrl,
			})
			.from(postFavorites)
			.leftJoin(users, eq(postFavorites.userId, users.id))
			.leftJoin(citizens, eq(postFavorites.userId, citizens.userId))
			.where(eq(postFavorites.postId, post.id))
			.limit(5);

		c.executionCtx.waitUntil(
			db
				.update(posts)
				.set({ totalViews: sql`${posts.totalViews} + 1` })
				.where(eq(posts.id, post.id)),
		);

		// Drizzle/D1 com modo 'json' já faz o parse, então 'tags' deve ser um array.
		return c.json({ success: true, data: { ...post, favoritePerson: favorites } });
	} catch (error: any) {
		console.error(`Erro ao carregar artigo [${slug}]:`, error);
		return c.json({ success: false, message: `Erro ao carregar artigo: ${error.message || 'Erro desconhecido'}` }, 500);
	}
});

// =================================================================
// 2. COMENTÁRIOS (LEITURA PÚBLICA)
// =================================================================

// Listar Comentários de um Post
blog.get('/:id/comments', zValidator('param', postIdSchema), async (c) => {
	const db = c.get('db');
	const { id: postId } = c.req.valid('param');

	try {
		const page = Number(c.req.query('page') || 1);
		const limit = Number(c.req.query('limit') || 10);
		const offset = (page - 1) * limit;

		const comments = await db
			.select({
				id: postComments.id,
				content: postComments.content,
				createdAt: postComments.createdAt,
				user: {
					id: users.id,
					name: sql<string>`${citizens.firstName} || ' ' || ${citizens.lastName}`,
					avatarUrl: users.avatarUrl,
				},
			})
			.from(postComments)
			.leftJoin(users, eq(postComments.userId, users.id))
			.leftJoin(citizens, eq(postComments.userId, citizens.userId))
			.where(eq(postComments.postId, postId))
			.orderBy(desc(postComments.createdAt))
			.limit(limit)
			.offset(offset);

		const [{ count }] = await db
			.select({ count: sql<number>`count(*)` })
			.from(postComments)
			.where(eq(postComments.postId, postId));

		return c.json({
			success: true,
			data: comments,
			pagination: {
				total: count,
				page,
				limit,
				pages: Math.ceil(count / limit),
			},
		});
	} catch (error) {
		console.error(`Erro ao buscar comentários do post [${postId}]:`, error);
		return c.json({ success: false, message: 'Erro ao buscar comentários.' }, 500);
	}
});

// =================================================================
// 3. ROTAS PRIVADAS (Ações SocialFi & Escrita)
// =================================================================

blog.use('/*', authSignature);

// Criar Post
blog.post(
	'/',
	zValidator('json', createPostSchema, (result, c) => {
		if (!result.success) {
			return c.json({ success: false, message: 'Erro de validação no payload', errors: (result.error as any).flatten() }, 400);
		}
	}),
	async (c) => {
		const db = c.get('db');
		const user = c.get('user');
		const postData = c.req.valid('json');

		try {
			const [newPost] = await db
				.insert(posts)
				.values({
					authorId: user.userId,
					title: postData.title,
					slug: postData.slug,
					description: postData.description,
					content: postData.content,
					coverUrl: postData.coverUrl,
					coverAlt: postData.coverAlt,
					category: postData.category,
					tags: postData.tags,
					metaTitle: postData.metaTitle,
					metaDescription: postData.metaDescription,
					metaKeywords: postData.metaKeywords,
					status: postData.status,
					isFeatured: postData.isFeatured,
					isTrending: postData.isTrending,
				})
				.returning();

			// 🟢 AUDITORIA FORENSE
			c.executionCtx.waitUntil(
				db.insert(auditLogs).values({
					actorId: user.userId,
					action: 'BLOG_POST_CREATE',
					status: 'success',
					ipAddress: c.req.header('cf-connecting-ip') || 'unknown',
					metadata: { postId: newPost.id, slug: newPost.slug },
				}),
			);

			return c.json({ success: true, data: newPost }, 201);
		} catch (error: any) {
			console.error('Erro ao criar post:', error);
			// Erro de slug duplicado
			if (error.message?.includes('UNIQUE constraint failed: posts.slug')) {
				return c.json({ success: false, message: 'Este slug já está em uso.' }, 409);
			}
			return c.json({ success: false, message: `Erro interno do servidor: ${error.message || 'Não foi possível criar o post.'}` }, 500);
		}
	});

// Favoritar Post
blog.post(
	'/:id/favorite',
	zValidator('param', postIdSchema, (result, c) => {
		if (!result.success) {
			return c.json({ success: false, message: 'ID de post inválido', errors: (result.error as any).flatten() }, 400);
		}
	}),
	async (c) => {
		const db = c.get('db');
		const userId = c.get('user').userId;
		const { id: postId } = c.req.valid('param');

		try {
			await db.insert(postFavorites).values({ userId, postId });

			c.executionCtx.waitUntil(
				db
					.update(posts)
					.set({ totalFavorites: sql`${posts.totalFavorites} + 1` })
					.where(eq(posts.id, postId)),
			);

			return c.json({ success: true, message: 'Favoritado com sucesso!' });
		} catch (error: any) {
			if (error.message?.includes('UNIQUE constraint failed')) {
				return c.json({ success: false, message: 'Você já favoritou este post.' }, 409);
			}
			console.error(`Erro ao favoritar post [${postId}]:`, error);
			return c.json({ success: false, message: 'Não foi possível completar a ação.' }, 500);
		}
	});

// Atualizar Post
blog.put(
	'/:id',
	zValidator('param', postIdSchema, (result, c) => {
		if (!result.success) {
			return c.json({ success: false, message: 'ID de post inválido no parâmetro', errors: (result.error as any).flatten() }, 400);
		}
	}),
	zValidator('json', createPostSchema, (result, c) => {
		if (!result.success) {
			return c.json({ success: false, message: 'Erro de validação no payload de atualização', errors: (result.error as any).flatten() }, 400);
		}
	}),
	async (c) => {
		const db = c.get('db');
		const user = c.get('user');
		const { id } = c.req.valid('param');
		const postData = c.req.valid('json');

		try {
			// 🛡️ VERIFICAÇÃO DE PROPRIEDADE (OWNERSHIP)
			const [existingPost] = await db.select({ authorId: posts.authorId, coverUrl: posts.coverUrl }).from(posts).where(eq(posts.id, id));
			if (!existingPost) return c.json({ success: false, message: 'Post não encontrado' }, 404);
			if (existingPost.authorId !== user.userId) return c.json({ success: false, message: 'Sem permissão para editar este post.' }, 403);

			const [updatedPost] = await db
				.update(posts)
				.set({ ...postData, updatedAt: sql`(strftime('%s', 'now'))` })
				.where(eq(posts.id, id))
				.returning();

			if (!updatedPost) return c.json({ success: false, message: 'Post não encontrado' }, 404);

			// AUDITORIA
			c.executionCtx.waitUntil(
				db.insert(auditLogs).values({
					actorId: user.userId,
					action: 'BLOG_POST_UPDATE',
					status: 'success',
					ipAddress: c.req.header('cf-connecting-ip') || 'unknown',
					metadata: { postId: id, slug: updatedPost.slug },
				}),
			);

			// 🛡️ LIMPEZA DE STORAGE (R2) CASO A CAPA MUDE
			if (postData.coverUrl && existingPost.coverUrl && postData.coverUrl !== existingPost.coverUrl) {
				const oldKey = extractR2Key(existingPost.coverUrl);
				if (oldKey) {
					c.executionCtx.waitUntil(c.env.STORAGE.delete(oldKey));
				}
			}

			return c.json({ success: true, data: updatedPost });
		} catch (error: any) {
			console.error(`Erro ao atualizar post [${id}]:`, error);
			return c.json({ success: false, message: 'Não foi possível atualizar o post.' }, 500);
		}
	});

// Deletar Post
blog.delete('/:id', zValidator('param', postIdSchema), async (c) => {
	const db = c.get('db');
	const user = c.get('user');
	const { id } = c.req.valid('param');

	try {
		// 🛡️ VERIFICAÇÃO DE PROPRIEDADE (OWNERSHIP)
		const [existingPost] = await db.select({ authorId: posts.authorId, coverUrl: posts.coverUrl }).from(posts).where(eq(posts.id, id));
		if (!existingPost) return c.json({ success: false, message: 'Post não encontrado' }, 404);
		if (existingPost.authorId !== user.userId) return c.json({ success: false, message: 'Sem permissão para deletar este post.' }, 403);

		const [deletedPost] = await db.delete(posts).where(eq(posts.id, id)).returning();

		if (deletedPost?.coverUrl) {
			const key = extractR2Key(deletedPost.coverUrl);
			if (key) {
				c.executionCtx.waitUntil(c.env.STORAGE.delete(key));
			}
		}

		if (!deletedPost) return c.json({ success: false, message: 'Post não encontrado' }, 404);

		// AUDITORIA
		c.executionCtx.waitUntil(
			db.insert(auditLogs).values({
				actorId: user.userId,
				action: 'BLOG_POST_DELETE',
				status: 'success',
				ipAddress: c.req.header('cf-connecting-ip') || 'unknown',
				metadata: { postId: id, slug: deletedPost.slug },
			}),
		);

		return c.json({ success: true, message: 'Post deletado com sucesso!' });
	} catch (error: any) {
		console.error(`Erro ao deletar post [${id}]:`, error);
		return c.json({ success: false, message: 'Não foi possível deletar o post.' }, 500);
	}
});

// Criar Comentário (Requer Auth)
blog.post('/:id/comments', zValidator('param', postIdSchema), zValidator('json', commentSchema), async (c) => {
	const db = c.get('db');
	const user = c.get('user');
	const { id: postId } = c.req.valid('param');
	const { content } = c.req.valid('json');

	try {
		const [newComment] = await db
			.insert(postComments)
			.values({
				postId,
				userId: user.userId,
				content,
			})
			.returning();

		// AUDITORIA
		c.executionCtx.waitUntil(
			db.insert(auditLogs).values({
				actorId: user.userId,
				action: 'BLOG_COMMENT_CREATE',
				status: 'success',
				ipAddress: c.req.header('cf-connecting-ip') || 'unknown',
				metadata: { commentId: newComment.id, postId },
			}),
		);

		return c.json({ success: true, data: newComment }, 201);
	} catch (error) {
		console.error(`Erro ao criar comentário no post [${postId}]:`, error);
		return c.json({ success: false, message: 'Não foi possível enviar o comentário.' }, 500);
	}
});

export default blog;
