CREATE TABLE `notification_preferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`appointmentReminders` boolean NOT NULL DEFAULT true,
	`medicationReminders` boolean NOT NULL DEFAULT true,
	`goalReminders` boolean NOT NULL DEFAULT true,
	`dailyCoachMessage` boolean NOT NULL DEFAULT true,
	`weeklyProgressSummary` boolean NOT NULL DEFAULT true,
	`devotionals` boolean NOT NULL DEFAULT false,
	`motivationalMessages` boolean NOT NULL DEFAULT true,
	`crisisAlerts` boolean NOT NULL DEFAULT true,
	`reminderLeadMinutes` int NOT NULL DEFAULT 60,
	`quietHoursStart` varchar(5) DEFAULT '22:00',
	`quietHoursEnd` varchar(5) DEFAULT '08:00',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `notification_preferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `notification_preferences_userId_unique` UNIQUE(`userId`)
);
