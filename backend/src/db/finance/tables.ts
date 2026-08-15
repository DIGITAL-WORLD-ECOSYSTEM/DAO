import {
  sqliteTable,
  text,
  integer,
  index,
  uniqueIndex,
  check,
  foreignKey,
} from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

import { users } from '../user/tables';

/**
 * ============================================================================
 * FINANCE DOMAIN
 * ============================================================================
 *
 * Responsibilities:
 * - Financial assets supported by the platform
 * - Financial accounts
 * - Financial transactions
 * - Double-entry ledger
 * - Account balances
 * - Balance holds
 * - Fiat providers / accounts / payment operations
 * - Crypto financial operations
 * - Asset conversions
 * - Fees
 * - External transaction references
 * - Idempotency
 * - Reconciliation
 *
 * Explicit boundaries:
 * - Authentication is owned by authentication/
 * - KYC / civil identity is owned by civil-identity/
 * - Authorization is owned by authorization/
 * - Blockchain technical infrastructure is owned by web3/
 * - Wallet identity is NOT represented here as a user identity
 *
 * Monetary values (Web3 Compatible):
 * - All amounts are stored as TEXT in the asset's smallest unit to support
 *   EVM precision (up to 18 decimals) which exceeds SQLite's 64-bit integer limit.
 * - Application layer MUST handle these using JS BigInt.
 * - BRL: 2 decimals  -> R$ 10.50 = "1050"
 * - USD: 2 decimals  -> US$ 10.50 = "1050"
 * - ETH: 18 decimals -> 1 ETH = "1000000000000000000"
 *
 * V1 supported financial assets:
 * - BRL
 * - USD
 * - BTC
 * ============================================================================
 */

/* ============================================================================
 * 1. FINANCIAL ASSETS
 * ============================================================================
 *
 * Source of truth for the assets supported by the financial domain.
 *
 * V1:
 * - BRL / fiat / 2 decimals
 * - USD / fiat / 2 decimals
 * - BTC / crypto / 8 decimals
 *
 * This table does NOT contain:
 * - balances
 * - wallets
 * - blockchain addresses
 * - network/chain details
 * - transactions
 */
export const financialAssets = sqliteTable(
  'financial_assets',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    code: text('code').notNull(),
    symbol: text('symbol').notNull(),
    name: text('name').notNull(),
    type: text('type', {
      enum: ['fiat', 'crypto'],
    }).notNull(),
    decimals: integer('decimals').notNull(),
    status: text('status', {
      enum: ['active', 'inactive'],
    })
      .notNull()
      .default('active'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
  },
  (table) => ({
    codeUq: uniqueIndex('uq_financial_assets_code').on(table.code),
    typeIdx: index('idx_financial_assets_type').on(table.type),
    statusIdx: index('idx_financial_assets_status').on(table.status),
    decimalsCheck: check(
      'ck_financial_assets_decimals',
      sql`${table.decimals} >= 0 AND ${table.decimals} <= 18`,
    ),
  }),
);

/* ============================================================================
 * 2. FINANCIAL ACCOUNTS
 * ============================================================================
 *
 * Logical financial accounts.
 *
 * Examples:
 * - user_available
 * - treasury
 * - operating
 * - reserve
 * - fees
 * - escrow
 *
 * A financial account is not a blockchain wallet.
 * It is an internal accounting/balance container.
 */
export const financialAccounts = sqliteTable(
  'financial_accounts',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').references(() => users.id, {
      onDelete: 'restrict',
    }),
    accountType: text('account_type', {
      enum: [
        'user_available',
        'treasury',
        'operating',
        'reserve',
        'fees',
        'escrow',
      ],
    }).notNull(),
    status: text('status', {
      enum: ['active', 'inactive', 'suspended'],
    })
      .notNull()
      .default('active'),
    name: text('name').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
  },
  (table) => ({
    userIdx: index('idx_financial_accounts_user').on(table.userId),
    typeIdx: index('idx_financial_accounts_type').on(table.accountType),
    statusIdx: index('idx_financial_accounts_status').on(table.status),
    userAccountTypeUq: uniqueIndex(
      'uq_financial_accounts_user_type_name',
    ).on(table.userId, table.accountType, table.name),
    ownerRuleCheck: check(
      'ck_financial_accounts_owner_rule',
      sql`(${table.accountType} = 'user_available' AND ${table.userId} IS NOT NULL) OR (${table.accountType} != 'user_available' AND ${table.userId} IS NULL)`
    ),
  }),
);

