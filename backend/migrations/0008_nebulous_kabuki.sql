ALTER TABLE `users` ADD `citizen_id` integer;--> statement-breakpoint
ALTER TABLE `users` ADD `active` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `status` text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `consent_accepted` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `consent_version` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `consent_timestamp` integer;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_users_citizen_id_unique` ON `users` (`citizen_id`);--> statement-breakpoint
CREATE INDEX `idx_citizens_user` ON `citizens` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_sessions_user` ON `user_sessions` (`user_id`);