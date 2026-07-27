CREATE TABLE `user_notification_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`type` text NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_notifications_user_type` ON `user_notification_settings` (`user_id`,`type`);--> statement-breakpoint
CREATE TABLE `user_social_links` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`provider` text NOT NULL,
	`url` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_socials_user_provider` ON `user_social_links` (`user_id`,`provider`);--> statement-breakpoint
ALTER TABLE `citizens` ADD `occupation` text;--> statement-breakpoint
ALTER TABLE `citizens` ADD `company` text;--> statement-breakpoint
ALTER TABLE `citizens` ADD `website` text;--> statement-breakpoint
ALTER TABLE `citizens` ADD `about` text;--> statement-breakpoint
ALTER TABLE `citizens` ADD `is_public` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `citizens` ADD `country` text DEFAULT 'BR';--> statement-breakpoint
ALTER TABLE `citizens` ADD `state` text;--> statement-breakpoint
ALTER TABLE `citizens` ADD `city` text;--> statement-breakpoint
ALTER TABLE `citizens` ADD `zip_code` text;--> statement-breakpoint
ALTER TABLE `citizens` ADD `address` text;