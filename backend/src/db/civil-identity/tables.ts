import { sqliteTable, text, integer, index, uniqueIndex, primaryKey, check } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import type { EmailEventMetadata } from '../../dto/email-event';
import { users } from '../user/tables';



//
//   Civil Identity subsystem
//   USER / ACTOR
//   N/A
//   N/A

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

