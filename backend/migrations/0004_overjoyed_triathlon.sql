CREATE TABLE `bounties` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`creator_id` integer,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`reward_amount` integer,
	`reward_token` text DEFAULT 'ASPPIBRA',
	`status?` text DEFAULT 'open',
	`difficulty?` text DEFAULT 'medium',
	`assignee_id` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assignee_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_bounties_status` ON `bounties` (`status?`);--> statement-breakpoint
CREATE TABLE `gov_proposals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`creator_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`content` text,
	`status` text DEFAULT 'active',
	`type` text DEFAULT 'business',
	`voting_start` integer,
	`voting_end` integer,
	`quorum` integer DEFAULT 10,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_gov_status` ON `gov_proposals` (`status`);--> statement-breakpoint
CREATE TABLE `gov_votes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`proposal_id` integer NOT NULL,
	`voter_id` integer NOT NULL,
	`support` integer NOT NULL,
	`voting_power` integer DEFAULT 1,
	`reason` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`proposal_id`) REFERENCES `gov_proposals`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`voter_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_proposal_voter` ON `gov_votes` (`proposal_id`,`voter_id`);--> statement-breakpoint
CREATE TABLE `treasury_ledger` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`category` text DEFAULT 'other',
	`amount_cents` integer NOT NULL,
	`currency` text DEFAULT 'BRL',
	`description` text NOT NULL,
	`tx_hash` text,
	`status` text DEFAULT 'completed',
	`created_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
CREATE INDEX `idx_treasury_type` ON `treasury_ledger` (`type`);