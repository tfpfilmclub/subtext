CREATE TABLE `comments` (
	`id` text PRIMARY KEY NOT NULL,
	`story` text NOT NULL,
	`visitor` text NOT NULL,
	`name` text NOT NULL,
	`text` text NOT NULL,
	`created_at` text NOT NULL,
	`status` text DEFAULT 'published' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `comments_story_date` ON `comments` (`story`,`created_at`);--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`bucket` text NOT NULL,
	`hour` integer NOT NULL,
	`count` integer NOT NULL,
	PRIMARY KEY(`bucket`, `hour`)
);
--> statement-breakpoint
CREATE TABLE `reactions` (
	`story` text NOT NULL,
	`visitor` text NOT NULL,
	`reaction` text NOT NULL,
	PRIMARY KEY(`story`, `visitor`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`comment_id` text NOT NULL,
	`visitor` text NOT NULL,
	PRIMARY KEY(`comment_id`, `visitor`)
);
