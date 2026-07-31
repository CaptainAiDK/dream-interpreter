CREATE TABLE `dreamInterpretations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dreamId` int NOT NULL,
	`symbolAnalysis` text,
	`psychologicalInsights` text,
	`emotionalThemes` text,
	`recommendations` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dreamInterpretations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dreams` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`dreamText` text NOT NULL,
	`category` varchar(50),
	`scenarioType` varchar(100),
	`interpretation` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dreams_id` PRIMARY KEY(`id`)
);
