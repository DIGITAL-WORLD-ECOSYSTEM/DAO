CREATE TABLE `audit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`actor_id` integer,
	`target_user_id` integer,
	`action` text NOT NULL,
	`status` text DEFAULT 'success',
	`ip_address` text,
	`metadata` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`actor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`target_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_audit_action` ON `audit_logs` (`action`);--> statement-breakpoint
CREATE INDEX `idx_audit_actor` ON `audit_logs` (`actor_id`);--> statement-breakpoint
CREATE TABLE `audit_logs_immutable` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_id` integer,
	`actor_ip` text,
	`actor_user_agent` text,
	`action` text NOT NULL,
	`resource` text,
	`event_hash` text NOT NULL,
	`previous_hash` text,
	`reason` text,
	`status` text DEFAULT 'success',
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`actor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `audit_logs_immutable_event_hash_unique` ON `audit_logs_immutable` (`event_hash`);--> statement-breakpoint
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
CREATE TABLE `bounties` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`creator_id` integer,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`reward_amount` integer,
	`reward_token` text DEFAULT 'ASPPIBRA',
	`status` text DEFAULT 'open',
	`difficulty` text DEFAULT 'medium',
	`assignee_id` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`creator_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`assignee_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_bounties_status` ON `bounties` (`status`);--> statement-breakpoint
CREATE TABLE `chat_attachments` (
	`id` text PRIMARY KEY NOT NULL,
	`message_id` text NOT NULL,
	`r2_key` text NOT NULL,
	`mime` text,
	`size` integer,
	`width` integer,
	`height` integer,
	`duration` integer,
	FOREIGN KEY (`message_id`) REFERENCES `chat_messages`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `chat_conversations` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`category` text NOT NULL,
	`title` text,
	`description` text,
	`owner_id` integer,
	`status` text DEFAULT 'active',
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now')),
	`deleted_at` integer,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `chat_events` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text NOT NULL,
	`event` text NOT NULL,
	`user_id` integer,
	`metadata` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`conversation_id`) REFERENCES `chat_conversations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`conversation_id` text NOT NULL,
	`sender_id` integer,
	`type` text DEFAULT 'text',
	`body` text NOT NULL,
	`status` text DEFAULT 'sent',
	`reply_to` text,
	`metadata` text,
	`version` integer DEFAULT 1,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`edited_at` integer,
	`deleted_at` integer,
	FOREIGN KEY (`conversation_id`) REFERENCES `chat_conversations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sender_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_chat_messages_convo` ON `chat_messages` (`conversation_id`);--> statement-breakpoint
