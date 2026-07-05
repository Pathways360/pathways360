CREATE TABLE `device_tokens` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`token` varchar(500) NOT NULL,
	`deviceType` enum('web','ios','android') NOT NULL,
	`deviceName` varchar(255),
	`isActive` boolean NOT NULL DEFAULT true,
	`lastUsedAt` timestamp DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `device_tokens_id` PRIMARY KEY(`id`),
	CONSTRAINT `device_tokens_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `notification_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('sms','push','email') NOT NULL,
	`channel` enum('certificate','milestone','referral','feed_item','appointment','reminder') NOT NULL,
	`title` varchar(255) NOT NULL,
	`body` text NOT NULL,
	`recipient` varchar(255),
	`status` enum('sent','failed','pending','delivered','read') NOT NULL DEFAULT 'pending',
	`deliveredAt` timestamp,
	`readAt` timestamp,
	`metadata` json,
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notification_history_id` PRIMARY KEY(`id`)
);
