// ======================================================================
// 00. HEADER
// ======================================================================
/**
 * Copyright 2025 ASPPIBRA – Associação dos Proprietários
 * e Possuidores de Imóveis no Brasil.
 *
 * Project: Governance System (ASPPIBRA DAO)
 * Role: Database Schema
 * ORM: Drizzle ORM
 * Database: SQLite / Cloudflare D1
 *
 * Architectural principle:
 * - Organize tables by domain responsibility.
 * - Preserve domain boundaries.
 * - Keep table definitions separate from ORM relations.
 * - This file is intentionally structured for future fragmentation.
 * 
 * Declaration ordering:
 * 1. Shared constants
 * 2. Aggregate roots
 * 3. Direct child entities
 * 4. Supporting entities
 * 5. Cross-domain entities
 * 6. Cross-cutting infrastructure
 * 7. Relations
 */

/**
 * DOMAIN DEPENDENCY MAP
 *
 * 10. USER / ACTOR
 *   Base identity aggregate.
 *
 * 20. AUTHENTICATION
 *   Depends on: USER / ACTOR
 *   References: WEB3 IDENTITY
 *   Emits: SECURITY / AUDIT events
 *
 * 30. AUTHORIZATION
 *   Depends on: USER / ACTOR
 *
 * 40. CIVIL IDENTITY / KYC
 *   Depends on: USER / ACTOR
 *
 * 50. SSI / DIGITAL IDENTITY
 *   Depends on: USER / ACTOR
 *
 * 60. ORGANIZATIONS
 *   Depends on: USER / ACTOR
 *
 * 70. WEB3 IDENTITY
 *   Depends on: USER / ACTOR
 *
 * 80. SOCIAL
 *   Depends on: USER / ACTOR
 *
 * 90. COMMUNICATION
 *   Depends on: USER / ACTOR
 *
 * 100. GOVERNANCE
 *   Depends on: USER / ACTOR, ORGANIZATIONS
 *
 * 110. CONTRIBUTIONS
 *   Depends on: USER / ACTOR
 *
 * 120. CONTRACTS / OBLIGATIONS
 *   Depends on: USER / ACTOR
 *
 * 130. FINANCE / TREASURY
 *   Depends on: USER / ACTOR
 *
 * 140. REAL ESTATE / RWA
 *   Depends on: USER / ACTOR
 *   References: WEB3 IDENTITY, ORGANIZATIONS
 *
 * 150. DEVOPS / INTEGRATIONS
 *   Cross-cutting integration subsystem
 *
 * 160. COMPLIANCE / PRIVACY
 *   Depends on: USER / ACTOR
 *   Emits: SECURITY / AUDIT events
 *
 * 170. SECURITY / AUDIT
 *   Cross-cutting audit & security logging
 *   References multiple domains
 *
 * 180. INFRASTRUCTURE
 *   Cross-cutting asynchronous event outbox
 *   Supports multiple domains
 */

// ======================================================================
// 01. IMPORTS
// ======================================================================
import {
  sqliteTable,
  text,
  integer,
  index,
  uniqueIndex,
  primaryKey,
  check,
} from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';
import type { EmailEventMetadata } from '../dto/email-event';

// ======================================================================
// 02. DOMAIN CONSTANTS
// ======================================================================
export const USER_ROLES    = ['citizen', 'partner', 'admin', 'system', 'dev'] as const;
export const USER_STATUS   = ['pending_setup', 'active', 'suspended', 'locked', 'disabled'] as const;
export const AUTH_TYPES    = ['password', 'totp', 'webauthn', 'recovery_code', 'wallet'] as const;
export const CONSENT_TYPES = ['terms_of_service', 'privacy_policy', 'marketing', 'data_processing', 'cookies'] as const;
export const SECURITY_EVENT_TYPES = [
  'authentication_succeeded',
  'authentication_failed',
  'credential_created',
  'credential_verified',
  'credential_revoked',
  'password_changed',
  'password_reset_requested',
  'passkey_registered',
  'passkey_used',
  'totp_enabled',
  'totp_verified',
  'wallet_linked',
  'wallet_verified',
  'wallet_authenticated',
  'wallet_suspended',
  'wallet_revoked',
  'wallet_unlinked',
  'recovery_code_consumed',
  'account_locked',
  'account_unlocked',
  'auth_epoch_incremented',
] as const;

// ======================================================================
// 10. USER / ACTOR
//
// Owner:
//   User / Actor subsystem
// Depends on:
//   None (Base aggregate)
// References:
//   N/A
// Emits:
//   Security / Audit events
// ======================================================================

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

    // Public non-sequential identifier (CUID/UUID/ULID)
    publicId: text('public_id').notNull().unique().$defaultFn(() => crypto.randomUUID()),

    // Optional classification of the account subject
    subjectType: text('subject_type', {
      enum: ['human', 'service', 'system'],
    }).notNull().default('human'),

    // ================================================================
    // PRIMARY CONTACT
    // ================================================================

    email:           text('email'),
    emailNormalized: text('email_normalized').unique(),
    emailVerifiedAt: integer('email_verified_at', { mode: 'timestamp' }),
    emailChangedAt:  integer('email_changed_at', { mode: 'timestamp' }),

    // ================================================================
    // ACCOUNT SECURITY / LIFECYCLE
    // ================================================================

    // Invalidação global de sessão (incrementar em password reset, etc)
    authEpoch: integer('auth_epoch').default(1).notNull(),

    status:    text('status', { enum: USER_STATUS }).default('pending_setup').notNull(),
    statusChangedAt: integer('status_changed_at', { mode: 'timestamp' }),
    lockedAt:  integer('locked_at', { mode: 'timestamp' }),
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
    statusIdx:    index('idx_users_status').on(table.status),
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


// ======================================================================
// 20. AUTHENTICATION
//
// Owner:
//   Authentication subsystem
// Depends on:
//   USER / ACTOR
// References:
//   WEB3 IDENTITY
// Emits:
//   SECURITY / AUDIT events
// ======================================================================

// ----------------------------------------------------------------------
// Entity: userAuthenticators
// ----------------------------------------------------------------------
export const userAuthenticators = sqliteTable(
  'user_authenticators',
  {
    id: text('id').primaryKey(), // UUID v4

    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    type: text('type', { enum: AUTH_TYPES }).notNull(),
    label: text('label'),

    verifiedAt: integer('verified_at', { mode: 'timestamp' }),
    lastUsedAt: integer('last_used_at', { mode: 'timestamp' }),
    
    revokedAt: integer('revoked_at', { mode: 'timestamp' }),
    revokedBy: integer('revoked_by').references(() => users.id, { onDelete: 'set null' }),
    revocationReason: text('revocation_reason'),

    // SECURITY:
    // metadata is non-secret operational metadata only.
    // NEVER store:
    // password hashes, TOTP secrets, private keys,
    // recovery codes, session tokens, or bearer credentials.
    metadata: text('metadata', { mode: 'json' }),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull().$onUpdateFn(() => new Date()),
  },
  (table) => ({
    userTypeRevokedIdx: index('idx_authenticators_user_type_revoked').on(table.userId, table.type, table.revokedAt),
    typeCheck: check('user_authenticators_type_check', sql`${table.type} IN ('password', 'totp', 'webauthn', 'recovery_code', 'wallet')`),
  })
);

// ----------------------------------------------------------------------
// Entity: passwordCredentials
// ----------------------------------------------------------------------
export const passwordCredentials = sqliteTable('password_credentials', {
  authenticatorId: text('authenticator_id')
    .primaryKey()
    .references(() => userAuthenticators.id, { onDelete: 'cascade' }),
  passwordHash: text('password_hash').notNull(), // Argon2id hash com parâmetros embutidos
});

// ----------------------------------------------------------------------
// Entity: webauthnCredentials
// ----------------------------------------------------------------------
export const webauthnCredentials = sqliteTable('webauthn_credentials', {
  authenticatorId: text('authenticator_id')
    .primaryKey()
    .references(() => userAuthenticators.id, { onDelete: 'cascade' }),
  credentialId: text('credential_id').notNull().unique(),
  publicKeyCose: text('public_key_cose').notNull(),
  rpId: text('rp_id').notNull(),
  userHandle: text('user_handle'), // nullable pois nem todo webauthn é discoverable/resident
  signCount: integer('sign_count').notNull().default(0),
  transports: text('transports', { mode: 'json' }),
  backupEligible: integer('backup_eligible', { mode: 'boolean' }).notNull(),
  backupState: integer('backup_state', { mode: 'boolean' }).notNull(),
  uvInitialized: integer('uv_initialized', { mode: 'boolean' }).notNull(),
  aaguid: text('aaguid'),
  attestationFormat: text('attestation_format'),
  attestationObject: text('attestation_object'),
});

// ----------------------------------------------------------------------
// Entity: totpCredentials
// ----------------------------------------------------------------------
export const totpCredentials = sqliteTable('totp_credentials', {
  authenticatorId: text('authenticator_id')
    .primaryKey()
    .references(() => userAuthenticators.id, { onDelete: 'cascade' }),
  encryptedTotpSecret: text('encrypted_totp_secret').notNull(),
  algorithm: text('algorithm').notNull().default('SHA1'),
  digits: integer('digits').notNull().default(6),
  period: integer('period').notNull().default(30),
}, (table) => ({
  digitsCheck: check('totp_digits_check', sql`${table.digits} IN (6, 8)`),
  periodCheck: check('totp_period_check', sql`${table.period} IN (30, 60)`),
  algorithmCheck: check('totp_algorithm_check', sql`${table.algorithm} IN ('SHA1', 'SHA256', 'SHA512')`),
}));

