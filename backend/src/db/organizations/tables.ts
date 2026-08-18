import { sqliteTable, text, integer, index, uniqueIndex, check } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { users } from '../user/tables';
import { identityDocuments } from '../civil-identity/tables';

/**
 * ============================================================================
 * ORGANIZATIONS DOMAIN
 * ============================================================================
 *
 * Bounded Context Boundaries:
 * - Base account identity is owned by user/
 * - Civil identity documents are owned by civil-identity/
 * - Organizations domain owns organizations, memberships, and mandates.
 *
 * Retention & Compliance Policy:
 * - Mandates and memberships represent legal and organizational appointments.
 * - All foreign keys referencing users.id use onDelete: 'restrict' to ensure
 *   historical compliance records and mandates survive user soft-deletion.
 * ============================================================================
 */

// ----------------------------------------------------------------------
// 1. Entity: organizations
// ----------------------------------------------------------------------
export const organizations = sqliteTable(
  'organizations',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    type: text('type', {
      enum: ['dao', 'ngo', 'company', 'academic', 'government', 'foundation', 'other'],
    }).notNull(),
    status: text('status', { enum: ['active', 'suspended', 'revoked'] })
      .notNull()
      .default('active'),

    version: integer('version').notNull().default(1),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull()
      .$onUpdateFn(() => new Date()),
    suspendedAt: integer('suspended_at', { mode: 'timestamp' }),
    revokedAt: integer('revoked_at', { mode: 'timestamp' }),
  },
  (table) => ({
    slugIdx: index('idx_organizations_slug').on(table.slug),
    statusIdx: index('idx_organizations_status').on(table.status),
    statusCheck: check(
      'organizations_status_check',
      sql`${table.status} IN ('active', 'suspended', 'revoked')`
    ),
    typeCheck: check(
      'organizations_type_check',
      sql`${table.type} IN ('dao', 'ngo', 'company', 'academic', 'government', 'foundation', 'other')`
    ),
    slugFormatCheck: check('organizations_slug_format_check', sql`${table.slug} GLOB '[a-z0-9-]*'`),
    suspendedStateCheck: check(
      'organizations_suspended_state_check',
      sql`${table.status} != 'suspended' OR ${table.suspendedAt} IS NOT NULL`
    ),
    revokedStateCheck: check(
      'organizations_revoked_state_check',
      sql`${table.status} != 'revoked' OR ${table.revokedAt} IS NOT NULL`
    ),
    versionCheck: check('organizations_version_check', sql`${table.version} > 0`),
  })
);

// ----------------------------------------------------------------------
// 2. Entity: organizationMemberships
// ----------------------------------------------------------------------
export const organizationMemberships = sqliteTable(
  'organization_memberships',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    organizationId: integer('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),

    department: text('department'),
    position: text('position'),
    seniorityLevel: text('seniority_level'),

    startsAt: integer('starts_at', { mode: 'timestamp' }).notNull(),
    endsAt: integer('ends_at', { mode: 'timestamp' }),
    status: text('status', { enum: ['active', 'suspended', 'revoked'] })
      .notNull()
      .default('active'),

    appointedBy: integer('appointed_by').references(() => users.id, { onDelete: 'set null' }),
    reason: text('reason'),

    version: integer('version').notNull().default(1),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull()
      .$onUpdateFn(() => new Date()),
    suspendedAt: integer('suspended_at', { mode: 'timestamp' }),
    revokedAt: integer('revoked_at', { mode: 'timestamp' }),
  },
  (table) => ({
    userIdx: index('idx_org_memberships_user').on(table.userId),
    orgIdx: index('idx_org_memberships_org').on(table.organizationId),
    statusIdx: index('idx_org_memberships_status').on(table.status),
    activeMembershipUnq: uniqueIndex('uq_org_memberships_active_user_org')
      .on(table.userId, table.organizationId)
      .where(sql`${table.status} = 'active'`),
    statusCheck: check(
      'org_memberships_status_check',
      sql`${table.status} IN ('active', 'suspended', 'revoked')`
    ),
    suspendedStateCheck: check(
      'org_memberships_suspended_state_check',
      sql`${table.status} != 'suspended' OR ${table.suspendedAt} IS NOT NULL`
    ),
    revokedStateCheck: check(
      'org_memberships_revoked_state_check',
      sql`${table.status} != 'revoked' OR ${table.revokedAt} IS NOT NULL`
    ),
    temporalOrderCheck: check(
      'org_memberships_dates_check',
      sql`${table.endsAt} IS NULL OR ${table.endsAt} >= ${table.startsAt}`
    ),
    versionCheck: check('org_memberships_version_check', sql`${table.version} > 0`),
  })
);

// ----------------------------------------------------------------------
// 3. Entity: mandates
// ----------------------------------------------------------------------
export const mandates = sqliteTable(
  'mandates',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'restrict' }),
    organizationId: integer('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),

    position: text('position').notNull(),

    appointmentDocumentId: integer('appointment_document_id').references(
      () => identityDocuments.id,
      { onDelete: 'set null' }
    ),

    startsAt: integer('starts_at', { mode: 'timestamp' }).notNull(),
    endsAt: integer('ends_at', { mode: 'timestamp' }),
    status: text('status', { enum: ['active', 'suspended', 'revoked'] })
      .notNull()
      .default('active'),

    version: integer('version').notNull().default(1),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull()
      .$onUpdateFn(() => new Date()),
    suspendedAt: integer('suspended_at', { mode: 'timestamp' }),
    revokedAt: integer('revoked_at', { mode: 'timestamp' }),
  },
  (table) => ({
    userIdx: index('idx_mandates_user').on(table.userId),
    orgIdx: index('idx_mandates_org').on(table.organizationId),
    statusIdx: index('idx_mandates_status').on(table.status),
    activeMandateUnq: uniqueIndex('uq_mandates_active_user_org_position')
      .on(table.userId, table.organizationId, table.position)
      .where(sql`${table.status} = 'active'`),
    statusCheck: check(
      'mandates_status_check',
      sql`${table.status} IN ('active', 'suspended', 'revoked')`
    ),
    suspendedStateCheck: check(
      'mandates_suspended_state_check',
      sql`${table.status} != 'suspended' OR ${table.suspendedAt} IS NOT NULL`
    ),
    revokedStateCheck: check(
      'mandates_revoked_state_check',
      sql`${table.status} != 'revoked' OR ${table.revokedAt} IS NOT NULL`
    ),
    temporalOrderCheck: check(
      'mandates_dates_check',
      sql`${table.endsAt} IS NULL OR ${table.endsAt} >= ${table.startsAt}`
    ),
    versionCheck: check('mandates_version_check', sql`${table.version} > 0`),
  })
);
