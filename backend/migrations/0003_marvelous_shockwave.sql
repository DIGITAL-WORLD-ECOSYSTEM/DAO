CREATE TABLE `re_properties` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`uuid` text NOT NULL,
	`citizen_id` integer,
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
	FOREIGN KEY (`citizen_id`) REFERENCES `citizens`(`id`) ON UPDATE no action ON DELETE set null
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
	`actor_citizen_id` integer,
	`action` text NOT NULL,
	`old_value` text,
	`new_value` text,
	`ip_address` text,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`property_id`) REFERENCES `re_properties`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`actor_citizen_id`) REFERENCES `citizens`(`id`) ON UPDATE no action ON DELETE set null
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
	`citizen_id` integer,
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
	FOREIGN KEY (`citizen_id`) REFERENCES `citizens`(`id`) ON UPDATE no action ON DELETE set null
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
	`actor_citizen_id` integer,
	`step` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`notes` text,
	`completed_at` integer,
	`created_at` integer DEFAULT (strftime('%s', 'now')),
	FOREIGN KEY (`property_id`) REFERENCES `re_properties`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`actor_citizen_id`) REFERENCES `citizens`(`id`) ON UPDATE no action ON DELETE set null
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