// ----------------------------------------------------------------------
// Entity: recoverySets
// ----------------------------------------------------------------------
export const recoverySets = sqliteTable('recovery_sets', {
  id: text('id').primaryKey(),
  authenticatorId: text('authenticator_id')
    .unique()
    .references(() => userAuthenticators.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
  revokedAt: integer('revoked_at', { mode: 'timestamp' }),
});

// ----------------------------------------------------------------------
// Entity: recoveryCredentials
// ----------------------------------------------------------------------
export const recoveryCredentials = sqliteTable('recovery_credentials', {
  id: text('id').primaryKey(),
  recoverySetId: text('recovery_set_id')
    .references(() => recoverySets.id, { onDelete: 'cascade' })
    .notNull(),
  codeHash: text('code_hash').notNull(), // Argon2id hash
  consumedAt: integer('consumed_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
}, (table) => ({
  recoverySetIdx: index('idx_recovery_credentials_set').on(table.recoverySetId),
}));

// ----------------------------------------------------------------------
// Entity: passwordResets
// ----------------------------------------------------------------------
export const passwordResets = sqliteTable('password_resets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  used: integer('used', { mode: 'boolean' }).default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// ----------------------------------------------------------------------
// Entity: userSessions
// ----------------------------------------------------------------------
export const userSessions = sqliteTable(
  'user_sessions',
  {
    id: text('id').primaryKey(), // UUID da sessão
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    jti: text('jti').notNull(),
    ip: text('ip'),
    userAgent: text('user_agent'),
    refreshTokenHash: text('refresh_token_hash').notNull(),
    aal: integer('aal').default(1),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    revoked: integer('revoked', { mode: 'boolean' }).default(false),
  },
  (table) => ({
    userIdIdx: index('idx_sessions_user').on(table.userId),
  })
);

// ----------------------------------------------------------------------
// Entity: authChallenges
// ----------------------------------------------------------------------
export const authChallenges = sqliteTable('auth_challenges', {
  id: text('id').primaryKey(), // UUID do desafio
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  challenge: text('challenge').notNull(),
  challengeType: text('challenge_type').notNull(), // 'ssh', 'totp', 'webauthn', 'siwe'
  used: integer('used', { mode: 'boolean' }).default(false),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
});

// ----------------------------------------------------------------------
// Entity: walletAuthenticators
// ----------------------------------------------------------------------
export const walletAuthenticators = sqliteTable('wallet_authenticators', {
  authenticatorId: text('authenticator_id')
    .primaryKey()
    .references(() => userAuthenticators.id, { onDelete: 'cascade' }),
  walletId: integer('wallet_id').unique().references(() => wallets.id, { onDelete: 'restrict' }).notNull(),
  protocol: text('protocol', { enum: ['siwe', 'eip191', 'eip712', 'eip1271'] }).notNull().default('siwe'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull().$onUpdateFn(() => new Date()),
});

// ======================================================================
// 30. AUTHORIZATION
//
// Owner:
//   Authorization subsystem (RBAC)
// Depends on:
//   USER / ACTOR
// References:
//   N/A
// Emits:
//   SECURITY / AUDIT events
// ======================================================================

// ----------------------------------------------------------------------
// Entity: roles
// ----------------------------------------------------------------------
export const roles = sqliteTable('roles', {
  id:          integer('id').primaryKey({ autoIncrement: true }),
  key:         text('key').notNull().unique(), // 'admin', 'citizen', 'partner', 'auditor'...
  displayName: text('display_name').notNull(),
  description: text('description'),
  status:      text('status', { enum: ['active', 'disabled', 'archived'] }).default('active').notNull(),
  isSystem:    integer('is_system', { mode: 'boolean' }).default(false).notNull(), // true = não pode ser deletado
  version:     integer('version').default(1).notNull(),
  createdBy:   integer('created_by').references(() => users.id, { onDelete: 'set null' }),
  createdAt:   integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  updatedAt:   integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull().$onUpdateFn(() => new Date()),
}, (table) => ({
  statusIdx: index('idx_roles_status').on(table.status),
  versionCheck: check('roles_version_check', sql`${table.version} >= 1`),
  statusCheck: check('roles_status_check', sql`${table.status} IN ('active', 'disabled', 'archived')`),
}));

// ----------------------------------------------------------------------
// Entity: userRoles
// ----------------------------------------------------------------------
export const userRoles = sqliteTable(
  'user_roles',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    roleId: integer('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'restrict' }),

    // Auditoria da concessão
    grantSource: text('grant_source', { enum: ['admin', 'system', 'migration', 'policy'] }).notNull().default('admin'),
    grantedBy: integer('granted_by').references(() => users.id, { onDelete: 'set null' }),
    grantReason: text('grant_reason'),
    grantedAt: integer('granted_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),

    // Lifecycle da concessão
    expiresAt: integer('expires_at', { mode: 'timestamp' }),
    
    revokedBy: integer('revoked_by').references(() => users.id, { onDelete: 'set null' }),
    revokedAt: integer('revoked_at', { mode: 'timestamp' }),
    revocationReason: text('revocation_reason'),

    version: integer('version').default(1).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull().$onUpdateFn(() => new Date()),
  },
  (table) => ({
    userRoleLifecycleIdx: index('idx_user_roles_user_role_lifecycle').on(table.userId, table.roleId, table.revokedAt, table.expiresAt),
    roleLifecycleIdx: index('idx_user_roles_role_lifecycle').on(table.roleId, table.revokedAt, table.expiresAt),
    grantedByIdx: index('idx_user_roles_granted_by').on(table.grantedBy),
    revokedByIdx: index('idx_user_roles_revoked_by').on(table.revokedBy),
    
    expiresAfterGrantCheck: check('user_roles_expires_after_grant', sql`${table.expiresAt} IS NULL OR ${table.expiresAt} > ${table.grantedAt}`),
    revokedAfterGrantCheck: check('user_roles_revoked_after_grant', sql`${table.revokedAt} IS NULL OR ${table.revokedAt} >= ${table.grantedAt}`),
    revocationCoherenceCheck: check('user_roles_revocation_coherence', sql`${table.revokedBy} IS NULL OR ${table.revokedAt} IS NOT NULL`),
    versionCheck: check('user_roles_version_check', sql`${table.version} >= 1`),
    grantSourceCheck: check('user_roles_grant_source_check', sql`${table.grantSource} IN ('admin', 'system', 'migration', 'policy')`),
  })
);

// ======================================================================
// 40. CIVIL IDENTITY / KYC
//
// Owner:
//   Civil Identity subsystem
// Depends on:
//   USER / ACTOR
// References:
//   N/A
// Emits:
//   N/A
// ======================================================================

// ----------------------------------------------------------------------
// Entity: citizens
// ----------------------------------------------------------------------
export const citizens = sqliteTable(
  'citizens',
  {
    userId: integer('user_id')
      .primaryKey()
      .references(() => users.id, { onDelete: 'cascade' }),

    legalFirstName: text('legal_first_name'),
    legalLastName: text('legal_last_name'),
    nationalityCode: text('nationality_code'),
    birthDate: text('birth_date'), // YYYY-MM-DD

    maritalStatus: text('marital_status', {
      enum: ['single', 'married', 'divorced', 'widowed', 'stable_union', 'separated'],
    }),

    civilStatus: text('civil_status', {
      enum: ['pending', 'verified', 'suspended', 'revoked'],
    })
      .notNull()
      .default('pending'),

    statusChangedAt: integer('status_changed_at', { mode: 'timestamp' }),
    verifiedAt: integer('verified_at', { mode: 'timestamp' }),
    verifiedBy: integer('verified_by').references(() => users.id, { onDelete: 'set null' }),
    
    version: integer('version').notNull().default(1),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull().$onUpdateFn(() => new Date()),
  },
  (table) => ({
    statusCheck: check('citizens_status_check', sql`${table.civilStatus} IN ('pending', 'verified', 'suspended', 'revoked')`),
  })
);

// ----------------------------------------------------------------------
// Entity: identityDocuments
// ----------------------------------------------------------------------
export const identityDocuments = sqliteTable(
  'identity_documents',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    
    documentType: text('document_type', { enum: ['cpf', 'rg', 'passport', 'cnh'] }).notNull(),
    countryCode: text('country_code').default('BR').notNull(),
    
    // HMAC(secret, number) para lookup seguro sem permitir enumeração
    numberLookupHash: text('number_lookup_hash').notNull(),
    encryptedNumber: text('encrypted_number').notNull(),
    last4: text('last4'),
    documentHash: text('document_hash'), // Hash do PDF/Imagem enviado

    issuingAuthority: text('issuing_authority'),
    issuedAt: text('issued_at'), // YYYY-MM-DD
    expiresAt: text('expires_at'), // YYYY-MM-DD
    
    source: text('source', { enum: ['government', 'manual_upload', 'kyc_provider', 'admin', 'import'] }).notNull(),
    sourceReference: text('source_reference'),

    verificationStatus: text('verification_status', { enum: ['pending', 'verified', 'rejected'] }).notNull().default('pending'),
    verifiedAt: integer('verified_at', { mode: 'timestamp' }),
    verifiedBy: integer('verified_by').references(() => users.id, { onDelete: 'set null' }),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull().$onUpdateFn(() => new Date()),
  },
  (table) => ({
    userIdx: index('idx_identity_docs_user').on(table.userId),
    lookupHashIdx: index('idx_identity_docs_hash').on(table.numberLookupHash),
  })
);

// ----------------------------------------------------------------------
// Entity: kycVerifications
// ----------------------------------------------------------------------
export const kycVerifications = sqliteTable(
  'kyc_verifications',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
      
    verificationVersion: integer('verification_version').notNull().default(1),
    verificationLevel: text('verification_level', { enum: ['basic', 'enhanced', 'institutional'] }).notNull(),
    status: text('status', { enum: ['submitted', 'under_review', 'approved', 'rejected', 'expired'] }).notNull(),
    provider: text('provider').notNull(),

    riskScore: integer('risk_score'),
    riskModel: text('risk_model'),
    riskModelVersion: text('risk_model_version'),
    
    rejectionReason: text('rejection_reason'),
    metadata: text('metadata', { mode: 'json' }),

    reviewedBy: integer('reviewed_by').references(() => users.id, { onDelete: 'set null' }),

    startedAt: integer('started_at', { mode: 'timestamp' }).notNull(),
    completedAt: integer('completed_at', { mode: 'timestamp' }),
    expiresAt: integer('expires_at', { mode: 'timestamp' }),
    
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull().$onUpdateFn(() => new Date()),
  },
  (table) => ({
    userIdx: index('idx_kyc_user').on(table.userId),
    statusIdx: index('idx_kyc_status').on(table.status),
  })
);

// ======================================================================
// 50. SSI / DIGITAL IDENTITY
//
// Owner:
//   SSI subsystem
// Depends on:
//   USER / ACTOR
// References:
//   N/A
// Emits:
//   N/A
// ======================================================================

// ----------------------------------------------------------------------
// Entity: secureVaults
// ----------------------------------------------------------------------
export const secureVaults = sqliteTable(
  'secure_vaults',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
      
    purpose: text('purpose').notNull(), // Ex: 'wallet_mnemonic', 'recovery_material'
    
    ciphertext: text('ciphertext').notNull(),
    nonce: text('nonce').notNull(),
    authTag: text('auth_tag').notNull(),
    encryptionAlgorithm: text('encryption_algorithm', { enum: ['AES-256-GCM', 'XChaCha20-Poly1305'] }).notNull(),
    keyVersion: integer('key_version').notNull().default(1),
    keyReference: text('key_reference').notNull(), // Aponta para o KMS / Key Management

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
    rotatedAt: integer('rotated_at', { mode: 'timestamp' }),
    revokedAt: integer('revoked_at', { mode: 'timestamp' }),
  },
  (table) => ({
    // Índice UNIQUE considerando a versão, permitindo preservar histórico seguro
    userPurposeVersionUnq: uniqueIndex('uq_secure_vaults_user_purpose_version').on(table.userId, table.purpose, table.keyVersion),
  })
);

// ----------------------------------------------------------------------
// Entity: didIdentities
// ----------------------------------------------------------------------
export const didIdentities = sqliteTable(
  'did_identities',
  {
    id: text('id').primaryKey(), // UUID
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
      
    did: text('did').notNull().unique(),
    method: text('method').notNull(),
    controller: text('controller').notNull(),
    status: text('status', { enum: ['active', 'suspended', 'revoked'] }).notNull().default('active'),
    
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull().$onUpdateFn(() => new Date()),
    revokedAt: integer('revoked_at', { mode: 'timestamp' }),
  },
  (table) => ({
    userIdx: index('idx_did_identities_user').on(table.userId),
    statusCheck: check('did_identities_status_check', sql`${table.status} IN ('active', 'suspended', 'revoked')`),
  })
);

// ----------------------------------------------------------------------
// Entity: didVerificationMethods
// ----------------------------------------------------------------------
export const didVerificationMethods = sqliteTable(
  'did_verification_methods',
  {
    id: text('id').primaryKey(), // Normalmente o DID URL da chave: did:example:123#key-1
    didId: text('did_id')
      .notNull()
      .references(() => didIdentities.id, { onDelete: 'cascade' }),
      
    type: text('type').notNull(),
    controllerDid: text('controller_did').notNull(),
    publicKeyMultibase: text('public_key_multibase').notNull(),
    purpose: text('purpose', { enum: ['authentication', 'assertionMethod', 'keyAgreement', 'capabilityInvocation', 'capabilityDelegation'] }).notNull(),
    status: text('status', { enum: ['active', 'suspended', 'revoked'] }).notNull().default('active'),
    
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
    revokedAt: integer('revoked_at', { mode: 'timestamp' }),
  },
  (table) => ({
    didIdx: index('idx_did_verification_methods_did').on(table.didId),
    statusCheck: check('did_verification_methods_status_check', sql`${table.status} IN ('active', 'suspended', 'revoked')`),
  })
);

// ======================================================================
// 60. ORGANIZATIONS
//
// Owner:
//   Organizations subsystem
// Depends on:
//   USER / ACTOR
// References:
//   N/A
// Emits:
//   N/A
// ======================================================================

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

// ======================================================================
// 70. WEB3 IDENTITY
//
// Owner:
//   Web3 Identity subsystem
// Depends on:
//   USER / ACTOR
// References:
//   N/A
// Emits:
//   SECURITY / AUDIT events
// ======================================================================

// ----------------------------------------------------------------------
// Entity: wallets
// ----------------------------------------------------------------------
export const wallets = sqliteTable(
  'wallets',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    chainNamespace: text('chain_namespace', { enum: ['eip155'] }).notNull().default('eip155'),
    chainId: integer('chain_id').notNull(),
    walletType: text('wallet_type', { enum: ['eoa', 'smart_contract'] }).notNull().default('eoa'),

    address: text('address').notNull(),
    addressNormalized: text('address_normalized').notNull(),
    label: text('label'),

    status: text('status', { enum: ['pending', 'active', 'suspended', 'revoked'] }).notNull().default('pending'),
    verificationStatus: text('verification_status', { enum: ['pending', 'verified', 'rejected'] }).notNull().default('pending'),
    isPrimary: integer('is_primary', { mode: 'boolean' }).notNull().default(false),

    linkedAt: integer('linked_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
    verifiedAt: integer('verified_at', { mode: 'timestamp' }),
    verifiedBy: integer('verified_by').references(() => users.id, { onDelete: 'set null' }),

    suspendedAt: integer('suspended_at', { mode: 'timestamp' }),
    revokedAt: integer('revoked_at', { mode: 'timestamp' }),
    unlinkedAt: integer('unlinked_at', { mode: 'timestamp' }),
    lastAuthenticatedAt: integer('last_authenticated_at', { mode: 'timestamp' }),

    version: integer('version').notNull().default(1),
    metadata: text('metadata', { mode: 'json' }),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull().$onUpdateFn(() => new Date()),
  },
  (table) => ({
    addressUnique: uniqueIndex('uq_wallets_chain_address_normalized').on(table.chainNamespace, table.chainId, table.addressNormalized),
    primaryUnique: uniqueIndex('uq_wallets_primary_user').on(table.userId).where(sql`${table.isPrimary} = true`),
    userStatusIdx: index('idx_wallets_user_status').on(table.userId, table.status),
    verificationIdx: index('idx_wallets_verification_status').on(table.verificationStatus),
    chainStatusIdx: index('idx_wallets_chain_status').on(table.chainNamespace, table.chainId, table.status),
    lastAuthIdx: index('idx_wallets_last_authenticated').on(table.lastAuthenticatedAt),

    chainCheck: check('wallets_chain_id_check', sql`${table.chainId} > 0`),
    primaryActiveCheck: check('wallets_primary_active_check', sql`${table.isPrimary} = false OR ${table.status} = 'active'`),
    verifiedAtCheck: check('wallets_verified_at_check', sql`${table.verificationStatus} != 'verified' OR ${table.verifiedAt} IS NOT NULL`),
    revokedAtCheck: check('wallets_revoked_at_check', sql`${table.status} != 'revoked' OR ${table.revokedAt} IS NOT NULL`),
    
    verifiedAfterLinkedCheck: check('wallets_verified_after_linked', sql`${table.verifiedAt} IS NULL OR ${table.verifiedAt} >= ${table.linkedAt}`),
    suspendedAfterLinkedCheck: check('wallets_suspended_after_linked', sql`${table.suspendedAt} IS NULL OR ${table.suspendedAt} >= ${table.linkedAt}`),
    revokedAfterLinkedCheck: check('wallets_revoked_after_linked', sql`${table.revokedAt} IS NULL OR ${table.revokedAt} >= ${table.linkedAt}`),
  })
);

// ======================================================================
// 80. SOCIAL
//
// Owner:
//   Social interactions subsystem
// Depends on:
//   USER / ACTOR
// References:
//   N/A
// Emits:
//   N/A
// ======================================================================

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

// ======================================================================
// 90. COMMUNICATION
//
// Owner:
//   Omnichannel communication subsystem
// Depends on:
//   USER / ACTOR
// References:
//   N/A
// Emits:
//   N/A
// ======================================================================

// ----------------------------------------------------------------------
// Entity: notifications
// ----------------------------------------------------------------------
export const notifications = sqliteTable(
  'notifications',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').notNull(), // 'system', 'payment', 'social', etc.
    category: text('category').notNull(), // 'Communication', 'Project UI', etc.
    title: text('title').notNull(),
    message: text('message'), // Corpo detalhado em HTML ou Plain
    data: text('data', { mode: 'json' }), // Referências para outras entidades (metadata)
    isRead: integer('is_read', { mode: 'boolean' }).default(false).notNull(),
    readAt: integer('read_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    userIdIdx: index('idx_notifications_user_id').on(table.userId),
    isReadIdx: index('idx_notifications_is_read').on(table.isRead),
    createdAtIdx: index('idx_notifications_created_at').on(table.createdAt),
  })
);

// ----------------------------------------------------------------------
// Entity: emailAccounts
// ----------------------------------------------------------------------
export const emailAccounts = sqliteTable('email_accounts', {
  id: text('id').primaryKey(),
  department: text('department'),
  email: text('email').notNull().unique(),
  displayName: text('display_name'),
  type: text('type', {
    enum: [
      'Atendimento',
      'Financeiro',
      'Juridico',
      'Sistema',
      'Marketing',
      'Governança',
      'Newsletter',
      'Diretoria',
    ],
  }),
  criticality: text('criticality', { enum: ['Baixa', 'Média', 'Alta', 'Crítica'] }),
  providerInbound: text('provider_inbound').default('cloudflare'),
  providerOutbound: text('provider_outbound').default('resend'),
  signatureHtml: text('signature_html'),
  replyTo: text('reply_to'),
  color: text('color'),
  status: text('status', {
    enum: ['Provisionando', 'Ativa', 'Erro', 'Suspensa', 'Arquivada', 'Desativada'],
  }).default('Provisionando'),
  healthStatus: text('health_status', { enum: ['Verde', 'Amarelo', 'Vermelho', 'Cinza'] }).default(
    'Cinza'
  ),
  usedSpaceMb: integer('used_space_mb').default(0),
  totalMessages: integer('total_messages').default(0),
  totalAttachments: integer('total_attachments').default(0),
  lastCleanedAt: integer('last_cleaned_at', { mode: 'timestamp' }),
  retentionDays: integer('retention_days').default(365),
  ownerUserId: text('owner_user_id'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

// ----------------------------------------------------------------------
// Entity: emailThreads
// ----------------------------------------------------------------------
export const emailThreads = sqliteTable('email_threads', {
  id: text('id').primaryKey(),
  accountId: text('account_id')
    .references(() => emailAccounts.id)
    .notNull(),
  subject: text('subject').notNull(),
  participants: text('participants', { mode: 'json' }), // array of emails
  messageCount: integer('message_count').default(1),
  status: text('status').default('active'),
  lastMessageDate: integer('last_message_date', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// ----------------------------------------------------------------------
// Entity: emailLabels
// ----------------------------------------------------------------------
export const emailLabels = sqliteTable('email_labels', {
  id: text('id').primaryKey(),
  accountId: text('account_id')
    .references(() => emailAccounts.id)
    .notNull(),
  name: text('name').notNull(),
  color: text('color'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// ----------------------------------------------------------------------
// Entity: emails
// ----------------------------------------------------------------------
export const emails = sqliteTable(
  'emails',
  {
    id: text('id').primaryKey(), // UUID v4 ou ID do Resend
    accountId: text('account_id').references(() => emailAccounts.id),
    threadId: text('thread_id').references(() => emailThreads.id),
    direction: text('direction', { enum: ['inbound', 'outbound'] })
      .notNull()
      .default('outbound'),
    sender: text('sender').notNull(),
    recipient: text('recipient').notNull(),
    cc: text('cc'),
    bcc: text('bcc'),
    subject: text('subject').notNull(),
    bodyHtml: text('body_html'),
    bodyText: text('body_text'),
    status: text('status', {
      enum: [
        'sent',
        'failed',
        'unread',
        'read',
        'draft',
        'queued',
        'processing',
        'sending',
        'bounced',
        'delivered',
      ],
    })
      .notNull()
      .default('sent'),
    priority: text('priority', { enum: ['low', 'normal', 'high', 'urgent', 'critical'] }).default(
      'normal'
    ),
    messageId: text('message_id').unique(), // Resend Message ID ou Inbound Message-ID
    inReplyTo: text('in_reply_to'), // RFC 5322 In-Reply-To
    references: text('references', { mode: 'json' }).$type<string[]>(), // RFC 5322 References
    provider: text('provider').default('cloudflare'),
    deliveredAt: integer('delivered_at', { mode: 'timestamp' }),
    receivedAt: integer('received_at', { mode: 'timestamp' }),
    processedAt: integer('processed_at', { mode: 'timestamp' }),
    openedAt: integer('opened_at', { mode: 'timestamp' }),
    bouncedAt: integer('bounced_at', { mode: 'timestamp' }),
    errorMessage: text('error_message'),
    providerPayload: text('provider_payload', { mode: 'json' }),
    authMetadata: text('auth_metadata', { mode: 'json' }).$type<Record<string, any>>(), // DKIM, SPF, DMARC, ARC
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    accountIdIdx: index('idx_emails_account_id').on(table.accountId),
    threadIdIdx: index('idx_emails_thread_id').on(table.threadId),
    createdAtIdx: index('idx_emails_created_at').on(table.createdAt),
    messageIdIdx: index('idx_emails_message_id').on(table.messageId),
  })
);

// ----------------------------------------------------------------------
// Entity: emailMessageLabels
// ----------------------------------------------------------------------
export const emailMessageLabels = sqliteTable(
  'email_message_labels',
  {
    messageId: text('message_id')
      .references(() => emails.id)
      .notNull(),
    labelId: text('label_id')
      .references(() => emailLabels.id)
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.messageId, t.labelId] }),
  })
);

// ----------------------------------------------------------------------
// Entity: emailAttachments
// ----------------------------------------------------------------------
export const emailAttachments = sqliteTable('email_attachments', {
  id: text('id').primaryKey(),
  emailId: text('email_id')
    .references(() => emails.id)
    .notNull(),
  name: text('name').notNull(),
  mimeType: text('mime_type').notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  r2Key: text('r2_key').notNull(),
  publicUrl: text('public_url'),
  contentDisposition: text('content_disposition'),
  inline: integer('inline', { mode: 'boolean' }).default(false),
  cid: text('cid'),
  sha256: text('sha256'),
  virusStatus: text('virus_status', { enum: ['pending', 'clean', 'infected'] }).default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// ----------------------------------------------------------------------
// Entity: emailEvents
// ----------------------------------------------------------------------
export const emailEvents = sqliteTable('email_events', {
  id: text('id').primaryKey(),
  emailId: text('email_id').references(() => emails.id),
  messageId: text('message_id'),
  event: text('event').notNull(),
  source: text('source').notNull(),
  provider: text('provider').default('cloudflare'),
  severity: text('severity', { enum: ['info', 'warning', 'error', 'critical'] }).default('info'),
  requestId: text('request_id'),
  correlationId: text('correlation_id'),
  queueMessageId: text('queue_message_id'),
  traceId: text('trace_id'),
  spanId: text('span_id'),
  workerVersion: text('worker_version'),
  durationMs: integer('duration_ms'),
  metadata: text('metadata', { mode: 'json' }).$type<EmailEventMetadata>(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// ----------------------------------------------------------------------
// Entity: chatConversations
// ----------------------------------------------------------------------
export const chatConversations = sqliteTable('chat_conversations', {
  id: text('id').primaryKey(),
  type: text('type', { enum: ['single', 'group'] }).notNull(),
  category: text('category', { enum: ['ai', 'ticket', 'p2p', 'dao', 'system'] }).notNull(),
  title: text('title'),
  description: text('description'),
  ownerId: integer('owner_id').references(() => users.id),
  status: text('status').default('active'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
});

// ----------------------------------------------------------------------
// Entity: chatParticipants
// ----------------------------------------------------------------------
export const chatParticipants = sqliteTable(
  'chat_participants',
  {
    conversationId: text('conversation_id')
      .references(() => chatConversations.id)
      .notNull(),
    userId: integer('user_id')
      .references(() => users.id)
      .notNull(),
    role: text('role').default('member'),
    joinedAt: integer('joined_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
    lastReadMessageId: text('last_read_message_id'),
    lastReadAt: integer('last_read_at', { mode: 'timestamp' }),
    muted: integer('muted', { mode: 'boolean' }).default(false),
    archived: integer('archived', { mode: 'boolean' }).default(false),
    pinned: integer('pinned', { mode: 'boolean' }).default(false),
    presence: text('presence', { enum: ['online', 'away', 'offline'] }).default('offline'),
    lastSeen: integer('last_seen', { mode: 'timestamp' }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.conversationId, t.userId] }),
    convoIdx: index('idx_chat_participants_convo').on(t.conversationId),
    userIdx: index('idx_chat_participants_user').on(t.userId),
  })
);

// ----------------------------------------------------------------------
// Entity: chatMessages
// ----------------------------------------------------------------------
export const chatMessages = sqliteTable(
  'chat_messages',
  {
    id: text('id').primaryKey(),
    conversationId: text('conversation_id')
      .references(() => chatConversations.id)
      .notNull(),
    senderId: integer('sender_id').references(() => users.id), // Nullable for system messages
    type: text('type').default('text'),
    body: text('body').notNull(),
    status: text('status').default('sent'), // sent, delivered, read, edited, deleted
    replyTo: text('reply_to'), // Self-referencing chatMessages.id handled at app level to avoid circular deps
    metadata: text('metadata', { mode: 'json' }),
    version: integer('version').default(1),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
    editedAt: integer('edited_at', { mode: 'timestamp' }),
    deletedAt: integer('deleted_at', { mode: 'timestamp' }),
  },
  (t) => ({
    convoIdx: index('idx_chat_messages_convo').on(t.conversationId),
    createdAtIdx: index('idx_chat_messages_created_at').on(t.createdAt),
  })
);

// ----------------------------------------------------------------------
// Entity: chatAttachments
// ----------------------------------------------------------------------
export const chatAttachments = sqliteTable('chat_attachments', {
  id: text('id').primaryKey(),
  messageId: text('message_id')
    .references(() => chatMessages.id)
    .notNull(),
  r2Key: text('r2_key').notNull(),
  mime: text('mime'),
  size: integer('size'),
  width: integer('width'),
  height: integer('height'),
  duration: integer('duration'), // Para áudios/vídeos
});

// ----------------------------------------------------------------------
// Entity: chatReadReceipts
// ----------------------------------------------------------------------
export const chatReadReceipts = sqliteTable(
  'chat_read_receipts',
  {
    messageId: text('message_id')
      .references(() => chatMessages.id)
      .notNull(),
    userId: integer('user_id')
      .references(() => users.id)
      .notNull(),
    readAt: integer('read_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.messageId, t.userId] }),
  })
);

// ----------------------------------------------------------------------
// Entity: chatEvents
// ----------------------------------------------------------------------
export const chatEvents = sqliteTable('chat_events', {
  id: text('id').primaryKey(),
  conversationId: text('conversation_id')
    .references(() => chatConversations.id)
    .notNull(),
  event: text('event').notNull(),
  userId: integer('user_id').references(() => users.id), // Quem disparou o evento
  metadata: text('metadata', { mode: 'json' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// ======================================================================
// 100. GOVERNANCE
//
// Owner:
//   DAO Governance subsystem
// Depends on:
//   USER / ACTOR
// References:
//   ORGANIZATIONS
// Emits:
//   N/A
// ======================================================================

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

// ======================================================================
// 110. CONTRIBUTIONS
//
// Owner:
//   Contributions subsystem
// Depends on:
//   USER / ACTOR
// References:
//   N/A
// Emits:
//   N/A
// ======================================================================

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

// ======================================================================
// 120. CONTRACTS / OBLIGATIONS
//
// Owner:
//   Obligations subsystem
// Depends on:
//   USER / ACTOR
// References:
//   N/A
// Emits:
//   N/A
// ======================================================================

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

// ======================================================================
// 130. FINANCE / TREASURY
//
// Owner:
//   Treasury subsystem
// Depends on:
//   USER / ACTOR
// References:
//   N/A
// Emits:
//   N/A
// ======================================================================

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

// ======================================================================
// 140. REAL ESTATE / RWA
//
// Owner:
//   RWA subsystem
// Depends on:
//   USER / ACTOR
// References:
//   WEB3 IDENTITY, ORGANIZATIONS
// Emits:
//   N/A
// ======================================================================

// ----------------------------------------------------------------------
// Entity: reProperties
// ----------------------------------------------------------------------
export const reProperties = sqliteTable(
  're_properties',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    uuid: text('uuid').notNull().unique(), // UUID v4 gerado na criação
    userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),

    title: text('title').notNull(), // Título descritivo
    slug: text('slug').notNull().unique(), // URL amigável

    // Classificação
    propertyType: text('property_type', {
      enum: ['urban', 'rural', 'commercial', 'land'],
    })
      .notNull()
      .default('urban'),

    status: text('status', {
      enum: [
        'draft',
        'under_review',
        'approved',
        'registered',
        'tokenized',
        'sold',
        'rented',
        'archived',
      ],
    })
      .notNull()
      .default('draft'),

    // Registros Legais
    registrationNumberRgi: text('registration_number_rgi').unique(), // Matrícula cartório
    iptuNumber: text('iptu_number'),

    // Imutabilidade
    ipfsCidMetadata: text('ipfs_cid_metadata'), // CID IPFS do JSON completo
    ipfsCidDocument: text('ipfs_cid_document'), // CID IPFS do PDF

    // Pipeline
    workflowStep: text('workflow_step', {
      enum: [
        'digitalization',
        'documents_uploaded',
        'technical_review',
        'legal_review',
        'cartorio_submission',
        'cartorio_approved',
        'ipfs_published',
        'blockchain_registered',
        'completed',
      ],
    })
      .notNull()
      .default('digitalization'),

    // Flags
    isTokenized: integer('is_tokenized', { mode: 'boolean' }).default(false),
    isFeatured: integer('is_featured', { mode: 'boolean' }).default(false),

    notes: text('notes'),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    slugIdx: index('idx_re_properties_slug').on(table.slug),
    statusIdx: index('idx_re_properties_status').on(table.status),
    typeIdx: index('idx_re_properties_type').on(table.propertyType),
  })
);

// ----------------------------------------------------------------------
// Entity: rePropertyLocation
// ----------------------------------------------------------------------
export const rePropertyLocation = sqliteTable(
  're_property_location',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    propertyId: integer('property_id')
      .notNull()
      .references(() => reProperties.id, { onDelete: 'cascade' }),

    // Endereço
    street: text('street'),
    number: integer('number'),
    block: text('block'), // Quadra
    lot: text('lot'), // Lote
    neighborhood: text('neighborhood'),
    city: text('city'),
    state: text('state'), // UF ex: RJ
    zipCode: text('zip_code'),
    country: text('country').default('BR'),

    // GPS (Decimal Degrees)
    latitude: integer('latitude', { mode: 'number' }),
    longitude: integer('longitude', { mode: 'number' }),

    // Sistema Geodésico Brasileiro (SIRGAS 2000)
    utmZone: text('utm_zone'), // Ex: "23.K"
    utmMeridian: text('utm_meridian'), // Ex: "-45º W"
    utmEasting: integer('utm_easting', { mode: 'number' }), // 711097.00
    utmNorthing: integer('utm_northing', { mode: 'number' }), // 7476024.00
    geodeticSystem: text('geodetic_system').default('SIRGAS 2000'),

    // Zoneamento
    zoningCode: text('zoning_code'), // Ex: "Z6"
    zoningDescription: text('zoning_description'),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    cityIdx: index('idx_re_location_city').on(table.city),
    stateIdx: index('idx_re_location_state').on(table.state),
  })
);

// ----------------------------------------------------------------------
// Entity: reSurveyPoints
// ----------------------------------------------------------------------
export const reSurveyPoints = sqliteTable('re_survey_points', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id')
    .notNull()
    .references(() => reProperties.id, { onDelete: 'cascade' }),

  pointName: text('point_name').notNull(), // P0, P1, P2, P3...
  easting: integer('easting', { mode: 'number' }),
  northing: integer('northing', { mode: 'number' }),
  colorMarker: text('color_marker'), // Ex: "🟦", "#4A90E2"
  description: text('description'),

  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// ----------------------------------------------------------------------
// Entity: rePropertyLand
// ----------------------------------------------------------------------
export const rePropertyLand = sqliteTable('re_property_land', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id')
    .notNull()
    .references(() => reProperties.id, { onDelete: 'cascade' }),

  totalAreaM2: integer('total_area_m2', { mode: 'number' }), // 1100.00
  perimeterM: integer('perimeter_m', { mode: 'number' }),
  terrainType: text('terrain_type'), // plano, acidentado

  // Confrontações
  frontageM: integer('frontage_m', { mode: 'number' }),
  depthRightM: integer('depth_right_m', { mode: 'number' }),
  depthLeftM: integer('depth_left_m', { mode: 'number' }),
  rearM: integer('rear_m', { mode: 'number' }),
  boundaryFront: text('boundary_front'),
  boundaryRight: text('boundary_right'),
  boundaryLeft: text('boundary_left'),
  boundaryRear: text('boundary_rear'),

  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// ----------------------------------------------------------------------
// Entity: rePropertyConstruction
// ----------------------------------------------------------------------
export const rePropertyConstruction = sqliteTable('re_property_construction', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id')
    .notNull()
    .references(() => reProperties.id, { onDelete: 'cascade' }),

  floors: integer('floors').default(1),
  builtAreaM2: integer('built_area_m2', { mode: 'number' }),

  // Cômodos
  bedrooms: integer('bedrooms').default(0),
  suites: integer('suites').default(0),
  bathrooms: integer('bathrooms').default(0),
  kitchens: integer('kitchens').default(0),
  livingRooms: integer('living_rooms').default(0),
  garages: integer('garages').default(0),
  laundryAreas: integer('laundry_areas').default(0),
  courtyards: integer('courtyards').default(0),

  // Extras
  hasPool: integer('has_pool', { mode: 'boolean' }).default(false),
  hasElevator: integer('has_elevator', { mode: 'boolean' }).default(false),

  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// ----------------------------------------------------------------------
// Entity: rePropertyInfrastructure
// ----------------------------------------------------------------------
export const rePropertyInfrastructure = sqliteTable('re_property_infrastructure', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id')
    .notNull()
    .references(() => reProperties.id, { onDelete: 'cascade' }),

  water: integer('water', { mode: 'boolean' }).default(false),
  electricity: integer('electricity', { mode: 'boolean' }).default(false),
  sewage: integer('sewage', { mode: 'boolean' }).default(false),
  paving: integer('paving', { mode: 'boolean' }).default(false),
  publicTransport: integer('public_transport', { mode: 'boolean' }).default(false),
  telephoneNetwork: integer('telephone_network', { mode: 'boolean' }).default(false),
  gasNetwork: integer('gas_network', { mode: 'boolean' }).default(false),
  internet: integer('internet', { mode: 'boolean' }).default(false),

  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// ----------------------------------------------------------------------
// Entity: rePropertyPricing
// ----------------------------------------------------------------------
export const rePropertyPricing = sqliteTable(
  're_property_pricing',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    propertyId: integer('property_id')
      .notNull()
      .references(() => reProperties.id, { onDelete: 'cascade' }),

    priceType: text('price_type', {
      enum: ['sale', 'rent', 'appraisal'],
    }).notNull(),

    amountBrlCents: integer('amount_brl_cents').notNull(), // Sempre em centavos
    amountToken: integer('amount_token'), // Tokens ASPPIBRA (opcional)
    currency: text('currency').default('BRL'),

    validFrom: integer('valid_from', { mode: 'timestamp' }),
    validUntil: integer('valid_until', { mode: 'timestamp' }), // NULL = vigente

    paymentMethod: text('payment_method'),
    terms: text('terms'),
    source: text('source'),
    notes: text('notes'),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    priceTypeIdx: index('idx_re_pricing_type').on(table.priceType),
  })
);

// ----------------------------------------------------------------------
// Entity: rePropertyOwners
// ----------------------------------------------------------------------
export const rePropertyOwners = sqliteTable('re_property_owners', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id')
    .notNull()
    .references(() => reProperties.id, { onDelete: 'cascade' }),
  userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),

  ownerType: text('owner_type', {
    enum: ['primary', 'spouse', 'heir', 'legal_entity', 'co_owner'],
  })
    .notNull()
    .default('primary'),

  fullName: text('full_name').notNull(),
  cpf: text('cpf'), // Armazenar apenas dígitos: 09566889771
  rg: text('rg'),
  birthDate: text('birth_date'), // ISO 8601: 1981-12-28
  nationality: text('nationality'),
  maritalStatus: text('marital_status', {
    enum: ['single', 'married', 'divorced', 'widowed', 'stable_union'],
  }),
  ownershipSharePct: integer('ownership_share_pct', { mode: 'number' }).default(100), // %

  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// ----------------------------------------------------------------------
// Entity: rePropertyProfessionals
// ----------------------------------------------------------------------
export const rePropertyProfessionals = sqliteTable('re_property_professionals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id')
    .notNull()
    .references(() => reProperties.id, { onDelete: 'cascade' }),

  role: text('role', {
    enum: ['surveyor', 'civil_engineer', 'lawyer', 'notary', 'appraiser', 'other'],
  }).notNull(),

  fullName: text('full_name').notNull(),
  cpf: text('cpf'),
  rg: text('rg'),

  // Registros Profissionais
  crea: text('crea'), // CREA do engenheiro/topógrafo
  oab: text('oab'), // OAB do advogado
  cft: text('cft'), // CFT do topógrafo
  artNumber: text('art_number'), // Número da ART

  // Empresa
  organizationName: text('organization_name'),
  cnpj: text('cnpj'), // Apenas dígitos

  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// ----------------------------------------------------------------------
// Entity: rePropertyDocuments
// ----------------------------------------------------------------------
export const rePropertyDocuments = sqliteTable(
  're_property_documents',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    propertyId: integer('property_id')
      .notNull()
      .references(() => reProperties.id, { onDelete: 'cascade' }),

    docType: text('doc_type', {
      enum: [
        'onus_reais',
        'escritura',
        'ata_notarial',
        'declaracao',
        'art',
        'iptu',
        'habite_se',
        'plano_diretor',
        'nota_judicial',
        'matricula',
        'contrato_compra_venda',
        'procuracao',
        'other',
      ],
    }).notNull(),

    name: text('name').notNull(),

    // Cartório
    cartoName: text('carto_name'),
    cartoCnpj: text('carto_cnpj'),
    cartoBook: text('carto_book'), // Livro
    cartoAct: text('carto_act'), // Ato
    cartoFolio: text('carto_folio'), // Folha
    registrationDate: text('registration_date'), // ISO 8601
    electronicSeal: text('electronic_seal'), // EDWG85399
    randomCode: text('random_code'), // AXN

    // Armazenamento
    r2Key: text('r2_key'), // Chave no bucket R2 (privado)
    ipfsCid: text('ipfs_cid'), // CID IPFS (público/imutável)
    isPublic: integer('is_public', { mode: 'boolean' }).default(false),

    notes: text('notes'),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    docTypeIdx: index('idx_re_documents_type').on(table.docType),
  })
);

// ----------------------------------------------------------------------
// Entity: rePropertyMedia
// ----------------------------------------------------------------------
export const rePropertyMedia = sqliteTable(
  're_property_media',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    propertyId: integer('property_id')
      .notNull()
      .references(() => reProperties.id, { onDelete: 'cascade' }),

    mediaType: text('media_type', {
      enum: [
        'photo',
        'aerial_photo',
        'floor_plan',
        'site_plan',
        'zoning_map',
        'cadastral_plan',
        'topographic_plan',
        'video',
        'virtual_tour',
        'other',
      ],
    }).notNull(),

    title: text('title'), // Ex: "Vista Frontal"
    url: text('url'), // URL pública (R2 ou IPFS)
    ipfsCid: text('ipfs_cid'),
    r2Key: text('r2_key'),

    isCover: integer('is_cover', { mode: 'boolean' }).default(false),
    displayOrder: integer('display_order').default(0),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    mediaTypeIdx: index('idx_re_media_type').on(table.mediaType),
  })
);

// ----------------------------------------------------------------------
// Entity: rePropertyBlockchain
// ----------------------------------------------------------------------
export const rePropertyBlockchain = sqliteTable(
  're_property_blockchain',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    propertyId: integer('property_id')
      .notNull()
      .references(() => reProperties.id, { onDelete: 'cascade' }),

    chainId: integer('chain_id'), // 56 = BSC
    chainName: text('chain_name'), // "bsc", "polygon", "ethereum"
    contractAddress: text('contract_address'), // Endereço do smart contract
    tokenId: text('token_id'), // ID do NFT
    tokenStandard: text('token_standard'), // "ERC-721", "ERC-1155"
    transactionHash: text('transaction_hash'), // Hash da mint tx
    mintedAt: integer('minted_at', { mode: 'timestamp' }),
    ownerWallet: text('owner_wallet'), // Carteira atual
    metadataIpfsCid: text('metadata_ipfs_cid'), // CID do JSON de metadados onchain
    explorerUrl: text('explorer_url'), // Link bscscan/etherscan
    openseaUrl: text('opensea_url'),

    isActive: integer('is_active', { mode: 'boolean' }).default(false),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    contractIdx: index('idx_re_blockchain_contract').on(table.contractAddress),
  })
);

// ----------------------------------------------------------------------
// Entity: rePropertyWorkflow
// ----------------------------------------------------------------------
export const rePropertyWorkflow = sqliteTable(
  're_property_workflow',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    propertyId: integer('property_id')
      .notNull()
      .references(() => reProperties.id, { onDelete: 'cascade' }),
    actorUserId: integer('actor_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),

    step: text('step', {
      enum: [
        'digitalization',
        'documents_uploaded',
        'technical_review',
        'legal_review',
        'cartorio_submission',
        'cartorio_approved',
        'ipfs_published',
        'blockchain_registered',
        'completed',
      ],
    }).notNull(),

    status: text('status', {
      enum: ['pending', 'in_progress', 'approved', 'rejected', 'requires_correction'],
    })
      .notNull()
      .default('pending'),

    notes: text('notes'),
    completedAt: integer('completed_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    stepIdx: index('idx_re_workflow_step').on(table.step),
    statusIdx: index('idx_re_workflow_status').on(table.status),
  })
);

// ----------------------------------------------------------------------
// Entity: rePropertyAuditLog
// ----------------------------------------------------------------------
export const rePropertyAuditLog = sqliteTable(
  're_property_audit_log',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    propertyId: integer('property_id')
      .notNull()
      .references(() => reProperties.id, { onDelete: 'cascade' }),
    actorUserId: integer('actor_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),

    // Ex: PROPERTY_CREATED, STATUS_CHANGED, DOCUMENT_UPLOADED, NFT_MINTED, OWNER_ADDED
    action: text('action').notNull(),
    oldValue: text('old_value', { mode: 'json' }), // Estado anterior (JSON)
    newValue: text('new_value', { mode: 'json' }), // Estado novo (JSON)
    ipAddress: text('ip_address'),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    actionIdx: index('idx_re_audit_action').on(table.action),
    propertyIdx: index('idx_re_audit_property').on(table.propertyId),
  })
);

// ======================================================================
// 150. DEVOPS / INTEGRATIONS
//
// Owner:
//   Integrations subsystem
// Depends on:
//   N/A
// References:
//   N/A
// Emits:
//   N/A
// ======================================================================

// ----------------------------------------------------------------------
// Entity: integrationConfigs
// ----------------------------------------------------------------------
export const integrationConfigs = sqliteTable(
  'integration_configs',
  {
    id: text('id').primaryKey(), // UUID
    provider: text('provider').notNull(), // ex: binance, stripe, openai
    category: text('category', {
      enum: ['finance', 'web3', 'ai', 'communications', 'oauth', 'infrastructure', 'analytics'],
    }).notNull(),
    environment: text('environment', {
      enum: ['local', 'preview', 'staging', 'production'],
    })
      .notNull()
      .default('production'),

    baseUrl: text('base_url'),
    sandboxMode: integer('sandbox_mode', { mode: 'boolean' }).default(false),

    riskClassification: text('risk_classification', {
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'NUCLEAR'],
    })
      .notNull()
      .default('MEDIUM'),

    rotationIntervalDays: integer('rotation_interval_days'),
    nextRotationAt: integer('next_rotation_at', { mode: 'timestamp' }),

    status: text('status', {
      enum: ['online', 'failing', 'missing'],
    }).default('missing'),

    dependencies: text('dependencies', { mode: 'json' }).$type<string[]>(), // Ex: ["Billing", "Marketplace"]

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    providerEnvIdx: uniqueIndex('idx_integration_provider_env').on(
      table.provider,
      table.environment
    ),
  })
);

// ----------------------------------------------------------------------
// Entity: integrationSecrets
// ----------------------------------------------------------------------
export const integrationSecrets = sqliteTable(
  'integration_secrets',
  {
    id: text('id').primaryKey(), // UUID
    configId: text('config_id')
      .notNull()
      .references(() => integrationConfigs.id, { onDelete: 'cascade' }),
    keyName: text('key_name').notNull(), // ex: STRIPE_SECRET
    encryptedValue: text('encrypted_value').notNull(), // AES-256-GCM encrypted

    version: integer('version').notNull().default(1),
    scopesAllowed: text('scopes_allowed', { mode: 'json' }).$type<string[]>(),

    // Leasing & Ownership
    leaseExpiresAt: integer('lease_expires_at', { mode: 'timestamp' }),
    ownerRole: text('owner_role').default('dev'),
    ownerUserId: integer('owner_user_id').references(() => users.id),

    updatedBy: integer('updated_by').references(() => users.id), // ID do admin
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    configKeyIdx: uniqueIndex('idx_integration_secret_config_key').on(
      table.configId,
      table.keyName
    ),
  })
);

