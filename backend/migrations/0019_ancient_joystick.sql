CREATE TABLE `chat_attachments` (
	`id` text PRIMARY KEY NOT NULL,
	`message_id` text NOT NULL,
	`r2_key` text NOT NULL,
	`mime` text,
	`size` integer,
	`width` integer,
	`height` integer,
	`duration` integer,
	FOREIGN KEY (`message_id`) REFERENCES `chat_messages`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `chat_conversations` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`category` text NOT NULL,
	`title` text,
	`description` text,
	`owner_id` integer,
	`status` text DEFAULT 'active',
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now')),
	`deleted_at` integer,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `chat_events` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text NOT NULL,
	`event` text NOT NULL,
	`user_id` integer,
	`metadata` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`conversation_id`) REFERENCES `chat_conversations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text NOT NULL,
	`sender_id` integer,
	`type` text DEFAULT 'text',
	`body` text NOT NULL,
	`status` text DEFAULT 'sent',
	`reply_to` text,
	`metadata` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`edited_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`conversation_id`) REFERENCES `chat_conversations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_chat_messages_convo` ON `chat_messages` (`conversation_id`);--> statement-breakpoint
CREATE INDEX `idx_chat_messages_created_at` ON `chat_messages` (`created_at`);--> statement-breakpoint
CREATE TABLE `chat_participants` (
	`conversation_id` text NOT NULL,
	`user_id` integer NOT NULL,
	`role` text DEFAULT 'member',
	`joined_at` integer DEFAULT (strftime('%s', 'now')),
	`last_read_message_id` text,
	`last_read_at` integer,
	`muted` integer DEFAULT false,
	`archived` integer DEFAULT false,
	`pinned` integer DEFAULT false,
	PRIMARY KEY(`conversation_id`, `user_id`),
	FOREIGN KEY (`conversation_id`) REFERENCES `chat_conversations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_chat_participants_convo` ON `chat_participants` (`conversation_id`);--> statement-breakpoint
CREATE INDEX `idx_chat_participants_user` ON `chat_participants` (`user_id`);--> statement-breakpoint
CREATE TABLE `chat_read_receipts` (
	`message_id` text NOT NULL,
	`user_id` integer NOT NULL,
	`read_at` integer DEFAULT (strftime('%s', 'now')),
	PRIMARY KEY(`message_id`, `user_id`),
	FOREIGN KEY (`message_id`) REFERENCES `chat_messages`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
