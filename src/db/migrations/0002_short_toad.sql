ALTER TABLE `users` RENAME COLUMN "update_at" TO "updated_at";--> statement-breakpoint
ALTER TABLE `users` ADD `deleted_at` text;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_groups` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'waiting' NOT NULL,
	`owner_id` text NOT NULL,
	`event_date` text NOT NULL,
	`budget` real,
	`maximum_participants` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` text,
	`drawn_at` text,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_groups`("id", "name", "description", "status", "owner_id", "event_date", "budget", "maximum_participants", "created_at", "updated_at", "deleted_at", "drawn_at") SELECT "id", "name", "description", "status", "owner_id", "event_date", "budget", "maximum_participants", "created_at", "updated_at", "deleted_at", "drawn_at" FROM `groups`;--> statement-breakpoint
DROP TABLE `groups`;--> statement-breakpoint
ALTER TABLE `__new_groups` RENAME TO `groups`;--> statement-breakpoint
PRAGMA foreign_keys=ON;