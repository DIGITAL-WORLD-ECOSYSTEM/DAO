CREATE INDEX `idx_emails_account_id` ON `emails` (`account_id`);--> statement-breakpoint
CREATE INDEX `idx_emails_folder_id` ON `emails` (`folder_id`);--> statement-breakpoint
CREATE INDEX `idx_emails_thread_id` ON `emails` (`thread_id`);--> statement-breakpoint
CREATE INDEX `idx_emails_created_at` ON `emails` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_emails_message_id` ON `emails` (`message_id`);