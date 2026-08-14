import { sqliteTable, text, integer, index, uniqueIndex, primaryKey, check } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import type { EmailEventMetadata } from '../../dto/email-event';
import { users } from '../user/tables';



//
//   Social interactions subsystem
//   USER / ACTOR
//   N/A
//   N/A

// ----------------------------------------------------------------------
// Entity: userSocialLinks
// ----------------------------------------------------------------------
export const userSocialLinks = sqliteTable(
  'user_social_links',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    provider: text('provider').notNull(), // 'twitter', 'linkedin', 'github', 'instagram', etc.
    url: text('url').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    userProviderUnique: uniqueIndex('idx_socials_user_provider').on(table.userId, table.provider),
  })
);



// ----------------------------------------------------------------------
// Entity: posts
// ----------------------------------------------------------------------
export const posts = sqliteTable(
  'posts',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    authorId: integer('author_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'), // Meta Description e Cards
    content: text('content').notNull(),
    coverUrl: text('cover_url'),
    coverAlt: text('cover_alt'),

    category: text('category').default('Tecnologia'),
    tags: text('tags', { mode: 'json' }).$type<string[]>(), // Tags dinâmicas em JSON

    // SEO Avançado
    metaTitle: text('meta_title'),
    metaDescription: text('meta_description'),
    metaKeywords: text('meta_keywords', { mode: 'json' }).$type<string[]>(),

    // Métricas SocialFi
    totalViews: integer('total_views').default(0),
    totalShares: integer('total_shares').default(0),
    totalFavorites: integer('total_favorites').default(0),
    timeToRead: integer('time_to_read').default(5), // Minutos estimados

    // Controle de Destaque e Governança
    isFeatured: integer('is_featured', { mode: 'boolean' }).default(false),
    isTrending: integer('is_trending', { mode: 'boolean' }).default(false),

    // Editorial lifecycle: Renomeado para 'status' (Governança Editorial FSM)
    status: text('status', {
      enum: ['draft', 'review', 'published', 'archived'],
    }).default('draft'),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    slugIdx: index('idx_posts_slug').on(table.slug),
    statusIdx: index('idx_posts_status').on(table.status),
    categoryIdx: index('idx_posts_category').on(table.category),
  })
);



// ----------------------------------------------------------------------
// Entity: postComments
// ----------------------------------------------------------------------
export const postComments = sqliteTable(
  'post_comments',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    postId: integer('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    content: text('content').notNull(),
    likes: integer('likes').default(0),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    postIdIdx: index('idx_comments_post').on(table.postId),
    userIdIdx: index('idx_comments_user').on(table.userId),
  })
);



// ----------------------------------------------------------------------
// Entity: postFavorites
// ----------------------------------------------------------------------
export const postFavorites = sqliteTable(
  'post_favorites',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    postId: integer('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    uniqueFavoriteIdx: uniqueIndex('unique_post_user_favorite').on(table.postId, table.userId),
  })
);

