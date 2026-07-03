CREATE TABLE `client_agency_enrollments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`organizationId` int NOT NULL,
	`enrolledByProviderId` int NOT NULL,
	`agencyRole` enum('primary_ecm','behavioral_health','housing','probation','employment','substance_use','peer_support','legal','other') NOT NULL DEFAULT 'other',
	`consentGiven` boolean NOT NULL DEFAULT false,
	`consentDate` timestamp,
	`consentExpiresAt` timestamp,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_agency_enrollments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `client_gap_flags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`flaggedByProviderId` int,
	`gapCategory` enum('no_housing_plan','chronically_homeless','no_mental_health_provider','no_substance_use_treatment','no_government_id','no_income','no_health_insurance','no_employment_plan','no_ecm_provider','probation_compliance_risk','no_peer_support','no_transportation','no_legal_representation','no_education_plan','family_reunification_needed','medication_not_managed','crisis_risk','other') NOT NULL,
	`severity` enum('low','medium','high','critical') NOT NULL DEFAULT 'medium',
	`notes` text,
	`resolved` boolean NOT NULL DEFAULT false,
	`resolvedAt` timestamp,
	`resolvedByProviderId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_gap_flags_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `county_resources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`county` enum('butte','shasta','trinity','tehama','humboldt','siskiyou','other') NOT NULL,
	`category` varchar(100) NOT NULL,
	`subCategory` varchar(100),
	`description` text,
	`address` text,
	`city` varchar(100),
	`state` varchar(10) DEFAULT 'CA',
	`zipCode` varchar(10),
	`phone` varchar(30),
	`altPhone` varchar(30),
	`website` text,
	`email` varchar(320),
	`hours` text,
	`eligibility` text,
	`populationsServed` text,
	`walkInsWelcome` boolean DEFAULT true,
	`appointmentRequired` boolean DEFAULT false,
	`acceptingClients` boolean NOT NULL DEFAULT true,
	`hasWaitlist` boolean NOT NULL DEFAULT false,
	`ecmEligible` boolean NOT NULL DEFAULT false,
	`medicaidAccepted` boolean NOT NULL DEFAULT false,
	`mediCalAccepted` boolean NOT NULL DEFAULT false,
	`slidingScale` boolean NOT NULL DEFAULT false,
	`freeService` boolean NOT NULL DEFAULT false,
	`latitude` varchar(20),
	`longitude` varchar(20),
	`isVerified` boolean NOT NULL DEFAULT false,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `county_resources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `resource_recommendations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`recommendedByProviderId` int,
	`resourceName` varchar(200) NOT NULL,
	`resourceCategory` varchar(100) NOT NULL,
	`resourcePhone` varchar(30),
	`resourceAddress` text,
	`resourceWebsite` text,
	`resourceCounty` varchar(100),
	`reason` text,
	`sentToClientInbox` boolean NOT NULL DEFAULT false,
	`clientViewed` boolean NOT NULL DEFAULT false,
	`clientViewedAt` timestamp,
	`status` enum('pending','sent','viewed','acted_on','dismissed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `resource_recommendations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shared_progress_notes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`authorProviderId` int NOT NULL,
	`authorOrganizationId` int NOT NULL,
	`noteType` enum('progress','concern','milestone','handoff','referral','crisis','housing_update','employment_update','recovery_update','legal_update','medical_update','general') NOT NULL DEFAULT 'general',
	`content` text NOT NULL,
	`visibility` enum('all_agencies','own_agency') NOT NULL DEFAULT 'all_agencies',
	`isPinned` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `shared_progress_notes_id` PRIMARY KEY(`id`)
);
