CREATE TABLE `community_events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`eventType` enum('meal','food_distribution','food_bank','mobile_pantry','emergency_shelter','winter_shelter','cooling_center','warming_center','mobile_medical','behavioral_health_outreach','medication_clinic','vaccination','clothing_closet','laundry','shower_program','bus_voucher','transportation','dmv_outreach','legal_clinic','expungement_event','job_fair','hiring_event','resume_workshop','training','community_college','education','recovery_meeting','support_group','peer_support','probation_outreach','parole_outreach','resource_fair','disaster_assistance','holiday_program','emergency_alert','faith_based','veterans_event','native_american_services','family_services','other') NOT NULL DEFAULT 'other',
	`eventDate` varchar(20) NOT NULL,
	`startTime` varchar(10),
	`endTime` varchar(10),
	`isRecurring` boolean NOT NULL DEFAULT false,
	`recurringPattern` varchar(100),
	`county` enum('butte','shasta','trinity','tehama','humboldt','siskiyou','other') NOT NULL DEFAULT 'other',
	`city` varchar(100),
	`address` varchar(255),
	`locationName` varchar(255),
	`latitude` varchar(20),
	`longitude` varchar(20),
	`organizationName` varchar(255),
	`organizationPhone` varchar(30),
	`organizationWebsite` varchar(500),
	`contactName` varchar(100),
	`needsCategories` text,
	`confidenceLevel` enum('verified_today','verified_this_week','verified_this_month','pending','unverified') NOT NULL DEFAULT 'pending',
	`verifiedAt` timestamp,
	`verifiedBy` int,
	`sourceUrl` varchar(500),
	`sourceType` enum('organization_direct','provider_submission','public_website','social_media','county_website','internal') NOT NULL DEFAULT 'provider_submission',
	`spotsAvailable` int,
	`requiresRegistration` boolean NOT NULL DEFAULT false,
	`registrationUrl` varchar(500),
	`submittedBy` int,
	`isActive` boolean NOT NULL DEFAULT true,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `community_events_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `daily_feed_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`itemType` enum('community_event','appointment','provider_message','goal_reminder','resource_recommendation','system_alert') NOT NULL,
	`referenceId` int,
	`title` varchar(255) NOT NULL,
	`body` text,
	`county` varchar(50),
	`feedDate` varchar(20) NOT NULL,
	`priority` int NOT NULL DEFAULT 5,
	`isRead` boolean NOT NULL DEFAULT false,
	`isDismissed` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `daily_feed_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `event_engagement` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`eventId` int NOT NULL,
	`action` enum('viewed','saved','attending','attended','dismissed') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `event_engagement_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_service_areas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`county` enum('butte','shasta','trinity','tehama','humboldt','siskiyou','other') NOT NULL,
	`areaType` enum('residence','probation','services','temporary_housing','willing_to_travel') NOT NULL DEFAULT 'residence',
	`isPrimary` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_service_areas_id` PRIMARY KEY(`id`)
);
