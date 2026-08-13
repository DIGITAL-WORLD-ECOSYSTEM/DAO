CREATE TABLE `notifications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`type` text NOT NULL,
	`category` text NOT NULL,
	`title` text NOT NULL,
	`message` text,
	`data` text,
	`is_read` integer DEFAULT false NOT NULL,
	`read_at` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_notifications_user_id` ON `notifications` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_notifications_is_read` ON `notifications` (`is_read`);--> statement-breakpoint
CREATE INDEX `idx_notifications_created_at` ON `notifications` (`created_at`);