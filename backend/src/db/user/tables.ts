import { sqliteTable, text, integer, index, uniqueIndex, primaryKey, check } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import type { EmailEventMetadata } from '../../dto/email-event';
import { USER_STATUS } from '../constants';
import { organizations } from '../organizations/tables';



//
//   User / Actor subsystem
//   None (Base aggregate)
//   N/A
//   Security / Audit events

// ----------------------------------------------------------------------
// Entity: users
// ----------------------------------------------------------------------
export const users = sqliteTable(
  'users',
  {
    // ================================================================
    // IDENTITY
    // ================================================================

    // Internal relational identity (eficiente para FKs no D1/SQLite)
    id: integer('id').primaryKey({ autoIncrement: true }),

    // Public blockchain identifier (EVM Address of Internal Wallet)
    publicId: text('public_id').unique(),

    // Optional classification of the account subject
    subjectType: text('subject_type', {
      enum: ['human', 'service', 'system'],
    }).notNull().default('human'),

    // ================================================================
    // PRIMARY CONTACT
    // ================================================================

    email: text('email'),
    emailNormalized: text('email_normalized').unique(),
    emailVerifiedAt: integer('email_verified_at', { mode: 'timestamp' }),
    emailChangedAt: integer('email_changed_at', { mode: 'timestamp' }),

    // ================================================================
    // ACCOUNT SECURITY / LIFECYCLE
    // ================================================================

    // Invalidação global de sessão (incrementar em password reset, etc)
    authEpoch: integer('auth_epoch').default(1).notNull(),

    status: text('status', { enum: USER_STATUS }).default('pending_setup').notNull(),
    statusChangedAt: integer('status_changed_at', { mode: 'timestamp' }),
    lockedAt: integer('locked_at', { mode: 'timestamp' }),
    disabledAt: integer('disabled_at', { mode: 'timestamp' }),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),

    // ================================================================
    // AUDITABLE TIMESTAMPS
    // ================================================================

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull().$onUpdateFn(() => new Date()),
  },
  (table) => ({
    // emailNormalized.unique() já cria UNIQUE INDEX — sem índice redundante em email
    // primaryRoleIdx removido: primaryRole não é autoridade de autorização, queries devem usar user_roles
    statusIdx: index('idx_users_status').on(table.status),
    // Índice composto: a query crítica do AuthGuard é WHERE status='active' AND deleted_at IS NULL
    activeActorIdx: index('idx_users_active_actor').on(table.status, table.deletedAt),
    // CHECK constraint: integridade rígida no SQLite para impedir valores inválidos mesmo contornando o ORM
    statusCheck: check('users_status_check', sql`${table.status} IN ('pending_setup', 'active', 'suspended', 'locked', 'disabled')`),
  })
);



// ----------------------------------------------------------------------
// Entity: userProfiles
// ----------------------------------------------------------------------
export const userProfiles = sqliteTable(
  'user_profiles',
  {
    userId: integer('user_id')
      .primaryKey()
      .references(() => users.id, { onDelete: 'cascade' }),

    username: text('username').notNull(),
    usernameNormalized: text('username_normalized').notNull().unique(),
    displayName: text('display_name'),
    avatarUrl: text('avatar_url'),
    website: text('website'),
    about: text('about'),

    profileVisibility: text('profile_visibility', { enum: ['public', 'members', 'private'] }).notNull().default('private'),
    isDiscoverable: integer('is_discoverable', { mode: 'boolean' }).notNull().default(false),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull().$onUpdateFn(() => new Date()),
  },
  (table) => ({
    usernameCheck: check('username_format_check', sql`length(${table.username}) >= 3`),
  })
);