/* ============================================================================
 * 3. FINANCIAL TRANSACTIONS
 * ============================================================================
 *
 * Business-level financial operation.
 *
 * Examples:
 * - deposit
 * - withdrawal
 * - transfer
 * - payment
 * - refund
 * - fee
 * - reward
 * - yield
 * - conversion
 * - adjustment
 *
 * This is NOT the ledger itself.
 * Ledger entries are stored in financialLedgerEntries.
 */
export const financialTransactions = sqliteTable(
  'financial_transactions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    // Nullable for system-level transactions
    userId: integer('user_id').references(() => users.id, {
      onDelete: 'restrict',
    }),
    type: text('type', {
      enum: [
        'deposit',
        'withdrawal',
        'transfer',
        'payment',
        'refund',
        'fee',
        'reward',
        'yield',
        'conversion',
        'adjustment',
      ],
    }).notNull(),
    category: text('category', {
      enum: [
        'membership',
        'rwa_yield',
        'grant',
        'operational',
        'payment',
        'trading',
        'withdrawal',
        'deposit',
        'fee',
        'other',
      ],
    })
      .notNull()
      .default('other'),
    status: text('status', {
      enum: [
        'pending',
        'processing',
        'completed',
        'failed',
        'cancelled',
        'reversed',
        'refunded',
      ],
    })
      .notNull()
      .default('pending'),
    sourceType: text('source_type', {
      enum: [
        'contribution',
        'grant',
        'membership',
        'payroll',
        'withdrawal',
        'payment',
        'conversion',
        'system',
        'other',
      ],
    }),
    sourceId: text('source_id'),
    correlationId: text('correlation_id'),
    description: text('description').notNull(),
    version: integer('version').notNull().default(0),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
    completedAt: integer('completed_at', { mode: 'timestamp' }),
  },
  (table) => ({
    userIdx: index('idx_financial_transactions_user').on(table.userId),
    typeIdx: index('idx_financial_transactions_type').on(table.type),
    statusIdx: index('idx_financial_transactions_status').on(table.status),
    createdIdx: index('idx_financial_transactions_created').on(
      table.createdAt,
    ),
    correlationIdx: index(
      'idx_financial_transactions_correlation',
    ).on(table.correlationId),
  }),
);

/* ============================================================================
 * 4. FINANCIAL LEDGER ENTRIES
 * ============================================================================
 *
 * APPEND-ONLY TABLE. MUST NEVER BE UPDATED OR DELETED.
 * Double-entry accounting records.
 *
 * INVARIANTS (Enforced by domain services):
 * 1. SUM(debits) = SUM(credits) exactly per transaction and asset.
 * 2. transaction.status = 'completed' strictly requires a balanced ledger.
 * 3. Never update or delete. Corrections require reversal transactions.
 * 
 * Every completed financial transaction should result in balanced entries:
 *
 *   DEBIT   account A   100 BRL
 *   CREDIT  account B   100 BRL
 *
 * Amount is always positive.
 * Direction determines debit/credit.
 */
export const financialLedgerEntries = sqliteTable(
  'financial_ledger_entries',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    transactionId: integer('transaction_id')
      .notNull()
      .references(() => financialTransactions.id, {
        onDelete: 'restrict',
      }),
    accountId: integer('account_id')
      .notNull()
      .references(() => financialAccounts.id, {
        onDelete: 'restrict',
      }),
    assetId: integer('asset_id')
      .notNull()
      .references(() => financialAssets.id, {
        onDelete: 'restrict',
      }),
    direction: text('direction', {
      enum: ['debit', 'credit'],
    }).notNull(),
    amountBaseUnits: text('amount_base_units').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    transactionIdx: index(
      'idx_financial_ledger_entries_transaction',
    ).on(table.transactionId),
    accountIdx: index('idx_financial_ledger_entries_account').on(
      table.accountId,
    ),
    assetIdx: index('idx_financial_ledger_entries_asset').on(
      table.assetId,
    ),
    createdIdx: index('idx_financial_ledger_entries_created').on(
      table.createdAt,
    ),
    // Using LTRIM to validate canonical positive integer strings (Web3 EVM strings)
    amountCheck: check(
      'ck_financial_ledger_entries_amount_positive',
      sql`${table.amountBaseUnits} <> '' AND ltrim(${table.amountBaseUnits}, '0123456789') = '' AND ${table.amountBaseUnits} <> '0' AND ltrim(${table.amountBaseUnits}, '0') = ${table.amountBaseUnits}`,
    ),
  }),
);