CREATE INDEX `idx_chat_messages_created_at` ON `chat_messages` (`created_at`);--> statement-breakpoint
CREATE TABLE `chat_participants` (
	`conversation_id` text NOT NULL,
	`user_id` integer NOT NULL,
	`role` text DEFAULT 'member',
	`joined_at` integer DEFAULT (strftime('%s', 'now')),
	`last_read_message_id` text,
	`last_read_at` integer,
	`muted` integer DEFAULT false,
	`archived` integer DEFAULT false,
	`pinned` integer DEFAULT false,
	`presence` text DEFAULT 'offline',
	`last_seen` integer,
	PRIMARY KEY(`conversation_id`, `user_id`),
	FOREIGN KEY (`conversation_id`) REFERENCES `chat_conversations`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_chat_participants_convo` ON `chat_participants` (`conversation_id`);--> statement-breakpoint
CREATE INDEX `idx_chat_participants_user` ON `chat_participants` (`user_id`);--> statement-breakpoint
CREATE TABLE `chat_read_receipts` (
	`message_id` text NOT NULL,
	`user_id` integer NOT NULL,
	`read_at` integer DEFAULT (strftime('%s', 'now')),
	PRIMARY KEY(`message_id`, `user_id`),
	FOREIGN KEY (`message_id`) REFERENCES `chat_messages`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `citizens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`username` text NOT NULL,
	`first_name` text,
	`last_name` text,
	`did` text,
	`public_key` text,
	`rg` text,
	`orgao_emissor` text,
	`cpf` text,
	`nacionalidade` text,
	`data_nascimento` text,
	`estado_civil` text,
	`profissao` text,
	`cargo_osc` text,
	`cargo_projects` text,
	`department` text,
	`mandate` text,
	`seniority_level` text,
	`leadership_style` text,
	`academic_info` text,
	`professional_experience` text,
	`profile_tags` text,
	`phone_number` text,
	`occupation` text,
	`company` text,
	`website` text,
	`about` text,
	`is_public` integer DEFAULT false NOT NULL,
	`country` text DEFAULT 'BR',
	`state` text,
	`city` text,
	`zip_code` text,
	`address` text,
	`encrypted_vault` text,
	`passkey_id` text,
	`passkey_public_key` text,
	`totp_secret` text,
	`totp_enabled` integer DEFAULT false,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `citizens_username_unique` ON `citizens` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `citizens_did_unique` ON `citizens` (`did`);--> statement-breakpoint
CREATE UNIQUE INDEX `citizens_cpf_unique` ON `citizens` (`cpf`);--> statement-breakpoint
CREATE INDEX `idx_citizens_username` ON `citizens` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_citizens_did` ON `citizens` (`did`);--> statement-breakpoint
CREATE INDEX `idx_citizens_user` ON `citizens` (`user_id`);--> statement-breakpoint
CREATE TABLE `contracts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`description` text NOT NULL,
	`total_value` integer NOT NULL,
	`installment_value` integer,
	`total_installments` integer,
	`paid_installments` integer DEFAULT 0,
	`next_due_date` integer,
	`status` text DEFAULT 'active',
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `email_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`department` text,
	`email` text NOT NULL,
	`display_name` text,
	`type` text,
	`criticality` text,
	`provider_inbound` text DEFAULT 'cloudflare',
	`provider_outbound` text DEFAULT 'resend',
	`signature_html` text,
	`reply_to` text,
	`color` text,
	`status` text DEFAULT 'Provisionando',
	`health_status` text DEFAULT 'Cinza',
	`used_space_mb` integer DEFAULT 0,
	`total_messages` integer DEFAULT 0,
	`total_attachments` integer DEFAULT 0,
	`last_cleaned_at` integer,
	`retention_days` integer DEFAULT 365,
	`owner_user_id` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `email_accounts_email_unique` ON `email_accounts` (`email`);--> statement-breakpoint
CREATE TABLE `email_attachments` (
	`id` text PRIMARY KEY NOT NULL,
	`email_id` text NOT NULL,
	`name` text NOT NULL,
	`mime_type` text NOT NULL,
	`size_bytes` integer NOT NULL,
	`r2_key` text NOT NULL,
	`public_url` text,
	`content_disposition` text,
	`inline` integer DEFAULT false,
	`cid` text,
	`sha256` text,
	`virus_status` text DEFAULT 'pending',
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`email_id`) REFERENCES `emails`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
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
--> statement-breakpoint
CREATE TABLE `email_labels` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`name` text NOT NULL,
	`color` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`account_id`) REFERENCES `email_accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `email_message_labels` (
	`message_id` text NOT NULL,
	`label_id` text NOT NULL,
	PRIMARY KEY(`message_id`, `label_id`),
	FOREIGN KEY (`message_id`) REFERENCES `emails`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`label_id`) REFERENCES `email_labels`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `email_threads` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`subject` text NOT NULL,
	`participants` text,
	`message_count` integer DEFAULT 1,
	`status` text DEFAULT 'active',
	`last_message_date` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`account_id`) REFERENCES `email_accounts`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `emails` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text,
	`thread_id` text,
	`direction` text DEFAULT 'outbound' NOT NULL,
	`sender` text NOT NULL,
	`recipient` text NOT NULL,
	`cc` text,
	`bcc` text,
	`subject` text NOT NULL,
	`body_html` text,
	`body_text` text,
	`status` text DEFAULT 'sent' NOT NULL,
	`priority` text DEFAULT 'normal',
	`message_id` text,
	`in_reply_to` text,
	`references` text,
	`provider` text DEFAULT 'cloudflare',
	`delivered_at` integer,
	`received_at` integer,
	`processed_at` integer,
	`opened_at` integer,
	`bounced_at` integer,
	`error_message` text,
	`provider_payload` text,
	`auth_metadata` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`account_id`) REFERENCES `email_accounts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`thread_id`) REFERENCES `email_threads`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `emails_message_id_unique` ON `emails` (`message_id`);--> statement-breakpoint
CREATE INDEX `idx_emails_account_id` ON `emails` (`account_id`);--> statement-breakpoint
CREATE INDEX `idx_emails_thread_id` ON `emails` (`thread_id`);--> statement-breakpoint
CREATE INDEX `idx_emails_created_at` ON `emails` (`created_at`);--> statement-breakpoint
CREATE INDEX `idx_emails_message_id` ON `emails` (`message_id`);--> statement-breakpoint
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
CREATE TABLE `integration_configs` (
	`id` text PRIMARY KEY NOT NULL,
	`provider` text NOT NULL,
	`category` text NOT NULL,
	`environment` text DEFAULT 'production' NOT NULL,
	`base_url` text,
	`sandbox_mode` integer DEFAULT false,
	`risk_classification` text DEFAULT 'MEDIUM' NOT NULL,
	`rotation_interval_days` integer,
	`next_rotation_at` integer,
	`status` text DEFAULT 'missing',
	`dependencies` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_integration_provider_env` ON `integration_configs` (`provider`,`environment`);--> statement-breakpoint
