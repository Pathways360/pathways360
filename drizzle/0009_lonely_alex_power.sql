CREATE TABLE `client_behavioral_health` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientUserId` int NOT NULL,
	`diagnosis` text,
	`mentalHealthProviderId` int,
	`mentalHealthProviderName` varchar(255),
	`therapistName` varchar(255),
	`psychiatristName` varchar(255),
	`substanceUseCounselorName` varchar(255),
	`levelOfCare` enum('outpatient','intensive_outpatient','partial_hospitalization','inpatient','residential'),
	`riskLevel` enum('low','moderate','high','crisis') DEFAULT 'low',
	`suicideRisk` boolean DEFAULT false,
	`safetyPlan` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_behavioral_health_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `client_child_welfare` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientUserId` int NOT NULL,
	`activeCPSCase` boolean DEFAULT false,
	`caseWorkerId` int,
	`caseWorkerName` varchar(255),
	`caseWorkerContact` varchar(100),
	`childrenInCustody` int DEFAULT 0,
	`visitationSchedule` text,
	`courtHearings` text,
	`parentingClasses` text,
	`reunificationPlan` text,
	`requiredServices` text,
	`progressNotes` text,
	`upcomingDeadlines` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_child_welfare_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `client_court` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientUserId` int NOT NULL,
	`probationOfficerId` int,
	`probationOfficerName` varchar(255),
	`probationOfficerContact` varchar(100),
	`courtDates` text,
	`conditions` text,
	`communityServiceHours` int,
	`communityServiceHoursCompleted` int DEFAULT 0,
	`drugTestingRequired` boolean DEFAULT false,
	`curfew` varchar(255),
	`protectiveOrders` text,
	`requiredClasses` text,
	`complianceStatus` enum('compliant','non_compliant','pending_review') DEFAULT 'pending_review',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_court_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `client_education` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientUserId` int NOT NULL,
	`hasHighSchoolDiploma` boolean DEFAULT false,
	`hasGED` boolean DEFAULT false,
	`collegeEnrolled` boolean DEFAULT false,
	`tradeSchoolEnrolled` boolean DEFAULT false,
	`certifications` text,
	`currentEnrollment` varchar(255),
	`careerGoals` text,
	`lifeGoals` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_education_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `client_employment` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientUserId` int NOT NULL,
	`employmentStatus` enum('full_time','part_time','temporary','seasonal','self_employed','unemployed','looking_for_work','student','volunteer','retired') NOT NULL,
	`workEligible` boolean,
	`workRestrictions` text,
	`disabilityStatus` enum('none','temporary','permanent','pending_determination') DEFAULT 'none',
	`receivingSSI` boolean DEFAULT false,
	`receivingSSID` boolean DEFAULT false,
	`vocationalRehabilitationEnrolled` boolean DEFAULT false,
	`employmentGoal` text,
	`currentEmployer` varchar(255),
	`jobTitle` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_employment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `client_housing` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientUserId` int NOT NULL,
	`currentHousingStatus` enum('unsheltered','emergency_shelter','transitional_housing','sober_living','permanent_housing','with_family','motel','institution','other') NOT NULL,
	`housingStabilityScore` int,
	`housingGoal` text,
	`moveInDate` varchar(20),
	`leaseExpirationDate` varchar(20),
	`landlordName` varchar(255),
	`landlordContact` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_housing_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `client_insurance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientUserId` int NOT NULL,
	`insuranceProvider` enum('partnership_healthplan','medi_cal','medicare','anthem_blue_cross','kaiser_permanente','aetna','blue_shield','cigna','united_healthcare','self_pay','uninsured','other') NOT NULL,
	`insuranceId` varchar(100),
	`groupNumber` varchar(100),
	`assignedCaseManager` int,
	`authorizationNumber` varchar(100),
	`priorAuthRequired` boolean DEFAULT false,
	`renewalDate` varchar(20),
	`coverageStatus` enum('active','inactive','pending','terminated') DEFAULT 'active',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_insurance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `client_medical` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientUserId` int NOT NULL,
	`primaryCarePhysician` varchar(255),
	`primaryCarePhysicianContact` varchar(100),
	`specialists` text,
	`medicalConditions` text,
	`allergies` text,
	`emergencyContact` varchar(255),
	`emergencyContactPhone` varchar(20),
	`hospitalizations` text,
	`upcomingAppointments` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_medical_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `client_medications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientUserId` int NOT NULL,
	`medicationName` varchar(255) NOT NULL,
	`dosage` varchar(100),
	`frequency` varchar(100),
	`prescribingPhysician` varchar(255),
	`pharmacy` varchar(255),
	`complianceStatus` enum('taking_as_prescribed','missed_occasionally','frequently_missed','unknown') DEFAULT 'unknown',
	`medicationType` enum('psychiatric','narcotic_controlled','non_narcotic','mat','over_the_counter','other'),
	`monitoringMethod` enum('pill_count','daily_observation','weekly_check','monthly_review'),
	`alerts` text,
	`startDate` varchar(20),
	`endDate` varchar(20),
	`isActive` boolean DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_medications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `client_recovery` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientUserId` int NOT NULL,
	`cleanDate` varchar(20),
	`primaryDrug` varchar(100),
	`recoveryMeetings` text,
	`sponsorName` varchar(255),
	`sponsorContact` varchar(100),
	`recoveryGoals` text,
	`relapseHistory` text,
	`triggers` text,
	`milestones` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_recovery_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `client_timeline` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientUserId` int NOT NULL,
	`eventType` enum('appointment','case_note','milestone','medication_change','court_date','referral','housing_update','employment_progress','message','assessment','goal_update','recovery_milestone','provider_note') NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`eventDate` timestamp NOT NULL,
	`createdByUserId` int NOT NULL,
	`createdByRole` varchar(50),
	`visibleToRoles` text,
	`requiresConsent` boolean NOT NULL DEFAULT true,
	`consentGiven` boolean NOT NULL DEFAULT false,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_timeline_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `multi_agency_outcomes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` int NOT NULL,
	`organizationId` int,
	`housingStability` boolean DEFAULT false,
	`treatmentEngagement` boolean DEFAULT false,
	`medicationAdherence` boolean DEFAULT false,
	`appointmentAttendance` int DEFAULT 0,
	`employmentPlacement` boolean DEFAULT false,
	`familyReunification` boolean DEFAULT false,
	`edUtilizationReduction` int DEFAULT 0,
	`recidivismReduction` boolean DEFAULT false,
	`costSavings` int DEFAULT 0,
	`grantPerformanceMetrics` text,
	`qualityMetrics` text,
	`programOutcomes` text,
	`reportingPeriodStart` varchar(20),
	`reportingPeriodEnd` varchar(20),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `multi_agency_outcomes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `provider_permissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`providerId` int NOT NULL,
	`clientId` int NOT NULL,
	`providerRole` varchar(50) NOT NULL,
	`permissions` text NOT NULL,
	`consentGiven` boolean NOT NULL DEFAULT false,
	`consentDate` timestamp,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `provider_permissions_id` PRIMARY KEY(`id`)
);
