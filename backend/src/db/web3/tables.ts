import { sqliteTable, text, integer, index, uniqueIndex, primaryKey, check } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import type { EmailEventMetadata } from '../../dto/email-event';
import { users } from '../user/tables';

/**
 * ============================================================================
 * WEB3 / BLOCKCHAIN IDENTITY MODEL
 * ============================================================================
 *
 * Physical owner:
 *   src/db/web3/
 *
 * Responsibility:
 *   Manages all blockchain wallets (internal and external) associated with
 *   an account, their statuses, chains, and cryptographic representations.
 *
 * ----------------------------------------------------------------------------
 * INTERNAL vs EXTERNAL WALLETS (PROVENANCE)
 * ----------------------------------------------------------------------------
 *
 * provenance = 'internal'
 *   - Created and managed by the platform.
 *   - The ACTIVE internal wallet's normalized address MUST be mapped to
 *     users.publicId.
 *   - Represents the public blockchain identity of the account.
 *
 * provenance = 'external'
 *   - Added/linked by the user for external operations (e.g., withdrawal).
 *   - NEVER maps to users.publicId.
 *   - Does NOT represent the account's platform identity.
 *
 * ----------------------------------------------------------------------------
 * CANONICALIZATION & PUBLIC ID
 * ----------------------------------------------------------------------------
 *
 * address
 *   = The raw EVM address.
 *
 * addressNormalized
 *   = The authoritative, lowercase canonical representation of the EVM address.
 *
 * INVARIANT:
 *   users.publicId === active internal wallets.addressNormalized
 *
 * ----------------------------------------------------------------------------
 * HISTORICAL REUSE POLICY
 * ----------------------------------------------------------------------------
 *
 * If an internal wallet is revoked (e.g., compromised), its address becomes a
 * permanent historical record.
 * 
 * INVARIANT:
 *   An internal wallet's address MUST NEVER be reassigned to another account.
 *   A revoked internal wallet's address MUST NEVER be reused.
 *
 * ============================================================================
 */

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

    /**
     * Identifies the origin/purpose of the wallet.
     * internal: managed by the platform, feeds users.publicId.
     * external: imported/linked by the user for transactions/withdrawals.
     */
    provenance: text('provenance', { enum: ['internal', 'external'] })
      .notNull()
      .default('external'),

    chainNamespace: text('chain_namespace', { enum: ['eip155'] }).notNull().default('eip155'),
    chainId: integer('chain_id').notNull(),
    walletType: text('wallet_type', { enum: ['eoa', 'smart_contract'] }).notNull().default('eoa'),

    address: text('address').notNull(),
    
    /**
     * Canonical, lowercased representation of the address.
     * For internal wallets, this is the exact value mirrored to users.publicId.
     */
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
    
    provenanceCheck: check('wallets_provenance_check', sql`${table.provenance} IN ('internal', 'external')`),
  })
);


