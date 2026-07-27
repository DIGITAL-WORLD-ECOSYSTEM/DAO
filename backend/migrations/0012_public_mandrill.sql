CREATE TABLE `emails` (
	`id` text PRIMARY KEY NOT NULL,
	`direction` text DEFAULT 'outbound' NOT NULL,
	`sender` text NOT NULL,
	`recipient` text NOT NULL,
	`subject` text NOT NULL,
	`body_html` text,
	`status` text DEFAULT 'sent' NOT NULL,
	`message_id` text,
	`created_at` integer DEFAULT (strftime('%s', 'now'))
);
