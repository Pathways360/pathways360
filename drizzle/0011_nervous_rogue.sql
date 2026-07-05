ALTER TABLE `notification_preferences` ADD `alertsEnabled` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `notification_preferences` ADD `messagesEnabled` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `notification_preferences` ADD `referralsEnabled` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `notification_preferences` ADD `appointmentsEnabled` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `notification_preferences` ADD `remindersEnabled` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `notification_preferences` ADD `frequency` enum('immediate','hourly_digest','daily_digest') DEFAULT 'immediate' NOT NULL;--> statement-breakpoint
ALTER TABLE `notification_preferences` ADD `quietHoursEnabled` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `notification_preferences` ADD `soundEnabled` boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `notification_preferences` ADD `browserNotificationsEnabled` boolean DEFAULT false NOT NULL;