// ----------------------------------------------------------------------
// Entity: integrationSecretVersions
// ----------------------------------------------------------------------
export const integrationSecretVersions = sqliteTable('integration_secret_versions', {
  id: text('id').primaryKey(), // UUID
  secretId: text('secret_id')
    .notNull()
    .references(() => integrationSecrets.id, { onDelete: 'cascade' }),
  encryptedValue: text('encrypted_value').notNull(),
  version: integer('version').notNull(),

  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  createdBy: integer('created_by').references(() => users.id),
});

// ======================================================================
// 160. COMPLIANCE / PRIVACY
//
// Owner:
//   Compliance subsystem
// Depends on:
//   USER / ACTOR
// References:
//   N/A
// Emits:
//   SECURITY / AUDIT events
// ======================================================================

// ----------------------------------------------------------------------
// Entity: userConsents
// ----------------------------------------------------------------------
export const userConsents = sqliteTable(
  'user_consents',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),

    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),

    consentType:   text('consent_type', { enum: CONSENT_TYPES }).notNull(),
    policyVersion: text('policy_version').notNull(), // Ex: '2.1.0' ou '2026-08'
    status:        text('status', { enum: ['accepted', 'declined', 'revoked'] }).notNull(),

    // Rastreabilidade
    source:    text('source'),    // 'web', 'mobile', 'api', 'admin'
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    metadata:  text('metadata', { mode: 'json' }),

    acceptedAt: integer('accepted_at', { mode: 'timestamp' }),
    revokedAt:  integer('revoked_at',  { mode: 'timestamp' }),
    createdAt:  integer('created_at',  { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
  },
  (table) => ({
    userIdx:        index('idx_consents_user').on(table.userId),
    typeVersionIdx: index('idx_consents_type_version').on(table.consentType, table.policyVersion),
  })
);