/* ============================================================================
 * 5. ACCOUNT BALANCES
 * ============================================================================
 *
 * Materialized balance per financial account and asset.
 *
 * availableBaseUnits:
 *   Immediately spendable amount.
 *
 * lockedBaseUnits:
 *   Amount temporarily reserved.
 *
 * Total balance is:
 *
 *   available + locked
 *
 * We intentionally do NOT store a duplicated "total" field here.
 */
export const accountBalances = sqliteTable(
  'account_balances',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    accountId: integer('account_id')
      .notNull()
      .references(() => financialAccounts.id, {
        onDelete: 'restrict',
      }),
    assetId: integer('asset_id')
      .notNull()
      .references(() => financialAssets.id, {
        onDelete: 'restrict',
      }),
    availableBaseUnits: text('available_base_units')
      .notNull()
      .default('0'),
    lockedBaseUnits: text('locked_base_units')
      .notNull()
      .default('0'),
    version: integer('version').notNull().default(0),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
  },
  (table) => ({
    accountAssetUq: uniqueIndex(
      'uq_account_balances_account_asset',
    ).on(table.accountId, table.assetId),
    accountIdx: index('idx_account_balances_account').on(
      table.accountId,
    ),
    assetIdx: index('idx_account_balances_asset').on(table.assetId),
    availableCheck: check(
      'ck_account_balances_available_nonnegative',
      sql`${table.availableBaseUnits} <> '' AND ltrim(${table.availableBaseUnits}, '0123456789') = '' AND (${table.availableBaseUnits} = '0' OR ltrim(${table.availableBaseUnits}, '0') = ${table.availableBaseUnits})`,
    ),
    lockedCheck: check(
      'ck_account_balances_locked_nonnegative',
      sql`${table.lockedBaseUnits} <> '' AND ltrim(${table.lockedBaseUnits}, '0123456789') = '' AND (${table.lockedBaseUnits} = '0' OR ltrim(${table.lockedBaseUnits}, '0') = ${table.lockedBaseUnits})`,
    ),
  }),
);

/* ============================================================================
 * 6. BALANCE HOLDS
 * ============================================================================
 *
 * Reserves an amount without destroying the account balance.
 *
 * Examples:
 * - withdrawal being processed
 * - payment pending
 * - escrow
 * - compliance/security hold
 */
export const balanceHolds = sqliteTable(
  'balance_holds',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    accountId: integer('account_id')
      .notNull()
      .references(() => financialAccounts.id, {
        onDelete: 'restrict',
      }),
    assetId: integer('asset_id')
      .notNull()
      .references(() => financialAssets.id, {
        onDelete: 'restrict',
      }),
    amountBaseUnits: text('amount_base_units').notNull(),
    reason: text('reason').notNull(),
    referenceType: text('reference_type'),
    referenceId: text('reference_id'),
    status: text('status', {
      enum: ['active', 'released', 'expired', 'consumed'],
    })
      .notNull()
      .default('active'),
    version: integer('version').notNull().default(0),
    expiresAt: integer('expires_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
    releasedAt: integer('released_at', { mode: 'timestamp' }),
  },
  (table) => ({
    accountIdx: index('idx_balance_holds_account').on(table.accountId),
    assetIdx: index('idx_balance_holds_asset').on(table.assetId),
    statusIdx: index('idx_balance_holds_status').on(table.status),
    referenceIdx: index('idx_balance_holds_reference').on(
      table.referenceType,
      table.referenceId,
    ),
    amountCheck: check(
      'ck_balance_holds_amount_positive',
      sql`${table.amountBaseUnits} <> '' AND ltrim(${table.amountBaseUnits}, '0123456789') = '' AND ${table.amountBaseUnits} <> '0' AND ltrim(${table.amountBaseUnits}, '0') = ${table.amountBaseUnits}`,
    ),
  }),
);

