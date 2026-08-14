import { sqliteTable, text, integer, index, uniqueIndex, primaryKey, check } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import type { EmailEventMetadata } from '../../dto/email-event';
import { users } from '../user/tables';



//
//   DAO Governance subsystem
//   USER / ACTOR
//   ORGANIZATIONS
//   N/A

// ----------------------------------------------------------------------
// Entity: govProposals
// ----------------------------------------------------------------------
export const govProposals = sqliteTable(
  'gov_proposals',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    creatorId: integer('creator_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    title: text('title').notNull(),
    description: text('description').notNull(),
    content: text('content'), // Detalhamento Markdown

    status: text('status', {
      enum: ['draft', 'active', 'passed', 'rejected', 'executed', 'cancelled'],
    }).default('active'),

    type: text('type', {
      enum: ['business', 'parameter_change', 'treasury_release', 'membership_grant'],
    }).default('business'),

    // Parâmetros de Votação
    votingStart: integer('voting_start', { mode: 'timestamp' }),
    votingEnd: integer('voting_end', { mode: 'timestamp' }),
    quorum: integer('quorum').default(10), // % mínimo de participação

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    statusIdx: index('idx_gov_status').on(table.status),
  })
);



// ----------------------------------------------------------------------
// Entity: govVotes
// ----------------------------------------------------------------------
export const govVotes = sqliteTable(
  'gov_votes',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    proposalId: integer('proposal_id')
      .notNull()
      .references(() => govProposals.id, { onDelete: 'cascade' }),
    voterId: integer('voter_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    support: integer('support', { mode: 'boolean' }).notNull(), // TRUE = For, FALSE = Against
    votingPower: integer('voting_power').default(1),
    reason: text('reason'),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    proposalVoterIdx: uniqueIndex('unique_proposal_voter').on(table.proposalId, table.voterId),
  })
);

