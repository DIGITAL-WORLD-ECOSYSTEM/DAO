import { sqliteTable, text, integer, index, uniqueIndex, primaryKey, check } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import type { EmailEventMetadata } from '../../dto/email-event';
import { users } from '../user/tables';



//
//   Contributions subsystem
//   USER / ACTOR
//   N/A
//   N/A

// ----------------------------------------------------------------------
// Entity: bounties
// ----------------------------------------------------------------------
export const bounties = sqliteTable(
  'bounties',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    creatorId: integer('creator_id').references(() => users.id),

    title: text('title').notNull(),
    description: text('description').notNull(),

    rewardAmount: integer('reward_amount'),
    rewardToken: text('reward_token').default('ASPPIBRA'),

    status: text('status', {
      enum: ['open', 'assigned', 'review', 'completed', 'cancelled'],
    }).default('open'),
    difficulty: text('difficulty', { enum: ['easy', 'medium', 'hard'] }).default('medium'),

    assigneeId: integer('assignee_id').references(() => users.id),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    statusIdx: index('idx_bounties_status').on(table.status),
  })
);