// ======================================================================
// 170. SECURITY / AUDIT
//
// Owner:
//   Security / Audit subsystem (Cross-cutting)
// Depends on:
//   N/A
// References:
//   Multiple domains
// Emits:
//   N/A
// ======================================================================

// ----------------------------------------------------------------------
// Entity: securityEvents
// ----------------------------------------------------------------------
export const securityEvents = sqliteTable('security_events', {
  id: text('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
  walletId: integer('wallet_id').references(() => wallets.id, { onDelete: 'set null' }),
  authenticatorId: text('authenticator_id').references(() => userAuthenticators.id, { onDelete: 'set null' }),
  sessionId: text('session_id').references(() => userSessions.id, { onDelete: 'set null' }),
  
  event: text('event', { enum: SECURITY_EVENT_TYPES }).notNull(),
  result: text('result', { enum: ['success', 'failure', 'denied'] }).notNull(),
  source: text('source', { enum: ['web', 'mobile', 'api', 'worker', 'admin'] }),
  
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  requestId: text('request_id'),
  correlationId: text('correlation_id'),
  
  metadata: text('metadata', { mode: 'json' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`).notNull(),
}, (table) => ({
  userCreatedIdx: index('idx_security_events_user_created').on(table.userId, table.createdAt),
  walletCreatedIdx: index('idx_security_events_wallet_created').on(table.walletId, table.createdAt),
  authIdx: index('idx_security_events_auth').on(table.authenticatorId),
  eventCheck: check('security_events_event_check', sql`${table.event} IN ('authentication_succeeded', 'authentication_failed', 'credential_created', 'credential_verified', 'credential_revoked', 'password_changed', 'password_reset_requested', 'passkey_registered', 'passkey_used', 'totp_enabled', 'totp_verified', 'wallet_linked', 'wallet_verified', 'wallet_authenticated', 'wallet_suspended', 'wallet_revoked', 'wallet_unlinked', 'recovery_code_consumed', 'account_locked', 'account_unlocked', 'auth_epoch_incremented')`),
  resultCheck: check('security_events_result_check', sql`${table.result} IN ('success', 'failure', 'denied')`),
}));

// ----------------------------------------------------------------------
// Entity: auditLogs
// ----------------------------------------------------------------------
export const auditLogs = sqliteTable(
  'audit_logs',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    actorId: integer('actor_id').references(() => users.id),
    targetUserId: integer('target_user_id').references(() => users.id),

    action: text('action').notNull(), // Ex: 'VAULT_GENESIS', 'HANDSHAKE_SUCCESS'
    status: text('status').default('success'),
    ipAddress: text('ip_address'),

    metadata: text('metadata', { mode: 'json' }),

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
  },
  (table) => ({
    actionIdx: index('idx_audit_action').on(table.action),
    actorIdx: index('idx_audit_actor').on(table.actorId),
  })
);

// ----------------------------------------------------------------------
// Entity: auditLogsImmutable
// ----------------------------------------------------------------------
export const auditLogsImmutable = sqliteTable('audit_logs_immutable', {
  id: text('id').primaryKey(), // UUID
  actorId: integer('actor_id').references(() => users.id),
  actorIp: text('actor_ip'),
  actorUserAgent: text('actor_user_agent'),

  action: text('action').notNull(), // ex: ROTATE_BINANCE_PROD
  resource: text('resource'), // ex: integration_secrets:uuid

  eventHash: text('event_hash').notNull().unique(), // Hash SHA-256 de (id, actorId, action, previousHash, etc)
  previousHash: text('previous_hash'), // Encadeamento

  reason: text('reason'), // Motivo
  status: text('status', { enum: ['success', 'failed'] }).default('success'),

  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`),
});

// ======================================================================
// 180. INFRASTRUCTURE
//
// Owner:
//   Infrastructure subsystem (Cross-cutting)
// Depends on:
//   N/A
// References:
//   Multiple domains
// Emits:
//   N/A
// ======================================================================

// ----------------------------------------------------------------------
// Entity: outboxEvents
// ----------------------------------------------------------------------
export const outboxEvents = sqliteTable('outbox_events', {
  id: text('id').primaryKey(), // UUID do evento (eventId)
  aggregateId: integer('aggregate_id').notNull(),
  aggregateType: text('aggregate_type').notNull(),
  aggregateVersion: integer('aggregate_version').notNull(),
  eventName: text('event_name').notNull(),
  payload: text('payload').notNull(), // JSON
  metadata: text('metadata'), // JSON
  attempts: integer('attempts').default(0).notNull(),
  published: integer('published', { mode: 'boolean' }).default(false).notNull(),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
  error: text('error'),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// ======================================================================
// 900. RELATIONS
// ======================================================================

// ======================================================================
// 901. USER / ACTOR
// ======================================================================
export const usersRelations = relations(users, ({ one, many }) => ({
  citizen: one(citizens, {
    fields: [users.id],
    references: [citizens.userId],
    relationName: 'citizenOwner',
  }),
  verifiedCitizens: many(citizens, { relationName: 'verifiedCitizens' }),
  profile: one(userProfiles),

  authenticators: many(userAuthenticators, { relationName: 'authenticatorOwner' }),
  revokedAuthenticators: many(userAuthenticators, { relationName: 'revokedAuthenticators' }),
  sessions: many(userSessions),
  consents: many(userConsents),
  
  roles: many(userRoles, { relationName: 'roleOwner' }),
  grantedRoles: many(userRoles, { relationName: 'grantedRoles' }),
  revokedRoles: many(userRoles, { relationName: 'revokedRoles' }),

  wallets: many(wallets, { relationName: 'walletOwner' }),
  verifiedWallets: many(wallets, { relationName: 'walletVerifier' }),

  identityDocuments: many(identityDocuments, { relationName: 'userIdentityDocuments' }),
  verifiedDocuments: many(identityDocuments, { relationName: 'verifiedIdentityDocuments' }),
  
  kycVerifications: many(kycVerifications, { relationName: 'kycSubject' }),
  reviewedKycs: many(kycVerifications, { relationName: 'reviewedKycs' }),

  secureVaults: many(secureVaults),
  didIdentities: many(didIdentities),

  addresses: many(userAddresses),
  contacts: many(userContacts),

  organizationMemberships: many(organizationMemberships, { relationName: 'membershipOwner' }),
  appointedMemberships: many(organizationMemberships, { relationName: 'appointedMembers' }),
  mandates: many(mandates),

  professionalExperience: many(userProfessionalExperience),
  education: many(userEducation),

  socialLinks: many(userSocialLinks),
  notificationSettings: many(userNotificationSettings),
  notifications: many(notifications),
  securityEvents: many(securityEvents, { relationName: 'userSecurityEvents' }),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, { fields: [userProfiles.userId], references: [users.id] }),
}));

export const userContactsRelations = relations(userContacts, ({ one }) => ({
  user: one(users, { fields: [userContacts.userId], references: [users.id] }),
}));

export const userAddressesRelations = relations(userAddresses, ({ one }) => ({
  user: one(users, { fields: [userAddresses.userId], references: [users.id] }),
}));

export const userProfessionalExperienceRelations = relations(userProfessionalExperience, ({ one }) => ({
  user: one(users, { fields: [userProfessionalExperience.userId], references: [users.id] }),
  organization: one(organizations, { fields: [userProfessionalExperience.organizationId], references: [organizations.id] }),
}));

export const userEducationRelations = relations(userEducation, ({ one }) => ({
  user: one(users, { fields: [userEducation.userId], references: [users.id] }),
  organization: one(organizations, { fields: [userEducation.organizationId], references: [organizations.id] }),
}));


// ======================================================================
// 902. AUTHENTICATION
// ======================================================================
export const userAuthenticatorsRelations = relations(userAuthenticators, ({ one, many }) => ({
  user: one(users, { fields: [userAuthenticators.userId], references: [users.id], relationName: 'authenticatorOwner' }),
  revokedByUser: one(users, { fields: [userAuthenticators.revokedBy], references: [users.id], relationName: 'revokedAuthenticators' }),
  
  passwordCredential: one(passwordCredentials),
  webauthnCredential: one(webauthnCredentials),
  totpCredential: one(totpCredentials),
  walletAuthenticator: one(walletAuthenticators),
  
  recoverySet: one(recoverySets),
  
  securityEvents: many(securityEvents),
}));

export const passwordCredentialsRelations = relations(passwordCredentials, ({ one }) => ({
  authenticator: one(userAuthenticators, { fields: [passwordCredentials.authenticatorId], references: [userAuthenticators.id] }),
}));

export const webauthnCredentialsRelations = relations(webauthnCredentials, ({ one }) => ({
  authenticator: one(userAuthenticators, { fields: [webauthnCredentials.authenticatorId], references: [userAuthenticators.id] }),
}));

export const totpCredentialsRelations = relations(totpCredentials, ({ one }) => ({
  authenticator: one(userAuthenticators, { fields: [totpCredentials.authenticatorId], references: [userAuthenticators.id] }),
}));

export const recoverySetsRelations = relations(recoverySets, ({ one, many }) => ({
  authenticator: one(userAuthenticators, { fields: [recoverySets.authenticatorId], references: [userAuthenticators.id] }),
  credentials: many(recoveryCredentials),
}));

export const recoveryCredentialsRelations = relations(recoveryCredentials, ({ one }) => ({
  recoverySet: one(recoverySets, { fields: [recoveryCredentials.recoverySetId], references: [recoverySets.id] }),
}));

export const walletAuthenticatorsRelations = relations(walletAuthenticators, ({ one }) => ({
  authenticator: one(userAuthenticators, { fields: [walletAuthenticators.authenticatorId], references: [userAuthenticators.id] }),
  wallet: one(wallets, { fields: [walletAuthenticators.walletId], references: [wallets.id], relationName: 'walletAuthenticator' }),
}));


// ======================================================================
// 903. AUTHORIZATION
// ======================================================================
export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
}));

