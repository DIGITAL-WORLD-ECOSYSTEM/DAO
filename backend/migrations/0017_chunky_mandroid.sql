DROP TABLE `email_folders`;--> statement-breakpoint
DROP TABLE `email_sync_jobs`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_emails` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text,
	`thread_id` text,
	`direction` text DEFAULT 'outbound' NOT NULL,
	`sender` text NOT NULL,
	`recipient` text NOT NULL,
	`cc` text,
	`bcc` text,
	`subject` text NOT NULL,
	`body_html` text,
	`body_text` text,
	`status` text DEFAULT 'sent' NOT NULL,
	`priority` text DEFAULT 'normal',
	`message_id` text,
	`in_reply_to` text,
	`references` text,
	`provider` text DEFAULT 'cloudflare',
	`delivered_at` integer,
	`received_at` integer,
	`processed_at` integer,
	`opened_at` integer,
	`bounced_at` integer,
	`error_message` text,
	`provider_payload` text,
	`auth_metadata` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`account_id`) REFERENCES `email_accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`thread_id`) REFERENCES `email_threads`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_emails`("id", "account_id", "thread_id", "direction", "sender", "recipient", "cc", "bcc", "subject", "body_html", "body_text", "status", "priority", "message_id", "in_reply_to", "references", "provider", "delivered_at", "received_at", "processed_at", "opened_at", "bounced_at", "error_message", "provider_payload", "auth_metadata", "created_at") SELECT "id", "account_id", "thread_id", "direction", "sender", "recipient", "cc", "bcc", "subject", "body_html", "body_text", "status", "priority", "message_id", "in_reply_to", "references", "provider", "delivered_at", "received_at", "processed_at", "opened_at", "bounced_at", "error_message", "provider_payload", "auth_metadata", "created_at" FROM `emails`;--> statement-breakpoint
DROP TABLE `emails`;--> statement-breakpoint
ALTER TABLE `__new_emails` RENAME TO `emails`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `emails_message_id_unique` ON `emails` (`message_id`);--> statement-breakpoint
CREATE INDEX `idx_emails_account_id` ON `emails` (`account_id`);--> statement-breakpoint
CREATE INDEX `idx_emails_thread_id` ON `emails` (`thread_id`);--> statement-breakpoint
CREATE INDEX `idx_emails_created_at` ON `emails` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_emails_message_id` ON `emails` (`message_id`);--> statement-breakpoint
CREATE TABLE `__new_email_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`department` text,
	`email` text NOT NULL,
	`display_name` text,
	`type` text,
	`criticality` text,
	`provider_inbound` text DEFAULT 'cloudflare',
	`provider_outbound` text DEFAULT 'resend',
	`signature_html` text,
	`reply_to` text,
	`color` text,
	`status` text DEFAULT 'Provisionando',
	`health_status` text DEFAULT 'Cinza',
	`used_space_mb` integer DEFAULT 0,
	`total_messages` integer DEFAULT 0,
	`total_attachments` integer DEFAULT 0,
	`last_cleaned_at` integer,
	`retention_days` integer DEFAULT 365,
	`owner_user_id` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_email_accounts`("id", "department", "email", "display_name", "type", "criticality", "provider_inbound", "provider_outbound", "signature_html", "reply_to", "color", "status", "health_status", "used_space_mb", "total_messages", "total_attachments", "last_cleaned_at", "retention_days", "owner_user_id", "created_at", "updated_at") SELECT "id", "department", "email", "display_name", "type", "criticality", "provider_inbound", "provider_outbound", "signature_html", "reply_to", "color", "status", "health_status", "used_space_mb", "total_messages", "total_attachments", "last_cleaned_at", "retention_days", "owner_user_id", "created_at", "updated_at" FROM `email_accounts`;--> statement-breakpoint
DROP TABLE `email_accounts`;--> statement-breakpoint
ALTER TABLE `__new_email_accounts` RENAME TO `email_accounts`;--> statement-breakpoint
CREATE UNIQUE INDEX `email_accounts_email_unique` ON `email_accounts` (`email`);