// ----------------------------------------------------------------------
// Entity: userContacts
// ----------------------------------------------------------------------
export const userContacts = sqliteTable(
  'user_contacts',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    type: text('type', { enum: ['phone', 'mobile', 'whatsapp', 'secondary_email'] }).notNull(),
    value: text('value').notNull(),
    normalizedValue: text('normalized_value').notNull(),

    verificationMethod: text('verification_method', { enum: ['sms', 'whatsapp', 'email', 'admin', 'import'] }),
    verifiedAt: integer('verified_at', { mode: 'timestamp' }),

    isPrimary: integer('is_primary', { mode: 'boolean' }).notNull().default(false),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull().$onUpdateFn(() => new Date()),
  },
  (table) => ({
    userIdx: index('idx_user_contacts_user').on(table.userId),
    // Impede dois usuários registrarem o mesmo meio de contato, garantindo unicidade real
    normalizedUnq: uniqueIndex('uq_user_contacts_normalized').on(table.type, table.normalizedValue),
    // Apenas um contato primário TOTAL (e não por tipo)
    primaryUnq: uniqueIndex('uq_user_contacts_primary').on(table.userId).where(sql`${table.isPrimary} = true`),
  })
);



// ----------------------------------------------------------------------
// Entity: userAddresses
// ----------------------------------------------------------------------
export const userAddresses = sqliteTable(
  'user_addresses',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    type: text('type', { enum: ['residential', 'commercial', 'billing', 'shipping'] }).notNull(),

    country: text('country').default('BR').notNull(),
    state: text('state').notNull(),
    city: text('city').notNull(),
    neighborhood: text('neighborhood'),
    street: text('street').notNull(),
    number: text('number'),
    complement: text('complement'),
    zipCode: text('zip_code').notNull(),

    isPrimary: integer('is_primary', { mode: 'boolean' }).notNull().default(false),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull().$onUpdateFn(() => new Date()),
  },
  (table) => ({
    userIdx: index('idx_user_addresses_user').on(table.userId),
    // Unicidade parcial garantida (SQLite suporta WHERE em índices únicos)
    primaryUnq: uniqueIndex('uq_user_addresses_primary').on(table.userId, table.type).where(sql`${table.isPrimary} = true`),
  })
);



// ----------------------------------------------------------------------
// Entity: userProfessionalExperience
// ----------------------------------------------------------------------
export const userProfessionalExperience = sqliteTable(
  'user_professional_experience',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    organizationId: integer('organization_id').references(() => organizations.id, { onDelete: 'set null' }),
    companyName: text('company_name'), // Fallback if not an internal organization

    role: text('role').notNull(),
    description: text('description'),

    startDate: text('start_date'), // YYYY-MM-DD
    endDate: text('end_date'), // YYYY-MM-DD

    verifiedAt: integer('verified_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  },
  (table) => ({
    userIdx: index('idx_professional_exp_user').on(table.userId),
  })
);



// ----------------------------------------------------------------------
// Entity: userEducation
// ----------------------------------------------------------------------
export const userEducation = sqliteTable(
  'user_education',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    organizationId: integer('organization_id').references(() => organizations.id, { onDelete: 'set null' }),
    institutionName: text('institution_name'), // Fallback

    degree: text('degree').notNull(),
    field: text('field'),
    level: text('level'),

    startDate: text('start_date'), // YYYY-MM-DD
    endDate: text('end_date'), // YYYY-MM-DD

    verifiedAt: integer('verified_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  },
  (table) => ({
    userIdx: index('idx_education_user').on(table.userId),
  })
);



// ----------------------------------------------------------------------
// Entity: membershipCards
// ----------------------------------------------------------------------
export const membershipCards = sqliteTable(
  'membership_cards',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    cardHash: text('card_hash').notNull().unique(), // SHA-256 para verificação offline
    tier: text('tier', { enum: ['citizen', 'partner', 'founder', 'honorary'] }).default('citizen'),

    issueDate: integer('issue_date', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
    expiryDate: integer('expiry_date', { mode: 'timestamp' }),
    qrCodeUrl: text('qr_code_url'),

    status: text('status', { enum: ['active', 'expired', 'revoked'] }).default('active'),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    userIdx: index('idx_cards_user').on(table.userId),
    hashIdx: uniqueIndex('idx_cards_hash').on(table.cardHash),
  })
);



// ----------------------------------------------------------------------
// Entity: userNotificationSettings
// ----------------------------------------------------------------------
export const userNotificationSettings = sqliteTable(
  'user_notification_settings',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(), // 'activity_comments', 'application_news', etc.
    enabled: integer('enabled', { mode: 'boolean' }).default(true).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    userTypeUnique: uniqueIndex('idx_notifications_user_type').on(table.userId, table.type),
  })
);

