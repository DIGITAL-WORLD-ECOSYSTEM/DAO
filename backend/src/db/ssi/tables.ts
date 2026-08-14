import { sqliteTable, text, integer, index, uniqueIndex, primaryKey, check } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import type { EmailEventMetadata } from '../../dto/email-event';
import { users } from '../user/tables';



//
//   SSI subsystem
//   USER / ACTOR
//   N/A
//   N/A

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