export const userRolesRelations = relations(userRoles, ({ one }) => ({
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
    relationName: 'roleOwner',
  }),
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
  grantedByUser: one(users, {
    fields: [userRoles.grantedBy],
    references: [users.id],
    relationName: 'grantedRoles',
  }),
  revokedByUser: one(users, {
    fields: [userRoles.revokedBy],
    references: [users.id],
    relationName: 'revokedRoles',
  }),
}));


// ======================================================================
// 904. CIVIL IDENTITY / KYC
// ======================================================================
export const citizensRelations = relations(citizens, ({ one }) => ({
  user: one(users, { fields: [citizens.userId], references: [users.id], relationName: 'citizenOwner' }),
  verifiedByUser: one(users, { fields: [citizens.verifiedBy], references: [users.id], relationName: 'verifiedCitizens' }),
}));

export const identityDocumentsRelations = relations(identityDocuments, ({ one }) => ({
  user: one(users, { fields: [identityDocuments.userId], references: [users.id], relationName: 'userIdentityDocuments' }),
  verifiedByUser: one(users, { fields: [identityDocuments.verifiedBy], references: [users.id], relationName: 'verifiedIdentityDocuments' }),
}));

export const kycVerificationsRelations = relations(kycVerifications, ({ one }) => ({
  user: one(users, { fields: [kycVerifications.userId], references: [users.id], relationName: 'kycSubject' }),
  reviewedByUser: one(users, { fields: [kycVerifications.reviewedBy], references: [users.id], relationName: 'reviewedKycs' }),
}));


