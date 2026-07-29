ALTER TABLE `chat_messages` ADD `version` integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE `chat_participants` ADD `presence` text DEFAULT 'offline';--> statement-breakpoint
ALTER TABLE `chat_participants` ADD `last_seen` integer;