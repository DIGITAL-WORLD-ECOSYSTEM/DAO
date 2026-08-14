import { sqliteTable, text, integer, index, uniqueIndex, primaryKey, check } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import type { EmailEventMetadata } from '../../dto/email-event';
import { users } from '../user/tables';



//
//   Obligations subsystem
//   USER / ACTOR
//   N/A
//   N/A

// ----------------------------------------------------------------------
// Entity: contracts
// ----------------------------------------------------------------------
export const contracts = sqliteTable('contracts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  description: text('description').notNull(),
  totalValue: integer('total_value').notNull(), // Valor em centavos
  installmentValue: integer('installment_value'), // Valor da parcela em centavos
  totalInstallments: integer('total_installments'),
  paidInstallments: integer('paid_installments').default(0),
  nextDueDate: integer('next_due_date', { mode: 'timestamp' }),

  status: text('status', { enum: ['active', 'completed', 'defaulted'] }).default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

