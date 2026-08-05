ALTER TABLE `citizens` ADD `status` text DEFAULT 'PENDING' NOT NULL;--> statement-breakpoint
ALTER TABLE `citizens` ADD `version` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_treasury_created` ON `treasury_ledger` (`created_at`);