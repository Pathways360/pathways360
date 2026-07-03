CREATE TABLE `client_timelines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`organizationId` int NOT NULL,
	`createdByProviderId` int NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_timelines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `org_directory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organizationId` int NOT NULL,
	`county` varchar(100),
	`serviceArea` text,
	`servicesOffered` text,
	`eligibilityRequirements` text,
	`populationsServed` text,
	`hoursOfOperation` text,
	`afterHoursContact` varchar(100),
	`acceptingClients` boolean NOT NULL DEFAULT true,
	`hasWaitlist` boolean NOT NULL DEFAULT false,
	`waitlistNotes` text,
	`closureNotice` text,
	`specialEvents` text,
	`lastUpdatedByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `org_directory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `org_licenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organizationId` int NOT NULL,
	`licenseType` enum('per_user','per_agency','per_department','countywide','enterprise','statewide') NOT NULL DEFAULT 'per_agency',
	`maxUsers` int DEFAULT 5,
	`isActive` boolean NOT NULL DEFAULT true,
	`trialEndsAt` timestamp,
	`licenseExpiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `org_licenses_id` PRIMARY KEY(`id`),
	CONSTRAINT `org_licenses_organizationId_unique` UNIQUE(`organizationId`)
);
--> statement-breakpoint
CREATE TABLE `progress_milestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`milestoneKey` enum('government_id_obtained','benefits_approved','housing_secured','treatment_completed','recovery_milestone','employment_obtained','income_established','education_enrolled','transportation_obtained','family_reunification') NOT NULL,
	`achieved` boolean NOT NULL DEFAULT false,
	`achievedAt` timestamp,
	`notes` text,
	`verifiedByProviderId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `progress_milestones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `provider_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fromProviderId` int NOT NULL,
	`toClientId` int NOT NULL,
	`organizationId` int NOT NULL,
	`subject` varchar(200),
	`content` text NOT NULL,
	`messageType` enum('message','task','reminder','appointment','goal','alert') NOT NULL DEFAULT 'message',
	`scheduledFor` timestamp,
	`read` boolean NOT NULL DEFAULT false,
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `provider_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `provider_roles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`organizationId` int NOT NULL,
	`role` enum('system_admin','county_admin','health_plan_admin','probation_supervisor','probation_officer','behavioral_health_supervisor','case_manager','ecm_worker','social_worker','treatment_counselor','housing_navigator','peer_support_specialist','read_only_auditor') NOT NULL,
	`permissions` json,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `provider_roles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `timeline_tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`timelineId` int NOT NULL,
	`clientId` int NOT NULL,
	`assignedToProviderId` int,
	`title` varchar(200) NOT NULL,
	`description` text,
	`category` enum('housing','employment','health','legal','recovery','education','identity','financial','family','transportation','probation','benefits','other') NOT NULL DEFAULT 'other',
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`status` enum('pending','in_progress','completed','missed','cancelled') NOT NULL DEFAULT 'pending',
	`dueDate` timestamp,
	`completedAt` timestamp,
	`notes` text,
	`attachments` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `timeline_tasks_id` PRIMARY KEY(`id`)
);