/* ============================================================================
 * 7. FIAT PROVIDERS
 * ============================================================================
 *
 * Financial institutions / PSPs / payment providers.
 *
 * Examples:
 * - bank
 * - Pix provider
 * - payment gateway
 *
 * Sensitive credentials/secrets should NOT be stored directly here.
 */
export const fiatProviders = sqliteTable(
  'fiat_providers',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    code: text('code').notNull(),
    type: text('type', {
      enum: ['bank', 'payment_provider', 'pix_provider', 'gateway'],
    }).notNull(),
    status: text('status', {
      enum: ['active', 'inactive', 'suspended'],
    })
      .notNull()
      .default('active'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
  },
  (table) => ({
    codeUq: uniqueIndex('uq_fiat_providers_code').on(table.code),
    typeIdx: index('idx_fiat_providers_type').on(table.type),
    statusIdx: index('idx_fiat_providers_status').on(table.status),
  }),
);

/* ============================================================================
 * 8. FIAT ACCOUNTS
 * ============================================================================
 *
 * External fiat account references.
 *
 * This table stores references to external financial accounts.
 * Sensitive banking secrets are not stored here.
 */
export const fiatAccounts = sqliteTable(
  'fiat_accounts',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'restrict',
      }),
    assetId: integer('asset_id')
      .notNull()
      .references(() => financialAssets.id, {
        onDelete: 'restrict',
      }),
    providerId: integer('provider_id').references(
      () => fiatProviders.id,
      {
        onDelete: 'restrict',
      },
    ),
    type: text('type', {
      enum: ['bank_account', 'payment_account', 'pix_account'],
    }).notNull(),
    externalAccountId: text('external_account_id'),
    displayName: text('display_name'),
    last4: text('last4'),
    status: text('status', {
      enum: ['active', 'inactive', 'blocked'],
    })
      .notNull()
      .default('active'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
  },
  (table) => ({
    userIdx: index('idx_fiat_accounts_user').on(table.userId),
    providerIdx: index('idx_fiat_accounts_provider').on(
      table.providerId,
    ),
    statusIdx: index('idx_fiat_accounts_status').on(table.status),
    externalUq: uniqueIndex(
      'uq_fiat_accounts_provider_external',
    ).on(table.providerId, table.externalAccountId),
    userAccountUq: uniqueIndex(
      'uq_fiat_accounts_user_account',
    ).on(table.userId, table.id),
  }),
);

/* ============================================================================
 * 9. FIAT PAYMENT METHODS
 * ============================================================================
 *
 * Payment methods available to the user.
 */
export const fiatPaymentMethods = sqliteTable(
  'fiat_payment_methods',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, {
        onDelete: 'restrict',
      }),
    fiatAccountId: integer('fiat_account_id'),
    type: text('type', {
      enum: ['pix', 'bank_transfer', 'boleto', 'card'],
    }).notNull(),
    label: text('label').notNull(),
    status: text('status', {
      enum: ['active', 'inactive', 'blocked'],
    })
      .notNull()
      .default('active'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
  },
  (table) => ({
    fiatAccountFk: foreignKey({
      columns: [table.userId, table.fiatAccountId],
      foreignColumns: [fiatAccounts.userId, fiatAccounts.id],
      name: 'fk_fiat_payment_methods_user_account'
    }).onDelete('restrict'),
    userIdx: index('idx_fiat_payment_methods_user').on(
      table.userId,
    ),
    accountIdx: index('idx_fiat_payment_methods_account').on(
      table.fiatAccountId,
    ),
    typeIdx: index('idx_fiat_payment_methods_type').on(table.type),
    statusIdx: index('idx_fiat_payment_methods_status').on(
      table.status,
    ),
  }),
);

/* ============================================================================
 * 10. FIAT TRANSACTIONS
 * ============================================================================
 *
 * Fiat-specific settlement/provider information.
 *
 * Financial transaction remains the business transaction.
 * This table stores fiat execution details.
 */
