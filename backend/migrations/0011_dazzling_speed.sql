ALTER TABLE `contracts` ADD `installment_value` integer;--> statement-breakpoint
ALTER TABLE `contracts` ADD `paid_installments` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `contracts` ADD `next_due_date` integer;--> statement-breakpoint
ALTER TABLE `treasury_ledger` ADD `citizen_id` integer REFERENCES citizens(id);--> statement-breakpoint
CREATE INDEX `idx_treasury_citizen` ON `treasury_ledger` (`citizen_id`);