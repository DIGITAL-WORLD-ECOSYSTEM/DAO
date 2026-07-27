CREATE TABLE `email_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`department` text,
	`email` text NOT NULL,
	`display_name` text,
	`type` text,
	`criticality` text,
	`provider_inbound` text DEFAULT 'zoho',
	`provider_outbound` text DEFAULT 'resend',
	`imap_host` text,
	`imap_port` integer,
	`oauth_token` text,
	`app_password` text,
	`signature_html` text,
	`reply_to` text,
	`color` text,
	`status` text DEFAULT 'Provisionando',
	`health_status` text DEFAULT 'Cinza',
	`used_space_mb` integer DEFAULT 0,
	`total_messages` integer DEFAULT 0,
	`total_attachments` integer DEFAULT 0,
	`last_cleaned_at` integer,
	`sync_enabled` integer DEFAULT false,
	`sync_frequency_min` integer DEFAULT 15,
	`retention_days` integer DEFAULT 365,
	`last_sync_timestamp` integer,
	`last_imap_uid` integer,
	`owner_user_id` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `email_accounts_email_unique` ON `email_accounts` (`email`);--> statement-breakpoint
CREATE TABLE `email_attachments` (
	`id` text PRIMARY KEY NOT NULL,
	`email_id` text NOT NULL,
	`name` text NOT NULL,
	`mime_type` text NOT NULL,
	`size_bytes` integer NOT NULL,
	`r2_key` text NOT NULL,
	`public_url` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`email_id`) REFERENCES `emails`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `email_folders` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`name` text NOT NULL,
	`is_system` integer DEFAULT false,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`account_id`) REFERENCES `email_accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `email_labels` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`name` text NOT NULL,
	`color` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`account_id`) REFERENCES `email_accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `email_message_labels` (
	`message_id` text NOT NULL,
	`label_id` text NOT NULL,
	PRIMARY KEY(`message_id`, `label_id`),
	FOREIGN KEY (`message_id`) REFERENCES `emails`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`label_id`) REFERENCES `email_labels`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `email_sync_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`started_at` integer NOT NULL,
	`finished_at` integer,
	`duration_ms` integer,
	`emails_imported` integer DEFAULT 0,
	`errors` text,
	`status` text DEFAULT 'Running',
	`worker_version` text,
	FOREIGN KEY (`account_id`) REFERENCES `email_accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `email_threads` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`subject` text NOT NULL,
	`participants` text,
	`message_count` integer DEFAULT 1,
	`status` text DEFAULT 'active',
	`last_message_date` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`account_id`) REFERENCES `email_accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `emails` ADD `account_id` text REFERENCES email_accounts(id);--> statement-breakpoint
ALTER TABLE `emails` ADD `folder_id` text REFERENCES email_folders(id);--> statement-breakpoint
ALTER TABLE `emails` ADD `thread_id` text REFERENCES email_threads(id);--> statement-breakpoint
ALTER TABLE `emails` ADD `cc` text;--> statement-breakpoint
ALTER TABLE `emails` ADD `bcc` text;--> statement-breakpoint
ALTER TABLE `emails` ADD `body_text` text;--> statement-breakpoint
ALTER TABLE `emails` ADD `priority` text DEFAULT 'normal';