export const fiatTransactions = sqliteTable(
  'fiat_transactions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    financialTransactionId: integer('financial_transaction_id')
      .notNull()
      .references(() => financialTransactions.id, {
        onDelete: 'restrict',
      }),
    providerId: integer('provider_id').references(
      () => fiatProviders.id,
      {
        onDelete: 'restrict',
      },
    ),
    paymentMethodId: integer('payment_method_id').references(
      () => fiatPaymentMethods.id,
      {
        onDelete: 'restrict',
      },
    ),
    assetId: integer('asset_id')
      .notNull()
      .references(() => financialAssets.id, {
        onDelete: 'restrict',
      }),
    direction: text('direction', {
      enum: ['inbound', 'outbound'],
    }).notNull(),
    amountBaseUnits: text('amount_base_units').notNull(),
    status: text('status', {
      enum: [
        'pending',
        'processing',
        'completed',
        'failed',
        'cancelled',
        'reversed',
      ],
    })
      .notNull()
      .default('pending'),
    version: integer('version').notNull().default(0),
    requestedAt: integer('requested_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    processedAt: integer('processed_at', { mode: 'timestamp' }),
    settledAt: integer('settled_at', { mode: 'timestamp' }),
  },
  (table) => ({
    transactionUq: uniqueIndex(
      'uq_fiat_transactions_financial_transaction',
    ).on(table.financialTransactionId),
    providerIdx: index('idx_fiat_transactions_provider').on(
      table.providerId,
    ),
    paymentMethodIdx: index(
      'idx_fiat_transactions_payment_method',
    ).on(table.paymentMethodId),
    assetIdx: index('idx_fiat_transactions_asset').on(table.assetId),
    statusIdx: index('idx_fiat_transactions_status').on(table.status),
    amountCheck: check(
      'ck_fiat_transactions_amount_positive',
      sql`${table.amountBaseUnits} <> '' AND ltrim(${table.amountBaseUnits}, '0123456789') = '' AND ${table.amountBaseUnits} <> '0' AND ltrim(${table.amountBaseUnits}, '0') = ${table.amountBaseUnits}`,
    ),
  }),
);

/* ============================================================================
 * 11. CRYPTO TRANSACTIONS
 * ============================================================================
 *
 * Finance-side representation of crypto settlement.
 *
 * Blockchain technical details remain in web3.
 *
 * The field web3TransactionId is a reference to the technical Web3 record.
 * Finance does NOT own:
 * - wallet private keys
 * - chain metadata
 * - gas mechanics
 * - blockchain identity
 * - wallet authentication
 */
export const cryptoTransactions = sqliteTable(
  'crypto_transactions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    financialTransactionId: integer('financial_transaction_id')
      .notNull()
      .references(() => financialTransactions.id, {
        onDelete: 'restrict',
      }),
    assetId: integer('asset_id')
      .notNull()
      .references(() => financialAssets.id, {
        onDelete: 'restrict',
      }),
    web3TransactionId: text('web3_transaction_id'),
    direction: text('direction', {
      enum: ['inbound', 'outbound'],
    }).notNull(),
    amountBaseUnits: text('amount_base_units').notNull(),
    feeAssetId: integer('fee_asset_id').references(() => financialAssets.id, {
      onDelete: 'restrict',
    }),
    feeBaseUnits: text('fee_base_units').notNull().default('0'),
    status: text('status', {
      enum: [
        'pending',
        'processing',
        'confirmed',
        'failed',
        'reversed',
      ],
    })
      .notNull()
      .default('pending'),
    version: integer('version').notNull().default(0),
    requestedAt: integer('requested_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    settledAt: integer('settled_at', { mode: 'timestamp' }),
  },
  (table) => ({
    transactionUq: uniqueIndex(
      'uq_crypto_transactions_financial_transaction',
    ).on(table.financialTransactionId),
    web3TransactionUq: uniqueIndex(
      'uq_crypto_transactions_web3_transaction',
    ).on(table.web3TransactionId),
    assetIdx: index('idx_crypto_transactions_asset').on(table.assetId),
    statusIdx: index('idx_crypto_transactions_status').on(
      table.status,
    ),
    amountCheck: check(
      'ck_crypto_transactions_amount_positive',
      sql`${table.amountBaseUnits} <> '' AND ltrim(${table.amountBaseUnits}, '0123456789') = '' AND ${table.amountBaseUnits} <> '0' AND ltrim(${table.amountBaseUnits}, '0') = ${table.amountBaseUnits}`,
    ),
    feeCheck: check(
      'ck_crypto_transactions_fee_nonnegative',
      sql`${table.feeBaseUnits} <> '' AND ltrim(${table.feeBaseUnits}, '0123456789') = '' AND (${table.feeBaseUnits} = '0' OR ltrim(${table.feeBaseUnits}, '0') = ${table.feeBaseUnits})`,
    ),
    feeAssetCheck: check(
      'ck_crypto_transactions_fee_asset',
      sql`${table.feeBaseUnits} = '0' OR ${table.feeAssetId} IS NOT NULL`
    ),
  }),
);

