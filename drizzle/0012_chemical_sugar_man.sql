CREATE TABLE `bi_directional_referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`caseManagerId` int NOT NULL,
	`referralType` enum('job','resource','service','event','meal','medical','counseling') NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`details` text,
	`serviceProviderId` int,
	`serviceScheduleId` int,
	`location` varchar(255),
	`eventDate` timestamp,
	`eventTime` varchar(50),
	`status` enum('sent','viewed','accepted','declined','completed','no_show') NOT NULL DEFAULT 'sent',
	`clientResponse` varchar(255),
	`reminderSent` boolean NOT NULL DEFAULT false,
	`reminderSentAt` timestamp,
	`reminderMethod` enum('sms','email','push_notification','in_app'),
	`followUpRequired` boolean NOT NULL DEFAULT false,
	`followUpDate` timestamp,
	`outcome` text,
	`notes` text,
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	`respondedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bi_directional_referrals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `feed_interactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`feedItemId` int NOT NULL,
	`interactionType` enum('viewed','clicked','applied','accepted','declined','saved','shared') NOT NULL,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `feed_interactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `feed_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('job','resource','service','event','support_group','meal','medical','counseling','referral','milestone') NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`content` text,
	`imageUrl` varchar(500),
	`location` varchar(255),
	`eventDate` timestamp,
	`eventTime` varchar(50),
	`actionUrl` varchar(500),
	`actionLabel` varchar(100),
	`sourceType` enum('system','case_manager','resource','job_board','event','meal_program') NOT NULL,
	`sourceId` int,
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`isRead` boolean NOT NULL DEFAULT false,
	`readAt` timestamp,
	`isArchived` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `feed_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `job_applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`jobPostingId` int NOT NULL,
	`status` enum('applied','interview_scheduled','offered','accepted','rejected','withdrawn') NOT NULL DEFAULT 'applied',
	`appliedDate` timestamp NOT NULL DEFAULT (now()),
	`interviewDate` timestamp,
	`outcome` varchar(255),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `job_applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `job_postings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`employer` varchar(255) NOT NULL,
	`location` varchar(255) NOT NULL,
	`county` varchar(100),
	`jobType` enum('full_time','part_time','temporary','seasonal','contract') NOT NULL,
	`payMin` int,
	`payMax` int,
	`payFrequency` enum('hourly','weekly','monthly','annual'),
	`requiredSkills` text,
	`requiredEducation` varchar(100),
	`experienceRequired` varchar(100),
	`transportationRequired` boolean DEFAULT false,
	`drivingLicenseRequired` boolean DEFAULT false,
	`backgroundCheckRequired` boolean DEFAULT false,
	`applicationUrl` varchar(500),
	`postedDate` timestamp NOT NULL DEFAULT (now()),
	`expiryDate` timestamp,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `job_postings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recommendations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('job','resource','service','event','support_group','meal','medical','counseling') NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`reason` text,
	`category` varchar(100),
	`priority` enum('low','medium','high','critical') NOT NULL DEFAULT 'medium',
	`linkedNeed` varchar(100),
	`linkedGoalId` int,
	`linkedResourceId` int,
	`linkedJobId` int,
	`status` enum('pending','accepted','declined','completed') NOT NULL DEFAULT 'pending',
	`acceptedDate` timestamp,
	`completedDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `recommendations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `saved_searches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`searchType` enum('clients','resources','providers','events') NOT NULL,
	`filters` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `saved_searches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `search_alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`savedSearchId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`enabled` boolean NOT NULL DEFAULT true,
	`frequency` enum('immediate','daily','weekly') NOT NULL DEFAULT 'immediate',
	`lastAlertSentAt` timestamp,
	`matchCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `search_alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `service_providers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('medical','meal','counseling','support_group','transportation','other') NOT NULL,
	`description` text,
	`location` varchar(255) NOT NULL,
	`county` varchar(100),
	`phone` varchar(20),
	`email` varchar(320),
	`website` varchar(500),
	`address` varchar(255),
	`city` varchar(100),
	`state` varchar(50),
	`zipCode` varchar(10),
	`latitude` varchar(50),
	`longitude` varchar(50),
	`acceptedInsurance` text,
	`acceptsUninsured` boolean DEFAULT true,
	`languages` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `service_providers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `service_schedules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`serviceProviderId` int NOT NULL,
	`dayOfWeek` enum('monday','tuesday','wednesday','thursday','friday','saturday','sunday') NOT NULL,
	`startTime` varchar(50) NOT NULL,
	`endTime` varchar(50) NOT NULL,
	`location` varchar(255),
	`capacity` int,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `service_schedules_id` PRIMARY KEY(`id`)
);
