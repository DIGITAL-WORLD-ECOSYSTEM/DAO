PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`author_id` integer NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`content` text NOT NULL,
	`cover_url` text,
	`category` text DEFAULT 'Geral',
	`tags` text,
	`total_views` integer DEFAULT 0,
	`total_shares` integer DEFAULT 0,
	`total_favorites` integer DEFAULT 0,
	`time_to_read` integer DEFAULT 5,
	`is_featured` integer DEFAULT false,
	`is_trending` integer DEFAULT false,
	`status` text DEFAULT 'draft',
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_posts`("id", "author_id", "title", "slug", "description", "content", "cover_url", "category", "tags", "total_views", "total_shares", "total_favorites", "time_to_read", "is_featured", "is_trending", "status", "created_at", "updated_at") SELECT "id", "author_id", "title", "slug", "description", "content", "cover_url", "category", "tags", "total_views", "total_shares", "total_favorites", "time_to_read", "is_featured", "is_trending", "status", "created_at", "updated_at" FROM `posts`;--> statement-breakpoint
DROP TABLE `posts`;--> statement-breakpoint
ALTER TABLE `__new_posts` RENAME TO `posts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `posts_slug_unique` ON `posts` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_posts_slug` ON `posts` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_posts_status` ON `posts` (`status`);--> statement-breakpoint
CREATE INDEX `idx_posts_category` ON `posts` (`category`);