/* ============================================================================
 * 12. EXCHANGE RATES
 * ============================================================================
 *
 * Rates between supported assets.
 *
 * Rates are intentionally stored as TEXT to avoid floating point precision
 * problems. The application layer must parse/validate them as decimal values.
 *
 * Examples:
 * - BTC -> BRL
 * - USD -> BRL
 * - BRL -> USD
 */
export const exchangeRates = sqliteTable(
  'exchange_rates',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    baseAssetId: integer('base_asset_id')
      .notNull()
      .references(() => financialAssets.id, {
        onDelete: 'restrict',
      }),
    quoteAssetId: integer('quote_asset_id')
      .notNull()
      .references(() => financialAssets.id, {
        onDelete: 'restrict',
      }),
    rate: text('rate').notNull(),
    source: text('source').notNull(),
    quotedAt: integer('quoted_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    expiresAt: integer('expires_at', { mode: 'timestamp' }),
  },
  (table) => ({
    pairIdx: index('idx_exchange_rates_pair').on(
      table.baseAssetId,
      table.quoteAssetId,
    ),
    quotedIdx: index('idx_exchange_rates_quoted').on(table.quotedAt),
    pairDifferentCheck: check(
      'ck_exchange_rates_different_assets',
      sql`${table.baseAssetId} <> ${table.quoteAssetId}`,
    ),
    rateCheck: check(
      'ck_exchange_rates_rate_positive',
      sql`CAST(${table.rate} AS REAL) > 0`
    ),
    expiresCheck: check(
      'ck_exchange_rates_expires_after_quoted',
      sql`${table.expiresAt} IS NULL OR ${table.expiresAt} >= ${table.quotedAt}`
    ),
  }),
);

/* ============================================================================
 * 13. ASSET CONVERSIONS
 * ============================================================================
 *
 * Example:
 * - BRL -> BTC
 * - BTC -> USD
 * - USD -> BRL
 */
export const assetConversions = sqliteTable(
  'asset_conversions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    financialTransactionId: integer('financial_transaction_id')
      .notNull()
      .references(() => financialTransactions.id, {
        onDelete: 'restrict',
      }),
    fromAssetId: integer('from_asset_id')
      .notNull()
      .references(() => financialAssets.id, {
        onDelete: 'restrict',
      }),
    toAssetId: integer('to_asset_id')
      .notNull()
      .references(() => financialAssets.id, {
        onDelete: 'restrict',
      }),
    fromAmountBaseUnits: text('from_amount_base_units').notNull(),
    toAmountBaseUnits: text('to_amount_base_units').notNull(),
    rate: text('rate').notNull(),
    rateSource: text('rate_source'),
    quotedAt: integer('quoted_at', { mode: 'timestamp' }),
    feeAmountBaseUnits: text('fee_amount_base_units')
      .notNull()
      .default('0'),
    status: text('status', {
      enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    })
      .notNull()
      .default('pending'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    completedAt: integer('completed_at', { mode: 'timestamp' }),
  },
  (table) => ({
    transactionUq: uniqueIndex(
      'uq_asset_conversions_transaction',
    ).on(table.financialTransactionId),
    fromAssetIdx: index(
      'idx_asset_conversions_from_asset',
    ).on(table.fromAssetId),
    toAssetIdx: index('idx_asset_conversions_to_asset').on(
      table.toAssetId,
    ),
    fromAmountCheck: check(
      'ck_asset_conversions_from_amount_positive',
      sql`${table.fromAmountBaseUnits} <> '' AND ltrim(${table.fromAmountBaseUnits}, '0123456789') = '' AND ${table.fromAmountBaseUnits} <> '0' AND ltrim(${table.fromAmountBaseUnits}, '0') = ${table.fromAmountBaseUnits}`,
    ),
    toAmountCheck: check(
      'ck_asset_conversions_to_amount_positive',
      sql`${table.toAmountBaseUnits} <> '' AND ltrim(${table.toAmountBaseUnits}, '0123456789') = '' AND ${table.toAmountBaseUnits} <> '0' AND ltrim(${table.toAmountBaseUnits}, '0') = ${table.toAmountBaseUnits}`,
    ),
    feeCheck: check(
      'ck_asset_conversions_fee_nonnegative',
      sql`${table.feeAmountBaseUnits} <> '' AND ltrim(${table.feeAmountBaseUnits}, '0123456789') = '' AND (${table.feeAmountBaseUnits} = '0' OR ltrim(${table.feeAmountBaseUnits}, '0') = ${table.feeAmountBaseUnits})`,
    ),
    assetsDifferentCheck: check(
      'ck_asset_conversions_different_assets',
      sql`${table.fromAssetId} <> ${table.toAssetId}`,
    ),
    rateCheck: check(
      'ck_asset_conversions_rate_positive',
      sql`CAST(${table.rate} AS REAL) > 0`
    ),
  }),
);

