CREATE TABLE `audit_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`action` varchar(100) NOT NULL,
	`entityType` varchar(100),
	`entityId` int,
	`details` text,
	`ipAddress` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `message_threads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subject` varchar(255),
	`createdByUserId` int NOT NULL,
	`lastMessageAt` timestamp NOT NULL DEFAULT (now()),
	`isArchived` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `message_threads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recently_viewed` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`resourceId` int NOT NULL,
	`resourceType` varchar(50) NOT NULL DEFAULT 'county_resource',
	`resourceName` varchar(200),
	`viewedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `recently_viewed_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `thread_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`threadId` int NOT NULL,
	`senderUserId` int NOT NULL,
	`content` text NOT NULL,
	`isSystemMessage` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `thread_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `thread_participants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`threadId` int NOT NULL,
	`userId` int NOT NULL,
	`lastReadAt` timestamp,
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `thread_participants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`uploadedByUserId` int,
	`fileName` varchar(255) NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`fileUrl` text NOT NULL,
	`fileSize` int,
	`mimeType` varchar(100),
	`documentType` enum('government_id','insurance_card','court_document','consent_form','recovery_plan','medical_record','employment_doc','housing_doc','probation_doc','other') NOT NULL DEFAULT 'other',
	`description` text,
	`isSharedWithProviders` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`resourceId` int NOT NULL,
	`resourceType` varchar(50) NOT NULL DEFAULT 'county_resource',
	`resourceName` varchar(200),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_favorites_id` PRIMARY KEY(`id`)
);
