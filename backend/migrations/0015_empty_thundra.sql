ALTER TABLE `emails` ADD `delivered_at` integer;--> statement-breakpoint
ALTER TABLE `emails` ADD `opened_at` integer;--> statement-breakpoint
ALTER TABLE `emails` ADD `bounced_at` integer;--> statement-breakpoint
ALTER TABLE `emails` ADD `error_message` text;--> statement-breakpoint
ALTER TABLE `emails` ADD `provider_payload` text;