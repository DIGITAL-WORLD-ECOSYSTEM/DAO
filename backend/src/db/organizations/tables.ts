import { sqliteTable, text, integer, index, uniqueIndex, primaryKey, check } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import type { EmailEventMetadata } from '../../dto/email-event';
import { users } from '../user/tables';
import { identityDocuments } from '../civil-identity/tables';



//
//   Organizations subsystem
//   USER / ACTOR
//   N/A
//   N/A

// ----------------------------------------------------------------------
// Entity: organizations
// ----------------------------------------------------------------------
export const organizations = sqliteTable(
  'organizations',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    type: text('type', { enum: ['dao', 'ngo', 'company', 'academic', 'government', 'foundation', 'other'] }).notNull(),
    status: text('status', { enum: ['active', 'suspended', 'revoked'] }).notNull().default('active'),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull().$onUpdateFn(() => new Date()),
  },
  (table) => ({
    statusCheck: check('organizations_status_check', sql`${table.status} IN ('active', 'suspended', 'revoked')`),
  })
);



// ----------------------------------------------------------------------
// Entity: organizationMemberships
// ----------------------------------------------------------------------
export const organizationMemberships = sqliteTable(
  'organization_memberships',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    organizationId: integer('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
      
    department: text('department'),
    position: text('position'),
    seniorityLevel: text('seniority_level'),
    
    startsAt: integer('starts_at', { mode: 'timestamp' }),
    endsAt: integer('ends_at', { mode: 'timestamp' }),
    status: text('status', { enum: ['active', 'suspended', 'revoked'] }).notNull().default('active'),

    appointedBy: integer('appointed_by').references(() => users.id, { onDelete: 'set null' }),
    reason: text('reason'),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull().$onUpdateFn(() => new Date()),
  },
  (table) => ({
    userIdx: index('idx_org_memberships_user').on(table.userId),
    orgIdx: index('idx_org_memberships_org').on(table.organizationId),
    statusCheck: check('org_memberships_status_check', sql`${table.status} IN ('active', 'suspended', 'revoked')`),
  })
);



// ----------------------------------------------------------------------
// Entity: mandates
// ----------------------------------------------------------------------
export const mandates = sqliteTable(
  'mandates',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    organizationId: integer('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
      
    position: text('position').notNull(),
    
    appointmentDocumentId: integer('appointment_document_id')
      .references(() => identityDocuments.id, { onDelete: 'set null' }),
      
    startsAt: integer('starts_at', { mode: 'timestamp' }).notNull(),
    endsAt: integer('ends_at', { mode: 'timestamp' }),
    status: text('status', { enum: ['active', 'suspended', 'revoked'] }).notNull().default('active'),
    
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull().$onUpdateFn(() => new Date()),
  },
  (table) => ({
    userIdx: index('idx_mandates_user').on(table.userId),
    statusCheck: check('mandates_status_check', sql`${table.status} IN ('active', 'suspended', 'revoked')`),
  })
);

