CREATE TABLE `auth_challenges` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer,
	`challenge` text NOT NULL,
	`challenge_type` text NOT NULL,
	`used` integer DEFAULT false,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`jti` text NOT NULL,
	`ip` text,
	`user_agent` text,
	`refresh_token_hash` text NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`expires_at` integer NOT NULL,
	`revoked` integer DEFAULT false,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
ALTER TABLE `users` ADD `token_version` integer DEFAULT 1 NOT NULL;