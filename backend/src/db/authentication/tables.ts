import { sqliteTable, text, integer, index, uniqueIndex, primaryKey, check } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import type { EmailEventMetadata } from '../../dto/email-event';
import { users } from '../user/tables';
import { AUTH_TYPES } from '../constants';
import { wallets } from '../web3/tables';




//
//   Authentication subsystem
//   USER / ACTOR
//   WEB3 IDENTITY
//   SECURITY / AUDIT events

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

