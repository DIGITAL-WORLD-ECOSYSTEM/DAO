import { sqliteTable, text, integer, index, uniqueIndex, primaryKey, check } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import type { EmailEventMetadata } from '../../dto/email-event';
import { users } from '../user/tables';



//
//   Treasury subsystem
//   USER / ACTOR
//   N/A
//   N/A

// ----------------------------------------------------------------------
// Entity: treasuryLedger
// ----------------------------------------------------------------------
export const treasuryLedger = sqliteTable(
  'treasury_ledger',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),

    type: text('type', { enum: ['inbound', 'outbound', 'internal_transfer'] }).notNull(),
    category: text('category', {
      enum: ['membership', 'rwa_yield', 'grant', 'operational', 'other'],
    }).default('other'),

    amountCents: integer('amount_cents').notNull(), // Valor em centavos
    currency: text('currency').default('BRL'), // BRL, USDT, ASPPIBRA

    description: text('description').notNull(),
    txHash: text('tx_hash'), // Hash on-chain se aplicável
    externalTransactionId: text('external_transaction_id').unique(), // Pix ID, Boleto ID, etc.

    status: text('status', { enum: ['pending', 'completed', 'failed'] }).default('completed'),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    typeIdx: index('idx_treasury_type').on(table.type),
    userIdx: index('idx_treasury_user').on(table.userId),
    createdIdx: index('idx_treasury_created').on(table.createdAt),
  })
);

