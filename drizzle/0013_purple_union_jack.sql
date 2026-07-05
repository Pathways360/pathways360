CREATE TABLE `achievement_badges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`badgeType` enum('goal_master','milestone_champion','sobriety_warrior','employment_hero','housing_champion','family_reunifier','court_compliant','education_achiever','recovery_champion','community_contributor') NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`iconUrl` varchar(500) NOT NULL,
	`unlockedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `achievement_badges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`achievementType` enum('goal_completion','milestone_reached','sobriety_milestone','employment_secured','housing_secured','family_reunification','court_compliance','education_completed','recovery_program_completed','custom') NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`goalId` int,
	`milestoneId` int,
	`completionPercentage` int NOT NULL,
	`isEligibleForCertificate` boolean NOT NULL DEFAULT false,
	`certificateGenerated` boolean NOT NULL DEFAULT false,
	`certificateId` int,
	`earnedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `achievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `certificate_templates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`achievementType` enum('goal_completion','milestone_reached','sobriety_milestone','employment_secured','housing_secured','family_reunification','court_compliance','education_completed','recovery_program_completed','custom') NOT NULL,
	`templateHtml` text NOT NULL,
	`backgroundColor` varchar(50) DEFAULT '#f5f5f5',
	`borderColor` varchar(50) DEFAULT '#2c5aa0',
	`textColor` varchar(50) DEFAULT '#1a1a1a',
	`accentColor` varchar(50) DEFAULT '#ffa500',
	`logoUrl` varchar(500),
	`sealUrl` varchar(500),
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `certificate_templates_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `certificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`achievementId` int NOT NULL,
	`certificateNumber` varchar(50) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`completionPercentage` int NOT NULL,
	`clientName` varchar(255) NOT NULL,
	`issuedDate` timestamp NOT NULL DEFAULT (now()),
	`expirationDate` timestamp,
	`issuerName` varchar(255) NOT NULL DEFAULT 'Pathways 360',
	`issuerTitle` varchar(255) DEFAULT 'Program Coordinator',
	`signatureUrl` varchar(500),
	`pdfUrl` varchar(500),
	`verificationCode` varchar(50) NOT NULL,
	`isVerified` boolean NOT NULL DEFAULT false,
	`viewCount` int NOT NULL DEFAULT 0,
	`downloadCount` int NOT NULL DEFAULT 0,
	`printCount` int NOT NULL DEFAULT 0,
	`lastViewedAt` timestamp,
	`lastDownloadedAt` timestamp,
	`lastPrintedAt` timestamp,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `certificates_id` PRIMARY KEY(`id`),
	CONSTRAINT `certificates_certificateNumber_unique` UNIQUE(`certificateNumber`),
	CONSTRAINT `certificates_verificationCode_unique` UNIQUE(`verificationCode`)
);
