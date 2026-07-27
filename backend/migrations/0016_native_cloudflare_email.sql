ALTER TABLE `email_attachments` ADD `content_disposition` text;--> statement-breakpoint
ALTER TABLE `email_attachments` ADD `inline` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `email_attachments` ADD `cid` text;--> statement-breakpoint
ALTER TABLE `email_attachments` ADD `sha256` text;--> statement-breakpoint
ALTER TABLE `email_attachments` ADD `virus_status` text DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `emails` ADD `in_reply_to` text;--> statement-breakpoint
ALTER TABLE `emails` ADD `references` text;--> statement-breakpoint
ALTER TABLE `emails` ADD `provider` text DEFAULT 'cloudflare';--> statement-breakpoint
ALTER TABLE `emails` ADD `received_at` integer;--> statement-breakpoint
ALTER TABLE `emails` ADD `processed_at` integer;--> statement-breakpoint
ALTER TABLE `emails` ADD `auth_metadata` text;--> statement-breakpoint
CREATE UNIQUE INDEX `emails_message_id_unique` ON `emails` (`message_id`);