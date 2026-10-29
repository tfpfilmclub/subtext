CREATE TABLE `article_views` (
	`story` text PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `view_sessions` (
	`story` text NOT NULL,
	`visitor` text NOT NULL,
	`last_counted_at` integer NOT NULL,
	PRIMARY KEY(`story`, `visitor`)
);
--> statement-breakpoint
CREATE INDEX `view_sessions_last_counted` ON `view_sessions` (`last_counted_at`);