// ======================================================================
// 905. SSI / DIGITAL IDENTITY
// ======================================================================
export const secureVaultsRelations = relations(secureVaults, ({ one }) => ({
  user: one(users, { fields: [secureVaults.userId], references: [users.id] }),
}));

export const didIdentitiesRelations = relations(didIdentities, ({ one, many }) => ({
  user: one(users, { fields: [didIdentities.userId], references: [users.id] }),
  verificationMethods: many(didVerificationMethods),
}));

export const didVerificationMethodsRelations = relations(didVerificationMethods, ({ one }) => ({
  didIdentity: one(didIdentities, { fields: [didVerificationMethods.didId], references: [didIdentities.id] }),
}));


// ======================================================================
// 906. ORGANIZATIONS
// ======================================================================
export const organizationsRelations = relations(organizations, ({ many }) => ({
  memberships: many(organizationMemberships),
  mandates: many(mandates),
}));

export const organizationMembershipsRelations = relations(organizationMemberships, ({ one }) => ({
  user: one(users, { fields: [organizationMemberships.userId], references: [users.id], relationName: 'membershipOwner' }),
  organization: one(organizations, { fields: [organizationMemberships.organizationId], references: [organizations.id] }),
  appointedByUser: one(users, { fields: [organizationMemberships.appointedBy], references: [users.id], relationName: 'appointedMembers' }),
}));