CREATE TABLE `integration_secret_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`secret_id` text NOT NULL,
	`encrypted_value` text NOT NULL,
	`version` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`created_by` integer,
	FOREIGN KEY (`secret_id`) REFERENCES `integration_secrets`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `integration_secrets` (
	`id` text PRIMARY KEY NOT NULL,
	`config_id` text NOT NULL,
	`key_name` text NOT NULL,
	`encrypted_value` text NOT NULL,
	`version` integer DEFAULT 1 NOT NULL,
	`scopes_allowed` text,
	`lease_expires_at` integer,
	`owner_role` text DEFAULT 'dev',
	`owner_user_id` integer,
	`updated_by` integer,
	`updated_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`config_id`) REFERENCES `integration_configs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`owner_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_integration_secret_config_key` ON `integration_secrets` (`config_id`,`key_name`);--> statement-breakpoint
CREATE TABLE `membership_cards` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`card_hash` text NOT NULL,
	`tier` text DEFAULT 'citizen',
	`issue_date` integer DEFAULT (strftime('%s', 'now')),
	`expiry_date` integer,
	`qr_code_url` text,
	`status` text DEFAULT 'active',
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `membership_cards_card_hash_unique` ON `membership_cards` (`card_hash`);--> statement-breakpoint
CREATE INDEX `idx_cards_user` ON `membership_cards` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_cards_hash` ON `membership_cards` (`card_hash`);--> statement-breakpoint
CREATE TABLE `password_resets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`token` text NOT NULL,
	`expires_at` integer NOT NULL,
	`used` integer DEFAULT false,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `password_resets_token_unique` ON `password_resets` (`token`);--> statement-breakpoint
CREATE TABLE `post_comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`post_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`content` text NOT NULL,
	`likes` integer DEFAULT 0,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_comments_post` ON `post_comments` (`post_id`);--> statement-breakpoint
CREATE INDEX `idx_comments_user` ON `post_comments` (`user_id`);--> statement-breakpoint
CREATE TABLE `post_favorites` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`post_id` integer NOT NULL,
	`user_id` integer NOT NULL,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`post_id`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `unique_post_user_favorite` ON `post_favorites` (`post_id`,`user_id`);--> statement-breakpoint
