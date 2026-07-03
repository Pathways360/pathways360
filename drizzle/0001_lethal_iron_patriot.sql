CREATE TABLE `appointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text,
	`type` enum('medical','legal','court','probation','employment','housing','recovery','medication','other') NOT NULL DEFAULT 'other',
	`appointmentDate` timestamp NOT NULL,
	`location` text,
	`reminderEnabled` boolean NOT NULL DEFAULT true,
	`reminderMinutesBefore` int DEFAULT 60,
	`completed` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `case_manager_assignments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`caseManagerId` int NOT NULL,
	`clientId` int NOT NULL,
	`organizationId` int,
	`consentGiven` boolean NOT NULL DEFAULT false,
	`consentDate` timestamp,
	`notes` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `case_manager_assignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`chatType` enum('coach','counselor') NOT NULL DEFAULT 'counselor',
	`role` enum('user','assistant') NOT NULL,
	`content` text NOT NULL,
	`crisisDetected` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `coach_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`coachName` varchar(100) NOT NULL DEFAULT 'Alex',
	`avatarType` enum('library','upload') NOT NULL DEFAULT 'library',
	`avatarLibraryId` varchar(50),
	`avatarUploadUrl` text,
	`devotionalsEnabled` boolean NOT NULL DEFAULT false,
	`motivationalEnabled` boolean NOT NULL DEFAULT true,
	`checkInFrequency` enum('morning','morning_evening','three_times') NOT NULL DEFAULT 'morning',
	`coachPersonality` enum('encouraging','direct','gentle','faith_based') NOT NULL DEFAULT 'encouraging',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `coach_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `coach_settings_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `daily_coach_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`message` text NOT NULL,
	`messageType` enum('morning','evening','motivational','devotional','milestone') NOT NULL DEFAULT 'morning',
	`read` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `daily_coach_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `goals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text,
	`category` enum('housing','employment','health','legal','recovery','education','identity','financial','family','transportation','other') NOT NULL,
	`status` enum('not_started','in_progress','completed','paused') NOT NULL DEFAULT 'not_started',
	`priority` int NOT NULL DEFAULT 1,
	`steps` json,
	`dueDate` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `goals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `milestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(200) NOT NULL,
	`description` text,
	`celebrationMessage` text,
	`achievedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `milestones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `needs_assessments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`housingStatus` varchar(100),
	`employmentStatus` varchar(100),
	`hasIncome` boolean DEFAULT false,
	`incomeSource` varchar(100),
	`hasHealthInsurance` boolean DEFAULT false,
	`insuranceType` varchar(100),
	`hasMedicalConditions` boolean DEFAULT false,
	`medicalConditions` text,
	`takesMedication` boolean DEFAULT false,
	`hasDentalNeeds` boolean DEFAULT false,
	`hasVisionNeeds` boolean DEFAULT false,
	`mentalHealthStatus` varchar(100),
	`inRecovery` boolean DEFAULT false,
	`substanceUseHistory` varchar(100),
	`hasSponsor` boolean DEFAULT false,
	`attendsMeetings` boolean DEFAULT false,
	`hasLegalIssues` boolean DEFAULT false,
	`onProbationOrParole` boolean DEFAULT false,
	`hasCourtDates` boolean DEFAULT false,
	`hasGovernmentId` boolean DEFAULT false,
	`hasSocialSecurityCard` boolean DEFAULT false,
	`hasBirthCertificate` boolean DEFAULT false,
	`hasTransportation` boolean DEFAULT false,
	`hasDriversLicense` boolean DEFAULT false,
	`hasChildren` boolean DEFAULT false,
	`numberOfChildren` int DEFAULT 0,
	`domesticViolenceHistory` boolean DEFAULT false,
	`isVeteran` boolean DEFAULT false,
	`highestEducation` varchar(100),
	`hasPhone` boolean DEFAULT false,
	`hasInternet` boolean DEFAULT false,
	`techSkillLevel` varchar(50),
	`primaryGoals` text,
	`biggestObstacles` text,
	`hasCaseWorker` boolean DEFAULT false,
	`caseWorkerName` varchar(100),
	`emergencyContactName` varchar(100),
	`emergencyContactPhone` varchar(20),
	`faithBased` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `needs_assessments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`description` text,
	`type` varchar(100),
	`address` text,
	`city` varchar(100),
	`state` varchar(50),
	`zipCode` varchar(10),
	`phone` varchar(20),
	`website` text,
	`contactEmail` varchar(320),
	`isVerified` boolean NOT NULL DEFAULT false,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `organizations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `resources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`organizationId` int,
	`name` varchar(200) NOT NULL,
	`description` text,
	`category` enum('shelter','food','medical','mental_health','recovery','employment','legal','transportation','education','financial','clothing','hygiene','family','veterans','youth','domestic_violence','other') NOT NULL,
	`address` text,
	`city` varchar(100),
	`state` varchar(50),
	`zipCode` varchar(10),
	`phone` varchar(20),
	`website` text,
	`hours` text,
	`eligibility` text,
	`documentsNeeded` text,
	`appointmentRequired` boolean DEFAULT false,
	`walkInsWelcome` boolean DEFAULT true,
	`languages` text,
	`isAccessible` boolean DEFAULT true,
	`isActive` boolean NOT NULL DEFAULT true,
	`latitude` varchar(20),
	`longitude` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `resources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`firstName` varchar(100),
	`lastName` varchar(100),
	`phone` varchar(20),
	`dateOfBirth` varchar(20),
	`gender` varchar(50),
	`preferredLanguage` varchar(50) DEFAULT 'English',
	`zipCode` varchar(10),
	`city` varchar(100),
	`state` varchar(50),
	`allowCaseManagerAccess` boolean NOT NULL DEFAULT false,
	`profileComplete` boolean NOT NULL DEFAULT false,
	`assessmentComplete` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','case_manager','org_admin','admin') NOT NULL DEFAULT 'user';