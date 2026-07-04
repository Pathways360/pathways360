ALTER TABLE `users` MODIFY COLUMN `role` enum('user','case_manager','ecm_worker','probation_officer','counselor','org_admin','admin') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `emergencyContactName` varchar(100);--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `emergencyContactPhone` varchar(20);--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `emergencyContactRelation` varchar(50);--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `county` varchar(100);--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `housingStatus` varchar(100);--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `isVeteran` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `insuranceType` varchar(100);--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `hasMediCal` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `onProbationOrParole` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `probationCounty` varchar(100);--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `drugOfChoice` varchar(100);--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `sobrietyDate` varchar(20);--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `hasTransportation` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `employmentStatus` varchar(100);