CREATE TABLE `posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`author_id` integer NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`content` text NOT NULL,
	`cover_url` text,
	`cover_alt` text,
	`category` text DEFAULT 'Tecnologia',
	`tags` text,
	`meta_title` text,
	`meta_description` text,
	`meta_keywords` text,
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
CREATE UNIQUE INDEX `posts_slug_unique` ON `posts` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_posts_slug` ON `posts` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_posts_status` ON `posts` (`status`);--> statement-breakpoint
CREATE INDEX `idx_posts_category` ON `posts` (`category`);--> statement-breakpoint
CREATE TABLE `re_properties` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`user_id` integer,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`property_type` text DEFAULT 'urban' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`registration_number_rgi` text,
	`iptu_number` text,
	`ipfs_cid_metadata` text,
	`ipfs_cid_document` text,
	`workflow_step` text DEFAULT 'digitalization' NOT NULL,
	`is_tokenized` integer DEFAULT false,
	`is_featured` integer DEFAULT false,
	`notes` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `re_properties_uuid_unique` ON `re_properties` (`uuid`);--> statement-breakpoint
CREATE UNIQUE INDEX `re_properties_slug_unique` ON `re_properties` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `re_properties_registration_number_rgi_unique` ON `re_properties` (`registration_number_rgi`);--> statement-breakpoint
CREATE INDEX `idx_re_properties_slug` ON `re_properties` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_re_properties_status` ON `re_properties` (`status`);--> statement-breakpoint
CREATE INDEX `idx_re_properties_type` ON `re_properties` (`property_type`);--> statement-breakpoint
CREATE TABLE `re_property_audit_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`property_id` integer NOT NULL,
	`actor_user_id` integer,
	`action` text NOT NULL,
	`old_value` text,
	`new_value` text,
	`ip_address` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`property_id`) REFERENCES `re_properties`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`actor_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_re_audit_action` ON `re_property_audit_log` (`action`);--> statement-breakpoint
CREATE INDEX `idx_re_audit_property` ON `re_property_audit_log` (`property_id`);--> statement-breakpoint
CREATE TABLE `re_property_blockchain` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`property_id` integer NOT NULL,
	`chain_id` integer,
	`chain_name` text,
	`contract_address` text,
	`token_id` text,
	`token_standard` text,
	`transaction_hash` text,
	`minted_at` integer,
	`owner_wallet` text,
	`metadata_ipfs_cid` text,
	`explorer_url` text,
	`opensea_url` text,
	`is_active` integer DEFAULT false,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`property_id`) REFERENCES `re_properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_re_blockchain_contract` ON `re_property_blockchain` (`contract_address`);--> statement-breakpoint
CREATE TABLE `re_property_construction` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`property_id` integer NOT NULL,
	`floors` integer DEFAULT 1,
	`built_area_m2` integer,
	`bedrooms` integer DEFAULT 0,
	`suites` integer DEFAULT 0,
	`bathrooms` integer DEFAULT 0,
	`kitchens` integer DEFAULT 0,
	`living_rooms` integer DEFAULT 0,
	`garages` integer DEFAULT 0,
	`laundry_areas` integer DEFAULT 0,
	`courtyards` integer DEFAULT 0,
	`has_pool` integer DEFAULT false,
	`has_elevator` integer DEFAULT false,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`property_id`) REFERENCES `re_properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `re_property_documents` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`property_id` integer NOT NULL,
	`doc_type` text NOT NULL,
	`name` text NOT NULL,
	`carto_name` text,
	`carto_cnpj` text,
	`carto_book` text,
	`carto_act` text,
	`carto_folio` text,
	`registration_date` text,
	`electronic_seal` text,
	`random_code` text,
	`r2_key` text,
	`ipfs_cid` text,
	`is_public` integer DEFAULT false,
	`notes` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`property_id`) REFERENCES `re_properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_re_documents_type` ON `re_property_documents` (`doc_type`);--> statement-breakpoint
CREATE TABLE `re_property_infrastructure` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`property_id` integer NOT NULL,
	`water` integer DEFAULT false,
	`electricity` integer DEFAULT false,
	`sewage` integer DEFAULT false,
	`paving` integer DEFAULT false,
	`public_transport` integer DEFAULT false,
	`telephone_network` integer DEFAULT false,
	`gas_network` integer DEFAULT false,
	`internet` integer DEFAULT false,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`property_id`) REFERENCES `re_properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `re_property_land` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`property_id` integer NOT NULL,
	`total_area_m2` integer,
	`perimeter_m` integer,
	`terrain_type` text,
	`frontage_m` integer,
	`depth_right_m` integer,
	`depth_left_m` integer,
	`rear_m` integer,
	`boundary_front` text,
	`boundary_right` text,
	`boundary_left` text,
	`boundary_rear` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`property_id`) REFERENCES `re_properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `re_property_location` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`property_id` integer NOT NULL,
	`street` text,
	`number` integer,
	`block` text,
	`lot` text,
	`neighborhood` text,
	`city` text,
	`state` text,
	`zip_code` text,
	`country` text DEFAULT 'BR',
	`latitude` integer,
	`longitude` integer,
	`utm_zone` text,
	`utm_meridian` text,
	`utm_easting` integer,
	`utm_northing` integer,
	`geodetic_system` text DEFAULT 'SIRGAS 2000',
	`zoning_code` text,
	`zoning_description` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`property_id`) REFERENCES `re_properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_re_location_city` ON `re_property_location` (`city`);--> statement-breakpoint
