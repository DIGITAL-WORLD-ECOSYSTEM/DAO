CREATE TABLE `user_external_identities` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`provider` text NOT NULL,
	`provider_subject_id` text NOT NULL,
	`email_at_binding` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uq_user_external_identities_provider_subject` ON `user_external_identities` (`provider`,`provider_subject_id`);--> statement-breakpoint
CREATE INDEX `idx_user_external_identities_user_id` ON `user_external_identities` (`user_id`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_mandates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`organization_id` integer NOT NULL,
	`position` text NOT NULL,
	`appointment_document_id` integer,
	`starts_at` integer NOT NULL,
	`ends_at` integer,
	`status` text DEFAULT 'active' NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`suspended_at` integer,
	`revoked_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`appointment_document_id`) REFERENCES `identity_documents`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "mandates_status_check" CHECK("__new_mandates"."status" IN ('active', 'suspended', 'revoked')),
	CONSTRAINT "mandates_suspended_state_check" CHECK("__new_mandates"."status" != 'suspended' OR "__new_mandates"."suspended_at" IS NOT NULL),
	CONSTRAINT "mandates_revoked_state_check" CHECK("__new_mandates"."status" != 'revoked' OR "__new_mandates"."revoked_at" IS NOT NULL),
	CONSTRAINT "mandates_dates_check" CHECK("__new_mandates"."ends_at" IS NULL OR "__new_mandates"."ends_at" >= "__new_mandates"."starts_at"),
	CONSTRAINT "mandates_version_check" CHECK("__new_mandates"."version" > 0)
);
--> statement-breakpoint
INSERT INTO `__new_mandates`("id", "user_id", "organization_id", "position", "appointment_document_id", "starts_at", "ends_at", "status", "version", "created_at", "updated_at", "suspended_at", "revoked_at") SELECT "id", "user_id", "organization_id", "position", "appointment_document_id", "starts_at", "ends_at", "status", "version", "created_at", "updated_at", "suspended_at", "revoked_at" FROM `mandates`;--> statement-breakpoint
DROP TABLE `mandates`;--> statement-breakpoint
ALTER TABLE `__new_mandates` RENAME TO `mandates`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_mandates_user` ON `mandates` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_mandates_org` ON `mandates` (`organization_id`);--> statement-breakpoint
CREATE INDEX `idx_mandates_status` ON `mandates` (`status`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_mandates_active_user_org_position` ON `mandates` (`user_id`,`organization_id`,`position`) WHERE "mandates"."status" = 'active';--> statement-breakpoint
CREATE TABLE `__new_organization_memberships` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`organization_id` integer NOT NULL,
	`department` text,
	`position` text,
	`seniority_level` text,
	`starts_at` integer NOT NULL,
	`ends_at` integer,
	`status` text DEFAULT 'active' NOT NULL,
	`appointed_by` integer,
	`reason` text,
	`version` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`suspended_at` integer,
	`revoked_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`appointed_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "org_memberships_status_check" CHECK("__new_organization_memberships"."status" IN ('active', 'suspended', 'revoked')),
	CONSTRAINT "org_memberships_suspended_state_check" CHECK("__new_organization_memberships"."status" != 'suspended' OR "__new_organization_memberships"."suspended_at" IS NOT NULL),
	CONSTRAINT "org_memberships_revoked_state_check" CHECK("__new_organization_memberships"."status" != 'revoked' OR "__new_organization_memberships"."revoked_at" IS NOT NULL),
	CONSTRAINT "org_memberships_dates_check" CHECK("__new_organization_memberships"."ends_at" IS NULL OR "__new_organization_memberships"."ends_at" >= "__new_organization_memberships"."starts_at"),
	CONSTRAINT "org_memberships_version_check" CHECK("__new_organization_memberships"."version" > 0)
);
--> statement-breakpoint
INSERT INTO `__new_organization_memberships`("id", "user_id", "organization_id", "department", "position", "seniority_level", "starts_at", "ends_at", "status", "appointed_by", "reason", "version", "created_at", "updated_at", "suspended_at", "revoked_at") SELECT "id", "user_id", "organization_id", "department", "position", "seniority_level", "starts_at", "ends_at", "status", "appointed_by", "reason", "version", "created_at", "updated_at", "suspended_at", "revoked_at" FROM `organization_memberships`;--> statement-breakpoint
DROP TABLE `organization_memberships`;--> statement-breakpoint
ALTER TABLE `__new_organization_memberships` RENAME TO `organization_memberships`;--> statement-breakpoint
CREATE INDEX `idx_org_memberships_user` ON `organization_memberships` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_org_memberships_org` ON `organization_memberships` (`organization_id`);--> statement-breakpoint
CREATE INDEX `idx_org_memberships_status` ON `organization_memberships` (`status`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_org_memberships_active_user_org` ON `organization_memberships` (`user_id`,`organization_id`) WHERE "organization_memberships"."status" = 'active';--> statement-breakpoint
CREATE TABLE `__new_auth_challenges` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer,
	`challenge_hash` text NOT NULL,
	`challenge_type` text NOT NULL,
	`used_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "auth_challenges_type_check" CHECK("__new_auth_challenges"."challenge_type" IN ('ssh', 'totp', 'webauthn', 'siwe')),
	CONSTRAINT "auth_challenges_expiration_check" CHECK("__new_auth_challenges"."created_at" < "__new_auth_challenges"."expires_at"),
	CONSTRAINT "auth_challenges_used_state_check" CHECK("__new_auth_challenges"."used_at" IS NULL OR "__new_auth_challenges"."used_at" >= "__new_auth_challenges"."created_at")
);
--> statement-breakpoint
INSERT INTO `__new_auth_challenges`("id", "user_id", "challenge_hash", "challenge_type", "used_at", "created_at", "expires_at") SELECT "id", "user_id", "challenge_hash", "challenge_type", "used_at", "created_at", "expires_at" FROM `auth_challenges`;--> statement-breakpoint
DROP TABLE `auth_challenges`;--> statement-breakpoint
ALTER TABLE `__new_auth_challenges` RENAME TO `auth_challenges`;--> statement-breakpoint
CREATE INDEX `idx_auth_challenges_expires` ON `auth_challenges` (`expires_at`);--> statement-breakpoint
CREATE TABLE `__new_password_resets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`token_hash` text NOT NULL,
	`expires_at` integer NOT NULL,
	`used_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "password_resets_used_state_check" CHECK("__new_password_resets"."used_at" IS NULL OR "__new_password_resets"."used_at" >= "__new_password_resets"."created_at")
);
--> statement-breakpoint
INSERT INTO `__new_password_resets`("id", "user_id", "token_hash", "expires_at", "used_at", "created_at") SELECT "id", "user_id", "token_hash", "expires_at", "used_at", "created_at" FROM `password_resets`;--> statement-breakpoint
DROP TABLE `password_resets`;--> statement-breakpoint
ALTER TABLE `__new_password_resets` RENAME TO `password_resets`;--> statement-breakpoint
CREATE UNIQUE INDEX `password_resets_token_hash_unique` ON `password_resets` (`token_hash`);--> statement-breakpoint
CREATE INDEX `idx_password_resets_expires` ON `password_resets` (`expires_at`);--> statement-breakpoint
CREATE TABLE `__new_user_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`jti` text NOT NULL,
	`ip` text,
	`user_agent` text,
	`refresh_token_hash` text NOT NULL,
	`aal` integer DEFAULT 1 NOT NULL,
	`auth_epoch` integer DEFAULT 1 NOT NULL,
	`last_activity_at` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`expires_at` integer NOT NULL,
	`revoked_at` integer,
	`revocation_reason` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "user_sessions_aal_check" CHECK("__new_user_sessions"."aal" IN (1, 2, 3)),
	CONSTRAINT "user_sessions_expiration_check" CHECK("__new_user_sessions"."created_at" < "__new_user_sessions"."expires_at"),
	CONSTRAINT "user_sessions_revoked_state_check" CHECK("__new_user_sessions"."revoked_at" IS NOT NULL OR "__new_user_sessions"."revocation_reason" IS NULL)
);
--> statement-breakpoint
INSERT INTO `__new_user_sessions`("id", "user_id", "jti", "ip", "user_agent", "refresh_token_hash", "aal", "auth_epoch", "last_activity_at", "created_at", "expires_at", "revoked_at", "revocation_reason") SELECT "id", "user_id", "jti", "ip", "user_agent", "refresh_token_hash", "aal", "auth_epoch", "last_activity_at", "created_at", "expires_at", "revoked_at", "revocation_reason" FROM `user_sessions`;--> statement-breakpoint
DROP TABLE `user_sessions`;--> statement-breakpoint
ALTER TABLE `__new_user_sessions` RENAME TO `user_sessions`;--> statement-breakpoint
CREATE UNIQUE INDEX `user_sessions_jti_unique` ON `user_sessions` (`jti`);--> statement-breakpoint
CREATE INDEX `idx_sessions_user` ON `user_sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_sessions_expires` ON `user_sessions` (`expires_at`);--> statement-breakpoint
CREATE TABLE `__new_organizations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`suspended_at` integer,
	`revoked_at` integer,
	CONSTRAINT "organizations_status_check" CHECK("__new_organizations"."status" IN ('active', 'suspended', 'revoked')),
	CONSTRAINT "organizations_type_check" CHECK("__new_organizations"."type" IN ('dao', 'ngo', 'company', 'academic', 'government', 'foundation', 'other')),
	CONSTRAINT "organizations_slug_format_check" CHECK("__new_organizations"."slug" GLOB '[a-z0-9-]*'),
	CONSTRAINT "organizations_suspended_state_check" CHECK("__new_organizations"."status" != 'suspended' OR "__new_organizations"."suspended_at" IS NOT NULL),
	CONSTRAINT "organizations_revoked_state_check" CHECK("__new_organizations"."status" != 'revoked' OR "__new_organizations"."revoked_at" IS NOT NULL),
	CONSTRAINT "organizations_version_check" CHECK("__new_organizations"."version" > 0)
);
--> statement-breakpoint
INSERT INTO `__new_organizations`("id", "name", "slug", "type", "status", "version", "created_at", "updated_at", "suspended_at", "revoked_at") SELECT "id", "name", "slug", "type", "status", "version", "created_at", "updated_at", "suspended_at", "revoked_at" FROM `organizations`;--> statement-breakpoint
DROP TABLE `organizations`;--> statement-breakpoint
ALTER TABLE `__new_organizations` RENAME TO `organizations`;--> statement-breakpoint
CREATE UNIQUE INDEX `organizations_slug_unique` ON `organizations` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_organizations_slug` ON `organizations` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_organizations_status` ON `organizations` (`status`);--> statement-breakpoint
CREATE TABLE `__new_fiat_accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`asset_id` integer NOT NULL,
	`provider_id` integer,
	`type` text NOT NULL,
	`external_account_id` text,
	`display_name` text,
	`last4` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`blocked_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`asset_id`) REFERENCES `financial_assets`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`provider_id`) REFERENCES `fiat_providers`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "ck_fiat_accounts_type" CHECK("__new_fiat_accounts"."type" IN ('bank_account', 'payment_account', 'pix_account')),
	CONSTRAINT "ck_fiat_accounts_status" CHECK("__new_fiat_accounts"."status" IN ('active', 'inactive', 'blocked')),
	CONSTRAINT "ck_fiat_accounts_blocked_state" CHECK("__new_fiat_accounts"."status" != 'blocked' OR "__new_fiat_accounts"."blocked_at" IS NOT NULL)
);
--> statement-breakpoint
INSERT INTO `__new_fiat_accounts`("id", "user_id", "asset_id", "provider_id", "type", "external_account_id", "display_name", "last4", "status", "created_at", "updated_at", "blocked_at") SELECT "id", "user_id", "asset_id", "provider_id", "type", "external_account_id", "display_name", "last4", "status", "created_at", "updated_at", "blocked_at" FROM `fiat_accounts`;--> statement-breakpoint
DROP TABLE `fiat_accounts`;--> statement-breakpoint
ALTER TABLE `__new_fiat_accounts` RENAME TO `fiat_accounts`;--> statement-breakpoint
CREATE INDEX `idx_fiat_accounts_user` ON `fiat_accounts` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_fiat_accounts_provider` ON `fiat_accounts` (`provider_id`);--> statement-breakpoint
CREATE INDEX `idx_fiat_accounts_status` ON `fiat_accounts` (`status`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_fiat_accounts_provider_external` ON `fiat_accounts` (`provider_id`,`external_account_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_fiat_accounts_user_account` ON `fiat_accounts` (`user_id`,`id`);--> statement-breakpoint
CREATE TABLE `__new_fiat_payment_methods` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`fiat_account_id` integer,
	`type` text NOT NULL,
	`label` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`blocked_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`user_id`,`fiat_account_id`) REFERENCES `fiat_accounts`(`user_id`,`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "ck_fiat_pm_type" CHECK("__new_fiat_payment_methods"."type" IN ('pix', 'bank_transfer', 'boleto', 'card')),
	CONSTRAINT "ck_fiat_pm_status" CHECK("__new_fiat_payment_methods"."status" IN ('active', 'inactive', 'blocked')),
	CONSTRAINT "ck_fiat_pm_blocked_state" CHECK("__new_fiat_payment_methods"."status" != 'blocked' OR "__new_fiat_payment_methods"."blocked_at" IS NOT NULL)
);
--> statement-breakpoint
INSERT INTO `__new_fiat_payment_methods`("id", "user_id", "fiat_account_id", "type", "label", "status", "created_at", "updated_at", "blocked_at") SELECT "id", "user_id", "fiat_account_id", "type", "label", "status", "created_at", "updated_at", "blocked_at" FROM `fiat_payment_methods`;--> statement-breakpoint
DROP TABLE `fiat_payment_methods`;--> statement-breakpoint
ALTER TABLE `__new_fiat_payment_methods` RENAME TO `fiat_payment_methods`;--> statement-breakpoint
CREATE INDEX `idx_fiat_payment_methods_user` ON `fiat_payment_methods` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_fiat_payment_methods_account` ON `fiat_payment_methods` (`fiat_account_id`);--> statement-breakpoint
CREATE INDEX `idx_fiat_payment_methods_type` ON `fiat_payment_methods` (`type`);--> statement-breakpoint
CREATE INDEX `idx_fiat_payment_methods_status` ON `fiat_payment_methods` (`status`);--> statement-breakpoint
CREATE TABLE `__new_financial_accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer,
	`account_type` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`name` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "ck_financial_accounts_type" CHECK("__new_financial_accounts"."account_type" IN ('user_available', 'treasury', 'operating', 'reserve', 'fees', 'escrow')),
	CONSTRAINT "ck_financial_accounts_status" CHECK("__new_financial_accounts"."status" IN ('active', 'inactive', 'suspended')),
	CONSTRAINT "ck_financial_accounts_owner_rule" CHECK(("__new_financial_accounts"."account_type" = 'user_available' AND "__new_financial_accounts"."user_id" IS NOT NULL) OR ("__new_financial_accounts"."account_type" != 'user_available' AND "__new_financial_accounts"."user_id" IS NULL)),
	CONSTRAINT "ck_financial_accounts_version" CHECK("__new_financial_accounts"."version" > 0)
);
--> statement-breakpoint
INSERT INTO `__new_financial_accounts`("id", "user_id", "account_type", "status", "name", "version", "created_at", "updated_at") SELECT "id", "user_id", "account_type", "status", "name", "version", "created_at", "updated_at" FROM `financial_accounts`;--> statement-breakpoint
DROP TABLE `financial_accounts`;--> statement-breakpoint
ALTER TABLE `__new_financial_accounts` RENAME TO `financial_accounts`;--> statement-breakpoint
CREATE INDEX `idx_financial_accounts_user` ON `financial_accounts` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_financial_accounts_type` ON `financial_accounts` (`account_type`);--> statement-breakpoint
CREATE INDEX `idx_financial_accounts_status` ON `financial_accounts` (`status`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_financial_accounts_user_type_name` ON `financial_accounts` (`user_id`,`account_type`,`name`);--> statement-breakpoint
CREATE TABLE `__new_reconciliation_records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`provider_id` integer,
	`account_id` integer NOT NULL,
	`asset_id` integer NOT NULL,
	`expected_balance_base_units` text NOT NULL,
	`actual_balance_base_units` text NOT NULL,
	`difference_base_units` text NOT NULL,
	`status` text DEFAULT 'matched' NOT NULL,
	`reconciliation_run_id` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`reconciliation_date` integer NOT NULL,
	`resolved_at` integer,
	FOREIGN KEY (`provider_id`) REFERENCES `fiat_providers`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`account_id`) REFERENCES `financial_accounts`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`asset_id`) REFERENCES `financial_assets`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "ck_reconciliation_status" CHECK("__new_reconciliation_records"."status" IN ('matched', 'mismatch', 'resolved')),
	CONSTRAINT "ck_reconciliation_resolved_state" CHECK("__new_reconciliation_records"."status" != 'resolved' OR "__new_reconciliation_records"."resolved_at" IS NOT NULL),
	CONSTRAINT "ck_reconciliation_records_version" CHECK("__new_reconciliation_records"."version" > 0),
	CONSTRAINT "ck_reconciliation_expected_nonnegative" CHECK("__new_reconciliation_records"."expected_balance_base_units" <> '' AND ltrim("__new_reconciliation_records"."expected_balance_base_units", '0123456789') = '' AND ("__new_reconciliation_records"."expected_balance_base_units" = '0' OR ltrim("__new_reconciliation_records"."expected_balance_base_units", '0') = "__new_reconciliation_records"."expected_balance_base_units")),
	CONSTRAINT "ck_reconciliation_actual_nonnegative" CHECK("__new_reconciliation_records"."actual_balance_base_units" <> '' AND ltrim("__new_reconciliation_records"."actual_balance_base_units", '0123456789') = '' AND ("__new_reconciliation_records"."actual_balance_base_units" = '0' OR ltrim("__new_reconciliation_records"."actual_balance_base_units", '0') = "__new_reconciliation_records"."actual_balance_base_units"))
);
--> statement-breakpoint
INSERT INTO `__new_reconciliation_records`("id", "provider_id", "account_id", "asset_id", "expected_balance_base_units", "actual_balance_base_units", "difference_base_units", "status", "reconciliation_run_id", "version", "reconciliation_date", "resolved_at") SELECT "id", "provider_id", "account_id", "asset_id", "expected_balance_base_units", "actual_balance_base_units", "difference_base_units", "status", "reconciliation_run_id", "version", "reconciliation_date", "resolved_at" FROM `reconciliation_records`;--> statement-breakpoint
DROP TABLE `reconciliation_records`;--> statement-breakpoint
ALTER TABLE `__new_reconciliation_records` RENAME TO `reconciliation_records`;--> statement-breakpoint
CREATE INDEX `idx_reconciliation_records_account` ON `reconciliation_records` (`account_id`);--> statement-breakpoint
CREATE INDEX `idx_reconciliation_records_asset` ON `reconciliation_records` (`asset_id`);--> statement-breakpoint
CREATE INDEX `idx_reconciliation_records_provider` ON `reconciliation_records` (`provider_id`);--> statement-breakpoint
CREATE INDEX `idx_reconciliation_records_status` ON `reconciliation_records` (`status`);--> statement-breakpoint
CREATE TABLE `__new_secure_vaults` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`purpose` text NOT NULL,
	`ciphertext` text NOT NULL,
	`nonce` text NOT NULL,
	`auth_tag` text NOT NULL,
	`encryption_algorithm` text NOT NULL,
	`key_version` integer DEFAULT 1 NOT NULL,
	`key_reference` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`rotated_at` integer,
	`revoked_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "ck_secure_vaults_purpose" CHECK("__new_secure_vaults"."purpose" IN ('wallet_mnemonic', 'recovery_material', 'private_key', 'identity_seed')),
	CONSTRAINT "ck_secure_vaults_algorithm" CHECK("__new_secure_vaults"."encryption_algorithm" IN ('AES-256-GCM', 'XChaCha20-Poly1305')),
	CONSTRAINT "ck_secure_vaults_rotated_after_created" CHECK("__new_secure_vaults"."rotated_at" IS NULL OR "__new_secure_vaults"."rotated_at" >= "__new_secure_vaults"."created_at"),
	CONSTRAINT "ck_secure_vaults_revoked_after_created" CHECK("__new_secure_vaults"."revoked_at" IS NULL OR "__new_secure_vaults"."revoked_at" >= "__new_secure_vaults"."created_at"),
	CONSTRAINT "ck_secure_vaults_version" CHECK("__new_secure_vaults"."version" > 0 AND "__new_secure_vaults"."key_version" > 0)
);
--> statement-breakpoint
INSERT INTO `__new_secure_vaults`("id", "user_id", "purpose", "ciphertext", "nonce", "auth_tag", "encryption_algorithm", "key_version", "key_reference", "version", "created_at", "rotated_at", "revoked_at") SELECT "id", "user_id", "purpose", "ciphertext", "nonce", "auth_tag", "encryption_algorithm", "key_version", "key_reference", "version", "created_at", "rotated_at", "revoked_at" FROM `secure_vaults`;--> statement-breakpoint
DROP TABLE `secure_vaults`;--> statement-breakpoint
ALTER TABLE `__new_secure_vaults` RENAME TO `secure_vaults`;--> statement-breakpoint
CREATE INDEX `idx_secure_vaults_user` ON `secure_vaults` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_secure_vaults_user_purpose_version` ON `secure_vaults` (`user_id`,`purpose`,`key_version`);--> statement-breakpoint
CREATE UNIQUE INDEX `uq_secure_vaults_active_purpose` ON `secure_vaults` (`user_id`,`purpose`) WHERE "secure_vaults"."revoked_at" IS NULL;--> statement-breakpoint
CREATE TABLE `__new_user_authenticators` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`type` text NOT NULL,
	`label` text,
	`verified_at` integer,
	`last_used_at` integer,
	`revoked_at` integer,
	`revoked_by` integer,
	`revocation_reason` text,
	`metadata` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`revoked_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	CONSTRAINT "user_authenticators_type_check" CHECK("__new_user_authenticators"."type" IN ('password', 'totp', 'webauthn', 'recovery_code', 'wallet')),
	CONSTRAINT "user_authenticators_revoked_state_check" CHECK("__new_user_authenticators"."revoked_at" IS NOT NULL OR "__new_user_authenticators"."revocation_reason" IS NULL)
);
--> statement-breakpoint
INSERT INTO `__new_user_authenticators`("id", "user_id", "type", "label", "verified_at", "last_used_at", "revoked_at", "revoked_by", "revocation_reason", "metadata", "created_at", "updated_at") SELECT "id", "user_id", "type", "label", "verified_at", "last_used_at", "revoked_at", "revoked_by", "revocation_reason", "metadata", "created_at", "updated_at" FROM `user_authenticators`;--> statement-breakpoint
DROP TABLE `user_authenticators`;--> statement-breakpoint
ALTER TABLE `__new_user_authenticators` RENAME TO `user_authenticators`;--> statement-breakpoint
CREATE INDEX `idx_authenticators_user_type_revoked` ON `user_authenticators` (`user_id`,`type`,`revoked_at`);--> statement-breakpoint
CREATE TABLE `__new_wallet_authenticators` (
	`authenticator_id` text PRIMARY KEY NOT NULL,
	`wallet_id` integer NOT NULL,
	`protocol` text DEFAULT 'siwe' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`authenticator_id`) REFERENCES `user_authenticators`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`wallet_id`) REFERENCES `wallets`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "wallet_authenticators_protocol_check" CHECK("__new_wallet_authenticators"."protocol" IN ('siwe', 'eip191', 'eip712', 'eip1271'))
);
--> statement-breakpoint
INSERT INTO `__new_wallet_authenticators`("authenticator_id", "wallet_id", "protocol", "created_at", "updated_at") SELECT "authenticator_id", "wallet_id", "protocol", "created_at", "updated_at" FROM `wallet_authenticators`;--> statement-breakpoint
DROP TABLE `wallet_authenticators`;--> statement-breakpoint
ALTER TABLE `__new_wallet_authenticators` RENAME TO `wallet_authenticators`;--> statement-breakpoint
CREATE UNIQUE INDEX `wallet_authenticators_wallet_id_unique` ON `wallet_authenticators` (`wallet_id`);--> statement-breakpoint
CREATE TABLE `__new_webauthn_credentials` (
	`authenticator_id` text PRIMARY KEY NOT NULL,
	`credential_id` text NOT NULL,
	`public_key_cose` text NOT NULL,
	`rp_id` text NOT NULL,
	`user_handle` text,
	`sign_count` integer DEFAULT 0 NOT NULL,
	`transports` text,
	`backup_eligible` integer NOT NULL,
	`backup_state` integer NOT NULL,
	`uv_initialized` integer NOT NULL,
	`aaguid` text,
	`attestation_format` text,
	`attestation_object` text,
	FOREIGN KEY (`authenticator_id`) REFERENCES `user_authenticators`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "webauthn_sign_count_check" CHECK("__new_webauthn_credentials"."sign_count" >= 0),
	CONSTRAINT "webauthn_rpid_check" CHECK(length("__new_webauthn_credentials"."rp_id") > 0),
	CONSTRAINT "webauthn_backup_state_check" CHECK("__new_webauthn_credentials"."backup_state" = 0 OR "__new_webauthn_credentials"."backup_eligible" = 1)
);
--> statement-breakpoint
INSERT INTO `__new_webauthn_credentials`("authenticator_id", "credential_id", "public_key_cose", "rp_id", "user_handle", "sign_count", "transports", "backup_eligible", "backup_state", "uv_initialized", "aaguid", "attestation_format", "attestation_object") SELECT "authenticator_id", "credential_id", "public_key_cose", "rp_id", "user_handle", "sign_count", "transports", "backup_eligible", "backup_state", "uv_initialized", "aaguid", "attestation_format", "attestation_object" FROM `webauthn_credentials`;--> statement-breakpoint
DROP TABLE `webauthn_credentials`;--> statement-breakpoint
ALTER TABLE `__new_webauthn_credentials` RENAME TO `webauthn_credentials`;--> statement-breakpoint
CREATE UNIQUE INDEX `webauthn_credentials_credential_id_unique` ON `webauthn_credentials` (`credential_id`);--> statement-breakpoint
CREATE TABLE `__new_did_identities` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`did` text NOT NULL,
	`method` text NOT NULL,
	`controller` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`revoked_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "ck_did_identities_did_format" CHECK("__new_did_identities"."did" LIKE 'did:%'),
	CONSTRAINT "ck_did_identities_status" CHECK("__new_did_identities"."status" IN ('active', 'suspended', 'revoked')),
	CONSTRAINT "ck_did_identities_method" CHECK("__new_did_identities"."method" IN ('key', 'ion', 'polygonid', 'web', 'cheqd', 'pkh')),
	CONSTRAINT "ck_did_identities_revoked_state" CHECK("__new_did_identities"."status" != 'revoked' OR "__new_did_identities"."revoked_at" IS NOT NULL),
	CONSTRAINT "ck_did_identities_version" CHECK("__new_did_identities"."version" > 0)
);
--> statement-breakpoint
INSERT INTO `__new_did_identities`("id", "user_id", "did", "method", "controller", "status", "version", "created_at", "updated_at", "revoked_at") SELECT "id", "user_id", "did", "method", "controller", "status", "version", "created_at", "updated_at", "revoked_at" FROM `did_identities`;--> statement-breakpoint
DROP TABLE `did_identities`;--> statement-breakpoint
ALTER TABLE `__new_did_identities` RENAME TO `did_identities`;--> statement-breakpoint
CREATE UNIQUE INDEX `did_identities_did_unique` ON `did_identities` (`did`);--> statement-breakpoint
CREATE INDEX `idx_did_identities_user` ON `did_identities` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_did_identities_did` ON `did_identities` (`did`);--> statement-breakpoint
CREATE INDEX `idx_did_identities_status` ON `did_identities` (`status`);--> statement-breakpoint
CREATE TABLE `__new_did_verification_methods` (
	`id` text PRIMARY KEY NOT NULL,
	`did_id` text NOT NULL,
	`type` text NOT NULL,
	`controller_did` text NOT NULL,
	`public_key_multibase` text NOT NULL,
	`purpose` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`revoked_at` integer,
	FOREIGN KEY (`did_id`) REFERENCES `did_identities`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "ck_did_vm_controller_did_format" CHECK("__new_did_verification_methods"."controller_did" LIKE 'did:%'),
	CONSTRAINT "ck_did_vm_status" CHECK("__new_did_verification_methods"."status" IN ('active', 'suspended', 'revoked')),
	CONSTRAINT "ck_did_vm_purpose" CHECK("__new_did_verification_methods"."purpose" IN ('authentication', 'assertionMethod', 'keyAgreement', 'capabilityInvocation', 'capabilityDelegation')),
	CONSTRAINT "ck_did_vm_type" CHECK("__new_did_verification_methods"."type" IN ('Ed25519VerificationKey2020', 'EcdsaSecp256k1RecoveryMethod2020', 'X25519KeyAgreementKey2020', 'JsonWebKey2020')),
	CONSTRAINT "ck_did_vm_revoked_state" CHECK("__new_did_verification_methods"."status" != 'revoked' OR "__new_did_verification_methods"."revoked_at" IS NOT NULL),
	CONSTRAINT "ck_did_vm_version" CHECK("__new_did_verification_methods"."version" > 0)
);
--> statement-breakpoint
INSERT INTO `__new_did_verification_methods`("id", "did_id", "type", "controller_did", "public_key_multibase", "purpose", "status", "version", "created_at", "revoked_at") SELECT "id", "did_id", "type", "controller_did", "public_key_multibase", "purpose", "status", "version", "created_at", "revoked_at" FROM `did_verification_methods`;--> statement-breakpoint
DROP TABLE `did_verification_methods`;--> statement-breakpoint
ALTER TABLE `__new_did_verification_methods` RENAME TO `did_verification_methods`;--> statement-breakpoint
CREATE INDEX `idx_did_verification_methods_did` ON `did_verification_methods` (`did_id`);--> statement-breakpoint
CREATE INDEX `idx_did_verification_methods_purpose` ON `did_verification_methods` (`purpose`);--> statement-breakpoint
CREATE INDEX `idx_did_verification_methods_status` ON `did_verification_methods` (`status`);--> statement-breakpoint
CREATE TABLE `__new_verifiable_credentials` (
	`id` text PRIMARY KEY NOT NULL,
	`holder_user_id` integer NOT NULL,
	`issuer_did` text NOT NULL,
	`subject_did` text NOT NULL,
	`credential_type` text NOT NULL,
	`credential_hash` text NOT NULL,
	`encrypted_claims` text NOT NULL,
	`proof_type` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`issuance_date` integer DEFAULT (unixepoch()) NOT NULL,
	`expiration_date` integer,
	`revoked_at` integer,
	FOREIGN KEY (`holder_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "ck_vc_issuer_did_format" CHECK("__new_verifiable_credentials"."issuer_did" LIKE 'did:%'),
	CONSTRAINT "ck_vc_subject_did_format" CHECK("__new_verifiable_credentials"."subject_did" LIKE 'did:%'),
	CONSTRAINT "ck_vc_status" CHECK("__new_verifiable_credentials"."status" IN ('active', 'suspended', 'revoked', 'expired')),
	CONSTRAINT "ck_vc_type" CHECK("__new_verifiable_credentials"."credential_type" IN ('CivicIdentityCredential', 'MembershipCredential', 'KycVerificationCredential', 'ReputationCredential')),
	CONSTRAINT "ck_vc_proof_type" CHECK("__new_verifiable_credentials"."proof_type" IN ('Ed25519Signature2020', 'BbsBlsSignature2020', 'JsonWebSignature2020')),
	CONSTRAINT "ck_vc_revoked_state" CHECK("__new_verifiable_credentials"."status" != 'revoked' OR "__new_verifiable_credentials"."revoked_at" IS NOT NULL),
	CONSTRAINT "ck_vc_dates" CHECK("__new_verifiable_credentials"."expiration_date" IS NULL OR "__new_verifiable_credentials"."expiration_date" > "__new_verifiable_credentials"."issuance_date"),
	CONSTRAINT "ck_vc_version" CHECK("__new_verifiable_credentials"."version" > 0)
);
--> statement-breakpoint
INSERT INTO `__new_verifiable_credentials`("id", "holder_user_id", "issuer_did", "subject_did", "credential_type", "credential_hash", "encrypted_claims", "proof_type", "status", "version", "issuance_date", "expiration_date", "revoked_at") SELECT "id", "holder_user_id", "issuer_did", "subject_did", "credential_type", "credential_hash", "encrypted_claims", "proof_type", "status", "version", "issuance_date", "expiration_date", "revoked_at" FROM `verifiable_credentials`;--> statement-breakpoint
DROP TABLE `verifiable_credentials`;--> statement-breakpoint
ALTER TABLE `__new_verifiable_credentials` RENAME TO `verifiable_credentials`;--> statement-breakpoint
CREATE UNIQUE INDEX `verifiable_credentials_credential_hash_unique` ON `verifiable_credentials` (`credential_hash`);--> statement-breakpoint
CREATE INDEX `idx_vc_holder_user` ON `verifiable_credentials` (`holder_user_id`);--> statement-breakpoint
CREATE INDEX `idx_vc_subject_did` ON `verifiable_credentials` (`subject_did`);--> statement-breakpoint
CREATE INDEX `idx_vc_issuer_did` ON `verifiable_credentials` (`issuer_did`);--> statement-breakpoint
CREATE INDEX `idx_vc_status` ON `verifiable_credentials` (`status`);--> statement-breakpoint
CREATE TABLE `__new_verifiable_presentations` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`verifier_did` text NOT NULL,
	`presentation_type` text NOT NULL,
	`challenge` text NOT NULL,
	`presentation_hash` text NOT NULL,
	`status` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`submitted_at` integer DEFAULT (unixepoch()) NOT NULL,
	`verified_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "ck_vp_verifier_did_format" CHECK("__new_verifiable_presentations"."verifier_did" LIKE 'did:%'),
	CONSTRAINT "ck_vp_status" CHECK("__new_verifiable_presentations"."status" IN ('verified', 'rejected', 'expired')),
	CONSTRAINT "ck_vp_verified_state" CHECK("__new_verifiable_presentations"."status" != 'verified' OR "__new_verifiable_presentations"."verified_at" IS NOT NULL),
	CONSTRAINT "ck_vp_verified_after_submitted" CHECK("__new_verifiable_presentations"."verified_at" IS NULL OR "__new_verifiable_presentations"."verified_at" >= "__new_verifiable_presentations"."submitted_at"),
	CONSTRAINT "ck_vp_version" CHECK("__new_verifiable_presentations"."version" > 0)
);
--> statement-breakpoint
INSERT INTO `__new_verifiable_presentations`("id", "user_id", "verifier_did", "presentation_type", "challenge", "presentation_hash", "status", "version", "submitted_at", "verified_at") SELECT "id", "user_id", "verifier_did", "presentation_type", "challenge", "presentation_hash", "status", "version", "submitted_at", "verified_at" FROM `verifiable_presentations`;--> statement-breakpoint
DROP TABLE `verifiable_presentations`;--> statement-breakpoint
ALTER TABLE `__new_verifiable_presentations` RENAME TO `verifiable_presentations`;--> statement-breakpoint
CREATE UNIQUE INDEX `verifiable_presentations_presentation_hash_unique` ON `verifiable_presentations` (`presentation_hash`);--> statement-breakpoint
CREATE INDEX `idx_vp_user` ON `verifiable_presentations` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_vp_verifier` ON `verifiable_presentations` (`verifier_did`);--> statement-breakpoint
CREATE INDEX `idx_vp_status` ON `verifiable_presentations` (`status`);--> statement-breakpoint
CREATE TABLE `__new_balance_holds` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`account_id` integer NOT NULL,
	`asset_id` integer NOT NULL,
	`amount_base_units` text NOT NULL,
	`reason` text NOT NULL,
	`reference_type` text,
	`reference_id` text,
	`status` text DEFAULT 'active' NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`expires_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	`released_at` integer,
	FOREIGN KEY (`account_id`) REFERENCES `financial_accounts`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`asset_id`) REFERENCES `financial_assets`(`id`) ON UPDATE no action ON DELETE restrict,
	CONSTRAINT "ck_balance_holds_status" CHECK("__new_balance_holds"."status" IN ('active', 'released', 'expired', 'consumed')),
	CONSTRAINT "ck_balance_holds_amount_positive" CHECK("__new_balance_holds"."amount_base_units" <> '' AND ltrim("__new_balance_holds"."amount_base_units", '0123456789') = '' AND "__new_balance_holds"."amount_base_units" <> '0' AND ltrim("__new_balance_holds"."amount_base_units", '0') = "__new_balance_holds"."amount_base_units"),
	CONSTRAINT "ck_balance_holds_released_state" CHECK("__new_balance_holds"."status" != 'released' OR "__new_balance_holds"."released_at" IS NOT NULL),
	CONSTRAINT "ck_balance_holds_expired_state" CHECK("__new_balance_holds"."status" != 'expired' OR "__new_balance_holds"."expires_at" IS NOT NULL),
	CONSTRAINT "ck_balance_holds_version" CHECK("__new_balance_holds"."version" > 0)
);
--> statement-breakpoint
INSERT INTO `__new_balance_holds`("id", "account_id", "asset_id", "amount_base_units", "reason", "reference_type", "reference_id", "status", "version", "expires_at", "created_at", "updated_at", "released_at") SELECT "id", "account_id", "asset_id", "amount_base_units", "reason", "reference_type", "reference_id", "status", "version", "expires_at", "created_at", "updated_at", "released_at" FROM `balance_holds`;--> statement-breakpoint
DROP TABLE `balance_holds`;--> statement-breakpoint
ALTER TABLE `__new_balance_holds` RENAME TO `balance_holds`;--> statement-breakpoint
CREATE INDEX `idx_balance_holds_account` ON `balance_holds` (`account_id`);--> statement-breakpoint
CREATE INDEX `idx_balance_holds_asset` ON `balance_holds` (`asset_id`);--> statement-breakpoint
CREATE INDEX `idx_balance_holds_status` ON `balance_holds` (`status`);--> statement-breakpoint
CREATE INDEX `idx_balance_holds_reference` ON `balance_holds` (`reference_type`,`reference_id`);