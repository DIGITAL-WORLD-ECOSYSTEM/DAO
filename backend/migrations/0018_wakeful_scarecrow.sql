CREATE TABLE `email_events` (
	`id` text PRIMARY KEY NOT NULL,
	`email_id` text,
	`message_id` text,
	`event` text NOT NULL,
	`source` text NOT NULL,
	`provider` text DEFAULT 'cloudflare',
	`severity` text DEFAULT 'info',
	`request_id` text,
	`correlation_id` text,
	`queue_message_id` text,
	`trace_id` text,
	`span_id` text,
	`worker_version` text,
	`duration_ms` integer,
	`metadata` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`email_id`) REFERENCES `emails`(`id`) ON UPDATE no action ON DELETE no action
);