CREATE INDEX `idx_re_location_state` ON `re_property_location` (`state`);--> statement-breakpoint
CREATE TABLE `re_property_media` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`property_id` integer NOT NULL,
	`media_type` text NOT NULL,
	`title` text,
	`url` text,
	`ipfs_cid` text,
	`r2_key` text,
	`is_cover` integer DEFAULT false,
	`display_order` integer DEFAULT 0,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`property_id`) REFERENCES `re_properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_re_media_type` ON `re_property_media` (`media_type`);--> statement-breakpoint
CREATE TABLE `re_property_owners` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`property_id` integer NOT NULL,
	`user_id` integer,
	`owner_type` text DEFAULT 'primary' NOT NULL,
	`full_name` text NOT NULL,
	`cpf` text,
	`rg` text,
	`birth_date` text,
	`nationality` text,
	`marital_status` text,
	`ownership_share_pct` integer DEFAULT 100,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`property_id`) REFERENCES `re_properties`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `re_property_pricing` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`property_id` integer NOT NULL,
	`price_type` text NOT NULL,
	`amount_brl_cents` integer NOT NULL,
	`amount_token` integer,
	`currency` text DEFAULT 'BRL',
	`valid_from` integer,
	`valid_until` integer,
	`payment_method` text,
	`terms` text,
	`source` text,
	`notes` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`property_id`) REFERENCES `re_properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_re_pricing_type` ON `re_property_pricing` (`price_type`);--> statement-breakpoint
CREATE TABLE `re_property_professionals` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`property_id` integer NOT NULL,
	`role` text NOT NULL,
	`full_name` text NOT NULL,
	`cpf` text,
	`rg` text,
	`crea` text,
	`oab` text,
	`cft` text,
	`art_number` text,
	`organization_name` text,
	`cnpj` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`property_id`) REFERENCES `re_properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `re_property_workflow` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`property_id` integer NOT NULL,
	`actor_user_id` integer,
	`step` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`notes` text,
	`completed_at` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`property_id`) REFERENCES `re_properties`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`actor_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `idx_re_workflow_step` ON `re_property_workflow` (`step`);--> statement-breakpoint
CREATE INDEX `idx_re_workflow_status` ON `re_property_workflow` (`status`);--> statement-breakpoint
CREATE TABLE `re_survey_points` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`property_id` integer NOT NULL,
	`point_name` text NOT NULL,
	`easting` integer,
	`northing` integer,
	`color_marker` text,
	`description` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`property_id`) REFERENCES `re_properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `treasury_ledger` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`type` text NOT NULL,
	`category` text DEFAULT 'other',
	`amount_cents` integer NOT NULL,
	`currency` text DEFAULT 'BRL',
	`description` text NOT NULL,
	`tx_hash` text,
	`external_transaction_id` text,
	`status` text DEFAULT 'completed',
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `treasury_ledger_external_transaction_id_unique` ON `treasury_ledger` (`external_transaction_id`);--> statement-breakpoint
CREATE INDEX `idx_treasury_type` ON `treasury_ledger` (`type`);--> statement-breakpoint
CREATE INDEX `idx_treasury_user` ON `treasury_ledger` (`user_id`);--> statement-breakpoint
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
CREATE TABLE `user_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`jti` text NOT NULL,
	`ip` text,
	`user_agent` text,
	`refresh_token_hash` text NOT NULL,
	`aal` integer DEFAULT 1,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`expires_at` integer NOT NULL,
	`revoked` integer DEFAULT false,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_sessions_user` ON `user_sessions` (`user_id`);--> statement-breakpoint
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
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`email_verified` integer DEFAULT false,
	`avatar_url` text,
	`mfa_secret` text,
	`mfa_enabled` integer DEFAULT false,
	`token_version` integer DEFAULT 1 NOT NULL,
	`kyc_status` text DEFAULT 'none',
	`role` text DEFAULT 'citizen',
	`active` integer DEFAULT true NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`consent_accepted` integer DEFAULT false NOT NULL,
	`consent_version` integer DEFAULT 0 NOT NULL,
	`consent_timestamp` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	`updated_at` integer DEFAULT (strftime('%s', 'now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `idx_users_email` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `idx_users_role` ON `users` (`role`);--> statement-breakpoint
CREATE TABLE `wallets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`address` text NOT NULL,
	`chain_id` integer NOT NULL,
	`is_primary` integer DEFAULT false,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `wallets_address_unique` ON `wallets` (`address`);