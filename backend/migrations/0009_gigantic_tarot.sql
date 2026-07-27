CREATE TABLE `audit_logs_immutable` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_id` integer,
	`actor_ip` text,
	`actor_user_agent` text,
	`action` text NOT NULL,
	`resource` text,
	`event_hash` text NOT NULL,
	`previous_hash` text,
	`reason` text,
	`status` text DEFAULT 'success',
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`actor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `audit_logs_immutable_event_hash_unique` ON `audit_logs_immutable` (`event_hash`);--> statement-breakpoint
CREATE TABLE `integration_configs` (
	`id` text PRIMARY KEY NOT NULL,
	`provider` text NOT NULL,
	`category` text NOT NULL,
	`environment` text DEFAULT 'production' NOT NULL,
	`base_url` text,
	`sandbox_mode` integer DEFAULT false,
	`risk_classification` text DEFAULT 'MEDIUM' NOT NULL,
	`rotation_interval_days` integer,
	`next_rotation_at` integer,
	`status` text DEFAULT 'missing',
	`dependencies` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_integration_provider_env` ON `integration_configs` (`provider`,`environment`);--> statement-breakpoint
CREATE TABLE `integration_secret_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`secret_id` text NOT NULL,
	`encrypted_value` text NOT NULL,
	`version` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`created_by` integer,
	FOREIGN KEY (`secret_id`) REFERENCES `integration_secrets`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `integration_secrets` (
	`id` text PRIMARY KEY NOT NULL,
	`config_id` text NOT NULL,
	`key_name` text NOT NULL,
	`encrypted_value` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`scopes_allowed` text,
	`lease_expires_at` integer,
	`owner_role` text DEFAULT 'dev',
	`owner_user_id` integer,
	`updated_by` integer,
	`updated_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`config_id`) REFERENCES `integration_configs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`owner_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_integration_secret_config_key` ON `integration_secrets` (`config_id`,`key_name`);