/* ============================================================================
 * 14. FINANCIAL FEES
 * ============================================================================
 *
 * APPEND-ONLY TABLE. MUST NEVER BE UPDATED OR DELETED.
 * Explicit fee records.
 *
 * Examples:
 * - withdrawal fee
 * - payment fee
 * - conversion fee
 * - network fee
 * - platform fee
 */
export const financialFees = sqliteTable(
  'financial_fees',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    transactionId: integer('transaction_id')
      .notNull()
      .references(() => financialTransactions.id, {
        onDelete: 'restrict',
      }),
    assetId: integer('asset_id')
      .notNull()
      .references(() => financialAssets.id, {
        onDelete: 'restrict',
      }),
    recipientAccountId: integer('recipient_account_id').references(
      () => financialAccounts.id,
      {
        onDelete: 'restrict',
      },
    ),
    feeType: text('fee_type', {
      enum: [
        'platform',
        'withdrawal',
        'payment',
        'conversion',
        'network',
        'other',
      ],
    }).notNull(),
    amountBaseUnits: text('amount_base_units').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (table) => ({
    transactionIdx: index('idx_financial_fees_transaction').on(
      table.transactionId,
    ),
    assetIdx: index('idx_financial_fees_asset').on(table.assetId),
    recipientIdx: index(
      'idx_financial_fees_recipient_account',
    ).on(table.recipientAccountId),
    amountCheck: check(
      'ck_financial_fees_amount_positive',
      sql`${table.amountBaseUnits} <> '' AND ltrim(${table.amountBaseUnits}, '0123456789') = '' AND ${table.amountBaseUnits} <> '0' AND ltrim(${table.amountBaseUnits}, '0') = ${table.amountBaseUnits}`,
    ),
  }),
);

/* ============================================================================
 * 15. EXTERNAL TRANSACTIONS
 * ============================================================================
 *
 * External provider references.
 *
 * This avoids putting provider-specific identifiers directly on the core
 * financial transaction.
 */
export const fiatExternalTransactions = sqliteTable(
  'fiat_external_transactions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    financialTransactionId: integer('financial_transaction_id')
      .notNull()
      .references(() => financialTransactions.id, {
        onDelete: 'restrict',
      }),
    providerId: integer('provider_id').references(
      () => fiatProviders.id,
      {
        onDelete: 'restrict',
      },
    ),
    externalTransactionId: text(
      'external_transaction_id',
    ).notNull(),
    type: text('type').notNull(),
    status: text('status').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date())
      .$onUpdateFn(() => new Date()),
  },
  (table) => ({
    providerExternalUq: uniqueIndex(
      'uq_fiat_external_transactions_provider_external',
    ).on(table.providerId, table.externalTransactionId),
    transactionIdx: index(
      'idx_fiat_external_transactions_transaction',
    ).on(table.financialTransactionId),
    providerIdx: index(
      'idx_fiat_external_transactions_provider',
    ).on(table.providerId),
    statusIdx: index('idx_fiat_external_transactions_status').on(
      table.status,
    ),
  }),
);