export const mandatesRelations = relations(mandates, ({ one }) => ({
  user: one(users, { fields: [mandates.userId], references: [users.id] }),
  organization: one(organizations, { fields: [mandates.organizationId], references: [organizations.id] }),
}));


// ======================================================================
// 907. WEB3 IDENTITY
// ======================================================================
export const walletsRelations = relations(wallets, ({ one }) => ({
  user: one(users, {
    fields: [wallets.userId],
    references: [users.id],
    relationName: 'walletOwner',
  }),
  verifiedByUser: one(users, {
    fields: [wallets.verifiedBy],
    references: [users.id],
    relationName: 'walletVerifier',
  }),
  authenticator: one(walletAuthenticators, {
    fields: [wallets.id],
    references: [walletAuthenticators.walletId],
    relationName: 'walletAuthenticator',
  }),
}));


// ======================================================================
// 908. SOCIAL
// ======================================================================
// No explicit ORM relations currently required.


// ======================================================================
// 909. COMMUNICATION
// ======================================================================
// No explicit ORM relations currently required.


// ======================================================================
// 910. GOVERNANCE
// ======================================================================
// No explicit ORM relations currently required.


// ======================================================================
// 911. CONTRIBUTIONS
// ======================================================================
// No explicit ORM relations currently required.


// ======================================================================
// 912. CONTRACTS / OBLIGATIONS
// ======================================================================
// No explicit ORM relations currently required.


// ======================================================================
// 913. FINANCE / TREASURY
// ======================================================================
// No explicit ORM relations currently required.


// ======================================================================
// 914. REAL ESTATE / RWA
// ======================================================================
// No explicit ORM relations currently required.


// ======================================================================
// 915. DEVOPS / INTEGRATIONS
// ======================================================================
// No explicit ORM relations currently required.


// ======================================================================
// 916. COMPLIANCE / PRIVACY
// ======================================================================
// No explicit ORM relations currently required.


// ======================================================================
// 917. SECURITY / AUDIT
// ======================================================================
export const securityEventsRelations = relations(securityEvents, ({ one }) => ({
  user: one(users, { fields: [securityEvents.userId], references: [users.id], relationName: 'userSecurityEvents' }),
  authenticator: one(userAuthenticators, { fields: [securityEvents.authenticatorId], references: [userAuthenticators.id] }),
  session: one(userSessions, { fields: [securityEvents.sessionId], references: [userSessions.id] }),
}));


// ======================================================================
// 918. INFRASTRUCTURE
// ======================================================================
// No explicit ORM relations currently required.

