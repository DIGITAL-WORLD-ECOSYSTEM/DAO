CREATE TABLE `outbox_events` (
	`id` text PRIMARY KEY NOT NULL,
	`aggregate_id` integer NOT NULL,
	`aggregate_type` text NOT NULL,
	`aggregate_version` integer NOT NULL,
	`event_name` text NOT NULL,
	`payload` text NOT NULL,
	`metadata` text,
	`attempts` integer DEFAULT 0 NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`published_at` integer,
	`error` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