/* ============================================================================
 * 16. IDEMPOTENCY KEYS
 * ============================================================================
 *
 * Protects money-moving APIs from duplicate execution.
 */
export const idempotencyKeys = sqliteTable(
  'idempotency_keys',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id').references(() => users.id, {
      onDelete: 'restrict',
    }),
    scope: text('scope').notNull(),
    key: text('key').notNull(),
    requestHash: text('request_hash').notNull(),
    financialTransactionId: integer(
      'financial_transaction_id',
    ).references(() => financialTransactions.id, {
      onDelete: 'restrict',
    }),
    status: text('status', {
      enum: ['processing', 'completed', 'failed'],
    })
      .notNull()
      .default('processing'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .$defaultFn(() => new Date()),
    expiresAt: integer('expires_at', { mode: 'timestamp' }),
  },
  (table) => ({
    scopeKeyUq: uniqueIndex('uq_idempotency_scope_key').on(
      table.scope,
      table.key,
    ),
    userIdx: index('idx_idempotency_keys_user').on(table.userId),
    transactionIdx: index(
      'idx_idempotency_keys_transaction',
    ).on(table.financialTransactionId),
    statusIdx: index('idx_idempotency_keys_status').on(
      table.status,
    ),
    expiresCheck: check(
      'ck_idempotency_keys_expires',
      sql`${table.expiresAt} IS NULL OR ${table.createdAt} < ${table.expiresAt}`
    ),
  }),
);

/* ============================================================================
 * 17. RECONCILIATION RECORDS
 * ============================================================================
 *
 * Compares internal financial state against an external source.
 *
 * Examples:
 * - internal BRL balance vs bank/PSP balance
 * - internal crypto balance vs Web3/custody balance
 */
export const reconciliationRecords = sqliteTable(
  'reconciliation_records',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    providerId: integer('provider_id').references(
      () => fiatProviders.id,
      {
        onDelete: 'restrict',
      },
    ),
    accountId: integer('account_id')
      .notNull()
      .references(() => financialAccounts.id, {
        onDelete: 'restrict',
      }),
    assetId: integer('asset_id')
      .notNull()
      .references(() => financialAssets.id, {
        onDelete: 'restrict',
      }),
    expectedBalanceBaseUnits: text('expected_balance_base_units').notNull(),
    actualBalanceBaseUnits: text('actual_balance_base_units').notNull(),
    differenceBaseUnits: text('difference_base_units').notNull(),
    status: text('status', {
      enum: ['matched', 'mismatch', 'resolved'],
    })
      .notNull()
      .default('matched'),
    reconciliationRunId: text('reconciliation_run_id').notNull(),
    reconciliationDate: integer(
      'reconciliation_date',
      { mode: 'timestamp' },
    )
      .notNull()
      .$defaultFn(() => new Date()),
    resolvedAt: integer('resolved_at', { mode: 'timestamp' }),
  },
  (table) => ({
    accountIdx: index(
      'idx_reconciliation_records_account',
    ).on(table.accountId),
    assetIdx: index(
      'idx_reconciliation_records_asset',
    ).on(table.assetId),
    providerIdx: index(
      'idx_reconciliation_records_provider',
    ).on(table.providerId),
    statusIdx: index(
      'idx_reconciliation_records_status',
    ).on(table.status),
    expectedCheck: check(
      'ck_reconciliation_expected_nonnegative',
      sql`${table.expectedBalanceBaseUnits} <> '' AND ltrim(${table.expectedBalanceBaseUnits}, '0123456789') = '' AND (${table.expectedBalanceBaseUnits} = '0' OR ltrim(${table.expectedBalanceBaseUnits}, '0') = ${table.expectedBalanceBaseUnits})`,
    ),
    actualCheck: check(
      'ck_reconciliation_actual_nonnegative',
      sql`${table.actualBalanceBaseUnits} <> '' AND ltrim(${table.actualBalanceBaseUnits}, '0123456789') = '' AND (${table.actualBalanceBaseUnits} = '0' OR ltrim(${table.actualBalanceBaseUnits}, '0') = ${table.actualBalanceBaseUnits})`,
    ),
  }),
);
