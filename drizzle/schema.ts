import {
  boolean,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

// ─── Users ────────────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "case_manager", "ecm_worker", "probation_officer", "counselor", "org_admin", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── User Profiles ────────────────────────────────────────────────────────────
export const userProfiles = mysqlTable("user_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  // Personal
  firstName: varchar("firstName", { length: 100 }),
  lastName: varchar("lastName", { length: 100 }),
  phone: varchar("phone", { length: 20 }),
  dateOfBirth: varchar("dateOfBirth", { length: 20 }),
  gender: varchar("gender", { length: 50 }),
  preferredLanguage: varchar("preferredLanguage", { length: 50 }).default("English"),
  zipCode: varchar("zipCode", { length: 10 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  // Extended profile fields
  emergencyContactName: varchar("emergencyContactName", { length: 100 }),
  emergencyContactPhone: varchar("emergencyContactPhone", { length: 20 }),
  emergencyContactRelation: varchar("emergencyContactRelation", { length: 50 }),
  county: varchar("county", { length: 100 }),
  housingStatus: varchar("housingStatus", { length: 100 }),
  isVeteran: boolean("isVeteran").default(false),
  insuranceType: varchar("insuranceType", { length: 100 }),
  hasMediCal: boolean("hasMediCal").default(false),
  onProbationOrParole: boolean("onProbationOrParole").default(false),
  probationCounty: varchar("probationCounty", { length: 100 }),
  drugOfChoice: varchar("drugOfChoice", { length: 100 }),
  sobrietyDate: varchar("sobrietyDate", { length: 20 }),
  hasTransportation: boolean("hasTransportation").default(false),
  employmentStatus: varchar("employmentStatus", { length: 100 }),
  // Privacy
  allowCaseManagerAccess: boolean("allowCaseManagerAccess").default(false).notNull(),
  profileComplete: boolean("profileComplete").default(false).notNull(),
  assessmentComplete: boolean("assessmentComplete").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Needs Assessment ─────────────────────────────────────────────────────────
export const needsAssessments = mysqlTable("needs_assessments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  // Housing
  housingStatus: varchar("housingStatus", { length: 100 }),
  // Employment
  employmentStatus: varchar("employmentStatus", { length: 100 }),
  hasIncome: boolean("hasIncome").default(false),
  incomeSource: varchar("incomeSource", { length: 100 }),
  // Health
  hasHealthInsurance: boolean("hasHealthInsurance").default(false),
  insuranceType: varchar("insuranceType", { length: 100 }),
  hasMedicalConditions: boolean("hasMedicalConditions").default(false),
  medicalConditions: text("medicalConditions"),
  takesMedication: boolean("takesMedication").default(false),
  hasDentalNeeds: boolean("hasDentalNeeds").default(false),
  hasVisionNeeds: boolean("hasVisionNeeds").default(false),
  // Mental Health & Recovery
  mentalHealthStatus: varchar("mentalHealthStatus", { length: 100 }),
  inRecovery: boolean("inRecovery").default(false),
  substanceUseHistory: varchar("substanceUseHistory", { length: 100 }),
  hasSponsor: boolean("hasSponsor").default(false),
  attendsMeetings: boolean("attendsMeetings").default(false),
  // Legal
  hasLegalIssues: boolean("hasLegalIssues").default(false),
  onProbationOrParole: boolean("onProbationOrParole").default(false),
  hasCourtDates: boolean("hasCourtDates").default(false),
  // Identity & Documents
  hasGovernmentId: boolean("hasGovernmentId").default(false),
  hasSocialSecurityCard: boolean("hasSocialSecurityCard").default(false),
  hasBirthCertificate: boolean("hasBirthCertificate").default(false),
  // Transportation
  hasTransportation: boolean("hasTransportation").default(false),
  hasDriversLicense: boolean("hasDriversLicense").default(false),
  // Family
  hasChildren: boolean("hasChildren").default(false),
  numberOfChildren: int("numberOfChildren").default(0),
  domesticViolenceHistory: boolean("domesticViolenceHistory").default(false),
  // Veteran
  isVeteran: boolean("isVeteran").default(false),
  // Education
  highestEducation: varchar("highestEducation", { length: 100 }),
  // Technology
  hasPhone: boolean("hasPhone").default(false),
  hasInternet: boolean("hasInternet").default(false),
  techSkillLevel: varchar("techSkillLevel", { length: 50 }),
  // Goals & Obstacles
  primaryGoals: text("primaryGoals"),
  biggestObstacles: text("biggestObstacles"),
  // Support
  hasCaseWorker: boolean("hasCaseWorker").default(false),
  caseWorkerName: varchar("caseWorkerName", { length: 100 }),
  emergencyContactName: varchar("emergencyContactName", { length: 100 }),
  emergencyContactPhone: varchar("emergencyContactPhone", { length: 20 }),
  // Faith
  faithBased: boolean("faithBased").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── AI Life Coach Settings ───────────────────────────────────────────────────
export const coachSettings = mysqlTable("coach_settings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  coachName: varchar("coachName", { length: 100 }).default("Alex").notNull(),
  avatarType: mysqlEnum("avatarType", ["library", "upload"]).default("library").notNull(),
  avatarLibraryId: varchar("avatarLibraryId", { length: 50 }),
  avatarUploadUrl: text("avatarUploadUrl"),
  devotionalsEnabled: boolean("devotionalsEnabled").default(false).notNull(),
  motivationalEnabled: boolean("motivationalEnabled").default(true).notNull(),
  checkInFrequency: mysqlEnum("checkInFrequency", ["morning", "morning_evening", "three_times"]).default("morning").notNull(),
  coachPersonality: mysqlEnum("coachPersonality", ["encouraging", "direct", "gentle", "faith_based"]).default("encouraging").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Goals ────────────────────────────────────────────────────────────────────
export const goals = mysqlTable("goals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", [
    "housing", "employment", "health", "legal", "recovery",
    "education", "identity", "financial", "family", "transportation", "other"
  ]).notNull(),
  status: mysqlEnum("status", ["not_started", "in_progress", "completed", "paused"]).default("not_started").notNull(),
  priority: int("priority").default(1).notNull(),
  steps: json("steps"),
  dueDate: timestamp("dueDate"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Appointments ─────────────────────────────────────────────────────────────
export const appointments = mysqlTable("appointments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", [
    "medical", "legal", "court", "probation", "employment",
    "housing", "recovery", "medication", "other"
  ]).default("other").notNull(),
  appointmentDate: timestamp("appointmentDate").notNull(),
  location: text("location"),
  reminderEnabled: boolean("reminderEnabled").default(true).notNull(),
  reminderMinutesBefore: int("reminderMinutesBefore").default(60),
  completed: boolean("completed").default(false).notNull(),
  scheduleCronTaskUid: varchar("scheduleCronTaskUid", { length: 65 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── AI Chat Messages ─────────────────────────────────────────────────────────
export const chatMessages = mysqlTable("chat_messages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  chatType: mysqlEnum("chatType", ["coach", "counselor"]).default("counselor").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  crisisDetected: boolean("crisisDetected").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Resources ────────────────────────────────────────────────────────────────
export const resources = mysqlTable("resources", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId"),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", [
    "shelter", "food", "medical", "mental_health", "recovery",
    "employment", "legal", "transportation", "education", "financial",
    "clothing", "hygiene", "family", "veterans", "youth", "domestic_violence", "other"
  ]).notNull(),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  zipCode: varchar("zipCode", { length: 10 }),
  phone: varchar("phone", { length: 20 }),
  website: text("website"),
  hours: text("hours"),
  eligibility: text("eligibility"),
  documentsNeeded: text("documentsNeeded"),
  appointmentRequired: boolean("appointmentRequired").default(false),
  walkInsWelcome: boolean("walkInsWelcome").default(true),
  languages: text("languages"),
  isAccessible: boolean("isAccessible").default(true),
  isActive: boolean("isActive").default(true).notNull(),
  latitude: varchar("latitude", { length: 20 }),
  longitude: varchar("longitude", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Organizations ────────────────────────────────────────────────────────────
export const organizations = mysqlTable("organizations", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 100 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 50 }),
  zipCode: varchar("zipCode", { length: 10 }),
  phone: varchar("phone", { length: 20 }),
  website: text("website"),
  contactEmail: varchar("contactEmail", { length: 320 }),
  isVerified: boolean("isVerified").default(false).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Case Manager Assignments ─────────────────────────────────────────────────
export const caseManagerAssignments = mysqlTable("case_manager_assignments", {
  id: int("id").autoincrement().primaryKey(),
  caseManagerId: int("caseManagerId").notNull(),
  clientId: int("clientId").notNull(),
  organizationId: int("organizationId"),
  consentGiven: boolean("consentGiven").default(false).notNull(),
  consentDate: timestamp("consentDate"),
  notes: text("notes"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Daily Coach Messages ─────────────────────────────────────────────────────
export const dailyCoachMessages = mysqlTable("daily_coach_messages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  message: text("message").notNull(),
  messageType: mysqlEnum("messageType", ["morning", "evening", "motivational", "devotional", "milestone"]).default("morning").notNull(),
  read: boolean("read").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Milestones ───────────────────────────────────────────────────────────────
export const milestones = mysqlTable("milestones", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  celebrationMessage: text("celebrationMessage"),
  achievedAt: timestamp("achievedAt").defaultNow().notNull(),
});

// ─── Notification Preferences ─────────────────────────────────────────────────
export const notificationPreferences = mysqlTable("notification_preferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  // Reminder channels
  appointmentReminders: boolean("appointmentReminders").default(true).notNull(),
  medicationReminders: boolean("medicationReminders").default(true).notNull(),
  goalReminders: boolean("goalReminders").default(true).notNull(),
  // Coach & content
  dailyCoachMessage: boolean("dailyCoachMessage").default(true).notNull(),
  weeklyProgressSummary: boolean("weeklyProgressSummary").default(true).notNull(),
  devotionals: boolean("devotionals").default(false).notNull(),
  motivationalMessages: boolean("motivationalMessages").default(true).notNull(),
  // Safety
  crisisAlerts: boolean("crisisAlerts").default(true).notNull(),
  // Notification Types (Phase 34)
  alertsEnabled: boolean("alertsEnabled").default(true).notNull(),
  messagesEnabled: boolean("messagesEnabled").default(true).notNull(),
  referralsEnabled: boolean("referralsEnabled").default(true).notNull(),
  appointmentsEnabled: boolean("appointmentsEnabled").default(true).notNull(),
  remindersEnabled: boolean("remindersEnabled").default(true).notNull(),
  // Frequency (Phase 34)
  frequency: mysqlEnum("frequency", ["immediate", "hourly_digest", "daily_digest"]).default("immediate").notNull(),
  // Quiet Hours
  quietHoursEnabled: boolean("quietHoursEnabled").default(false).notNull(),
  reminderLeadMinutes: int("reminderLeadMinutes").default(60).notNull(),
  quietHoursStart: varchar("quietHoursStart", { length: 5 }).default("22:00"),
  quietHoursEnd: varchar("quietHoursEnd", { length: 5 }).default("08:00"),
  // Sound & Browser Notifications (Phase 34)
  soundEnabled: boolean("soundEnabled").default(true).notNull(),
  browserNotificationsEnabled: boolean("browserNotificationsEnabled").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NotificationPreferences = typeof notificationPreferences.$inferSelect;
export type InsertNotificationPreferences = typeof notificationPreferences.$inferInsert;

// ─── Provider Roles ───────────────────────────────────────────────────────────
export const providerRoles = mysqlTable("provider_roles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  organizationId: int("organizationId").notNull(),
  role: mysqlEnum("role", [
    "system_admin", "county_admin", "health_plan_admin",
    "probation_supervisor", "probation_officer",
    "behavioral_health_supervisor", "case_manager", "ecm_worker",
    "social_worker", "treatment_counselor", "housing_navigator",
    "peer_support_specialist", "read_only_auditor"
  ]).notNull(),
  permissions: json("permissions"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Client Timelines ─────────────────────────────────────────────────────────
export const clientTimelines = mysqlTable("client_timelines", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  organizationId: int("organizationId").notNull(),
  createdByProviderId: int("createdByProviderId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Timeline Tasks ───────────────────────────────────────────────────────────
export const timelineTasks = mysqlTable("timeline_tasks", {
  id: int("id").autoincrement().primaryKey(),
  timelineId: int("timelineId").notNull(),
  clientId: int("clientId").notNull(),
  assignedToProviderId: int("assignedToProviderId"),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  category: mysqlEnum("category", [
    "housing", "employment", "health", "legal", "recovery",
    "education", "identity", "financial", "family", "transportation",
    "probation", "benefits", "other"
  ]).default("other").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high", "urgent"]).default("medium").notNull(),
  status: mysqlEnum("status", ["pending", "in_progress", "completed", "missed", "cancelled"]).default("pending").notNull(),
  dueDate: timestamp("dueDate"),
  completedAt: timestamp("completedAt"),
  notes: text("notes"),
  attachments: json("attachments"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Provider Messages ────────────────────────────────────────────────────────
export const providerMessages = mysqlTable("provider_messages", {
  id: int("id").autoincrement().primaryKey(),
  fromProviderId: int("fromProviderId").notNull(),
  toClientId: int("toClientId").notNull(),
  organizationId: int("organizationId").notNull(),
  subject: varchar("subject", { length: 200 }),
  content: text("content").notNull(),
  messageType: mysqlEnum("messageType", ["message", "task", "reminder", "appointment", "goal", "alert"]).default("message").notNull(),
  scheduledFor: timestamp("scheduledFor"),
  read: boolean("read").default(false).notNull(),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Progress Milestones ──────────────────────────────────────────────────────
export const progressMilestones = mysqlTable("progress_milestones", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  milestoneKey: mysqlEnum("milestoneKey", [
    "government_id_obtained", "benefits_approved", "housing_secured",
    "treatment_completed", "recovery_milestone", "employment_obtained",
    "income_established", "education_enrolled", "transportation_obtained",
    "family_reunification"
  ]).notNull(),
  achieved: boolean("achieved").default(false).notNull(),
  achievedAt: timestamp("achievedAt"),
  notes: text("notes"),
  verifiedByProviderId: int("verifiedByProviderId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Organization Directory ───────────────────────────────────────────────────
export const orgDirectory = mysqlTable("org_directory", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull(),
  // Location
  county: varchar("county", { length: 100 }),
  serviceArea: text("serviceArea"),
  // Services
  servicesOffered: text("servicesOffered"),
  eligibilityRequirements: text("eligibilityRequirements"),
  populationsServed: text("populationsServed"),
  // Contact & Hours
  hoursOfOperation: text("hoursOfOperation"),
  afterHoursContact: varchar("afterHoursContact", { length: 100 }),
  // Status
  acceptingClients: boolean("acceptingClients").default(true).notNull(),
  hasWaitlist: boolean("hasWaitlist").default(false).notNull(),
  waitlistNotes: text("waitlistNotes"),
  // Special notices
  closureNotice: text("closureNotice"),
  specialEvents: text("specialEvents"),
  lastUpdatedByUserId: int("lastUpdatedByUserId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Organization License ─────────────────────────────────────────────────────
export const orgLicenses = mysqlTable("org_licenses", {
  id: int("id").autoincrement().primaryKey(),
  organizationId: int("organizationId").notNull().unique(),
  licenseType: mysqlEnum("licenseType", ["per_user", "per_agency", "per_department", "countywide", "enterprise", "statewide"]).default("per_agency").notNull(),
  maxUsers: int("maxUsers").default(5),
  isActive: boolean("isActive").default(true).notNull(),
  trialEndsAt: timestamp("trialEndsAt"),
  licenseExpiresAt: timestamp("licenseExpiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Multi-Agency Client Enrollments ─────────────────────────────────────────
// Tracks which agencies/providers are authorized to view a client's shared record
export const clientAgencyEnrollments = mysqlTable("client_agency_enrollments", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  organizationId: int("organizationId").notNull(),
  enrolledByProviderId: int("enrolledByProviderId").notNull(),
  // Role of this agency in the client's care
  agencyRole: mysqlEnum("agencyRole", [
    "primary_ecm", "behavioral_health", "housing", "probation",
    "employment", "substance_use", "peer_support", "legal", "other"
  ]).default("other").notNull(),
  // Client consent to share data with this agency
  consentGiven: boolean("consentGiven").default(false).notNull(),
  consentDate: timestamp("consentDate"),
  consentExpiresAt: timestamp("consentExpiresAt"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Cross-Agency Shared Progress Notes ───────────────────────────────────────
// Any enrolled provider can post notes visible to all agencies on that client
export const sharedProgressNotes = mysqlTable("shared_progress_notes", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  authorProviderId: int("authorProviderId").notNull(),
  authorOrganizationId: int("authorOrganizationId").notNull(),
  noteType: mysqlEnum("noteType", [
    "progress", "concern", "milestone", "handoff", "referral",
    "crisis", "housing_update", "employment_update", "recovery_update",
    "legal_update", "medical_update", "general"
  ]).default("general").notNull(),
  content: text("content").notNull(),
  // Visibility: all_agencies = visible to all enrolled agencies; own_agency = only author's org
  visibility: mysqlEnum("visibility", ["all_agencies", "own_agency"]).default("all_agencies").notNull(),
  isPinned: boolean("isPinned").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Client Gap Flags ─────────────────────────────────────────────────────────
// Detected unmet needs / gaps in a client's care — drives resource recommendations
export const clientGapFlags = mysqlTable("client_gap_flags", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  flaggedByProviderId: int("flaggedByProviderId"),
  gapCategory: mysqlEnum("gapCategory", [
    "no_housing_plan", "chronically_homeless", "no_mental_health_provider",
    "no_substance_use_treatment", "no_government_id", "no_income",
    "no_health_insurance", "no_employment_plan", "no_ecm_provider",
    "probation_compliance_risk", "no_peer_support", "no_transportation",
    "no_legal_representation", "no_education_plan", "family_reunification_needed",
    "medication_not_managed", "crisis_risk", "other"
  ]).notNull(),
  severity: mysqlEnum("severity", ["low", "medium", "high", "critical"]).default("medium").notNull(),
  notes: text("notes"),
  resolved: boolean("resolved").default(false).notNull(),
  resolvedAt: timestamp("resolvedAt"),
  resolvedByProviderId: int("resolvedByProviderId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── Resource Recommendations ─────────────────────────────────────────────────
// Tracks resources recommended to a client by a provider or the system
export const resourceRecommendations = mysqlTable("resource_recommendations", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  recommendedByProviderId: int("recommendedByProviderId"),
  resourceName: varchar("resourceName", { length: 200 }).notNull(),
  resourceCategory: varchar("resourceCategory", { length: 100 }).notNull(),
  resourcePhone: varchar("resourcePhone", { length: 30 }),
  resourceAddress: text("resourceAddress"),
  resourceWebsite: text("resourceWebsite"),
  resourceCounty: varchar("resourceCounty", { length: 100 }),
  reason: text("reason"),  // Why this was recommended (gap flag that triggered it)
  sentToClientInbox: boolean("sentToClientInbox").default(false).notNull(),
  clientViewed: boolean("clientViewed").default(false).notNull(),
  clientViewedAt: timestamp("clientViewedAt"),
  status: mysqlEnum("status", ["pending", "sent", "viewed", "acted_on", "dismissed"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ─── County Resources (Real Directory) ────────────────────────────────────────
// Stores real verified resources for Butte, Shasta, Trinity, Tehama, Humboldt, Siskiyou
export const countyResources = mysqlTable("county_resources", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  county: mysqlEnum("county", [
    "butte", "shasta", "trinity", "tehama", "humboldt", "siskiyou", "other"
  ]).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  subCategory: varchar("subCategory", { length: 100 }),
  description: text("description"),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 10 }).default("CA"),
  zipCode: varchar("zipCode", { length: 10 }),
  phone: varchar("phone", { length: 30 }),
  altPhone: varchar("altPhone", { length: 30 }),
  website: text("website"),
  email: varchar("email", { length: 320 }),
  hours: text("hours"),
  eligibility: text("eligibility"),
  populationsServed: text("populationsServed"),
  walkInsWelcome: boolean("walkInsWelcome").default(true),
  appointmentRequired: boolean("appointmentRequired").default(false),
  acceptingClients: boolean("acceptingClients").default(true).notNull(),
  hasWaitlist: boolean("hasWaitlist").default(false).notNull(),
  // Flags for recommendation engine
  ecmEligible: boolean("ecmEligible").default(false).notNull(),
  medicaidAccepted: boolean("medicaidAccepted").default(false).notNull(),
  mediCalAccepted: boolean("mediCalAccepted").default(false).notNull(),
  slidingScale: boolean("slidingScale").default(false).notNull(),
  freeService: boolean("freeService").default(false).notNull(),
  latitude: varchar("latitude", { length: 20 }),
  longitude: varchar("longitude", { length: 20 }),
  isVerified: boolean("isVerified").default(false).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProviderRole = typeof providerRoles.$inferSelect;
export type TimelineTask = typeof timelineTasks.$inferSelect;
export type ProviderMessage = typeof providerMessages.$inferSelect;
export type ProgressMilestone = typeof progressMilestones.$inferSelect;
export type OrgDirectory = typeof orgDirectory.$inferSelect;
export type OrgLicense = typeof orgLicenses.$inferSelect;
export type ClientAgencyEnrollment = typeof clientAgencyEnrollments.$inferSelect;
export type SharedProgressNote = typeof sharedProgressNotes.$inferSelect;
export type ClientGapFlag = typeof clientGapFlags.$inferSelect;
export type ResourceRecommendation = typeof resourceRecommendations.$inferSelect;
export type CountyResource = typeof countyResources.$inferSelect;

// ─── Phase 3: Community Events & Daily Feed ───────────────────────────────────

export const communityEvents = mysqlTable("community_events", {
  id: int("id").autoincrement().primaryKey(),
  // Core info
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  eventType: mysqlEnum("eventType", [
    "meal", "food_distribution", "food_bank", "mobile_pantry",
    "emergency_shelter", "winter_shelter", "cooling_center", "warming_center",
    "mobile_medical", "behavioral_health_outreach", "medication_clinic", "vaccination",
    "clothing_closet", "laundry", "shower_program",
    "bus_voucher", "transportation", "dmv_outreach",
    "legal_clinic", "expungement_event",
    "job_fair", "hiring_event", "resume_workshop", "training",
    "community_college", "education",
    "recovery_meeting", "support_group", "peer_support",
    "probation_outreach", "parole_outreach",
    "resource_fair", "disaster_assistance", "holiday_program",
    "emergency_alert", "faith_based", "veterans_event",
    "native_american_services", "family_services", "other"
  ]).notNull().default("other"),
  // When
  eventDate: varchar("eventDate", { length: 20 }).notNull(), // YYYY-MM-DD
  startTime: varchar("startTime", { length: 10 }),           // HH:MM
  endTime: varchar("endTime", { length: 10 }),
  isRecurring: boolean("isRecurring").default(false).notNull(),
  recurringPattern: varchar("recurringPattern", { length: 100 }), // "daily", "weekly:mon,wed", etc.
  // Where
  county: mysqlEnum("county", ["butte","shasta","trinity","tehama","humboldt","siskiyou","other"]).notNull().default("other"),
  city: varchar("city", { length: 100 }),
  address: varchar("address", { length: 255 }),
  locationName: varchar("locationName", { length: 255 }),
  latitude: varchar("latitude", { length: 20 }),
  longitude: varchar("longitude", { length: 20 }),
  // Who
  organizationName: varchar("organizationName", { length: 255 }),
  organizationPhone: varchar("organizationPhone", { length: 30 }),
  organizationWebsite: varchar("organizationWebsite", { length: 500 }),
  contactName: varchar("contactName", { length: 100 }),
  // Needs categories this event serves (comma-separated)
  needsCategories: text("needsCategories"), // "housing,meals,medical"
  // Verification
  confidenceLevel: mysqlEnum("confidenceLevel", ["verified_today","verified_this_week","verified_this_month","pending","unverified"]).default("pending").notNull(),
  verifiedAt: timestamp("verifiedAt"),
  verifiedBy: int("verifiedBy"), // userId of verifier
  sourceUrl: varchar("sourceUrl", { length: 500 }),
  sourceType: mysqlEnum("sourceType", ["organization_direct","provider_submission","public_website","social_media","county_website","internal"]).default("provider_submission").notNull(),
  // Capacity
  spotsAvailable: int("spotsAvailable"),
  requiresRegistration: boolean("requiresRegistration").default(false).notNull(),
  registrationUrl: varchar("registrationUrl", { length: 500 }),
  // Submission
  submittedBy: int("submittedBy"), // userId of provider who submitted
  isActive: boolean("isActive").default(true).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const userServiceAreas = mysqlTable("user_service_areas", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  county: mysqlEnum("county", ["butte","shasta","trinity","tehama","humboldt","siskiyou","other"]).notNull(),
  areaType: mysqlEnum("areaType", ["residence","probation","services","temporary_housing","willing_to_travel"]).default("residence").notNull(),
  isPrimary: boolean("isPrimary").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const eventEngagement = mysqlTable("event_engagement", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  eventId: int("eventId").notNull(),
  action: mysqlEnum("action", ["viewed","saved","attending","attended","dismissed"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const dailyFeedItems = mysqlTable("daily_feed_items", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  itemType: mysqlEnum("itemType", ["community_event","appointment","provider_message","goal_reminder","resource_recommendation","system_alert"]).notNull(),
  referenceId: int("referenceId"), // ID in the referenced table
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body"),
  county: varchar("county", { length: 50 }),
  feedDate: varchar("feedDate", { length: 20 }).notNull(), // YYYY-MM-DD
  priority: int("priority").default(5).notNull(), // 1=highest
  isRead: boolean("isRead").default(false).notNull(),
  isDismissed: boolean("isDismissed").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CommunityEvent = typeof communityEvents.$inferSelect;
export type UserServiceArea = typeof userServiceAreas.$inferSelect;
export type EventEngagement = typeof eventEngagement.$inferSelect;
export type DailyFeedItem = typeof dailyFeedItems.$inferSelect;

// ─── Favorites & Recently Viewed ─────────────────────────────────────────────
export const userFavorites = mysqlTable("user_favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  resourceId: int("resourceId").notNull(),
  resourceType: varchar("resourceType", { length: 50 }).default("county_resource").notNull(),
  resourceName: varchar("resourceName", { length: 200 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const recentlyViewed = mysqlTable("recently_viewed", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  resourceId: int("resourceId").notNull(),
  resourceType: varchar("resourceType", { length: 50 }).default("county_resource").notNull(),
  resourceName: varchar("resourceName", { length: 200 }),
  viewedAt: timestamp("viewedAt").defaultNow().notNull(),
});

// ─── User Documents ───────────────────────────────────────────────────────────
export const userDocuments = mysqlTable("user_documents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  uploadedByUserId: int("uploadedByUserId"),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileKey: varchar("fileKey", { length: 500 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileSize: int("fileSize"),
  mimeType: varchar("mimeType", { length: 100 }),
  documentType: mysqlEnum("documentType", [
    "government_id", "insurance_card", "court_document", "consent_form",
    "recovery_plan", "medical_record", "employment_doc", "housing_doc",
    "probation_doc", "other"
  ]).default("other").notNull(),
  description: text("description"),
  isSharedWithProviders: boolean("isSharedWithProviders").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Secure Messaging Threads ─────────────────────────────────────────────────
export const messageThreads = mysqlTable("message_threads", {
  id: int("id").autoincrement().primaryKey(),
  subject: varchar("subject", { length: 255 }),
  createdByUserId: int("createdByUserId").notNull(),
  lastMessageAt: timestamp("lastMessageAt").defaultNow().notNull(),
  isArchived: boolean("isArchived").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const threadParticipants = mysqlTable("thread_participants", {
  id: int("id").autoincrement().primaryKey(),
  threadId: int("threadId").notNull(),
  userId: int("userId").notNull(),
  lastReadAt: timestamp("lastReadAt"),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});

export const threadMessages = mysqlTable("thread_messages", {
  id: int("id").autoincrement().primaryKey(),
  threadId: int("threadId").notNull(),
  senderUserId: int("senderUserId").notNull(),
  content: text("content").notNull(),
  isSystemMessage: boolean("isSystemMessage").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Audit Log ────────────────────────────────────────────────────────────────
export const auditLog = mysqlTable("audit_log", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entityType", { length: 100 }),
  entityId: int("entityId"),
  details: text("details"),
  ipAddress: varchar("ipAddress", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});


// ─── 360° Client Timeline ─────────────────────────────────────────────────────
// Chronological history visible to authorized providers with role-based access
export const clientTimeline = mysqlTable("client_timeline", {
  id: int("id").autoincrement().primaryKey(),
  clientUserId: int("clientUserId").notNull(),
  eventType: mysqlEnum("eventType", [
    "appointment",
    "case_note",
    "milestone",
    "medication_change",
    "court_date",
    "referral",
    "housing_update",
    "employment_progress",
    "message",
    "assessment",
    "goal_update",
    "recovery_milestone",
    "provider_note"
  ]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  eventDate: timestamp("eventDate").notNull(),
  createdByUserId: int("createdByUserId").notNull(),
  createdByRole: varchar("createdByRole", { length: 50 }),
  visibleToRoles: text("visibleToRoles"), // JSON array of roles that can view
  requiresConsent: boolean("requiresConsent").default(true).notNull(),
  consentGiven: boolean("consentGiven").default(false).notNull(),
  metadata: text("metadata"), // JSON for event-specific data
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientTimeline = typeof clientTimeline.$inferSelect;
export type InsertClientTimeline = typeof clientTimeline.$inferInsert;

// ─── Insurance Information ────────────────────────────────────────────────────
export const clientInsurance = mysqlTable("client_insurance", {
  id: int("id").autoincrement().primaryKey(),
  clientUserId: int("clientUserId").notNull(),
  insuranceProvider: mysqlEnum("insuranceProvider", [
    "partnership_healthplan",
    "medi_cal",
    "medicare",
    "anthem_blue_cross",
    "kaiser_permanente",
    "aetna",
    "blue_shield",
    "cigna",
    "united_healthcare",
    "self_pay",
    "uninsured",
    "other"
  ]).notNull(),
  insuranceId: varchar("insuranceId", { length: 100 }),
  groupNumber: varchar("groupNumber", { length: 100 }),
  assignedCaseManager: int("assignedCaseManager"), // userId of ECM
  authorizationNumber: varchar("authorizationNumber", { length: 100 }),
  priorAuthRequired: boolean("priorAuthRequired").default(false),
  renewalDate: varchar("renewalDate", { length: 20 }),
  coverageStatus: mysqlEnum("coverageStatus", ["active", "inactive", "pending", "terminated"]).default("active"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientInsurance = typeof clientInsurance.$inferSelect;
export type InsertClientInsurance = typeof clientInsurance.$inferInsert;

// ─── Medication Management ────────────────────────────────────────────────────
export const clientMedications = mysqlTable("client_medications", {
  id: int("id").autoincrement().primaryKey(),
  clientUserId: int("clientUserId").notNull(),
  medicationName: varchar("medicationName", { length: 255 }).notNull(),
  dosage: varchar("dosage", { length: 100 }),
  frequency: varchar("frequency", { length: 100 }),
  prescribingPhysician: varchar("prescribingPhysician", { length: 255 }),
  pharmacy: varchar("pharmacy", { length: 255 }),
  complianceStatus: mysqlEnum("complianceStatus", [
    "taking_as_prescribed",
    "missed_occasionally",
    "frequently_missed",
    "unknown"
  ]).default("unknown"),
  medicationType: mysqlEnum("medicationType", [
    "psychiatric",
    "narcotic_controlled",
    "non_narcotic",
    "mat",
    "over_the_counter",
    "other"
  ]),
  monitoringMethod: mysqlEnum("monitoringMethod", [
    "pill_count",
    "daily_observation",
    "weekly_check",
    "monthly_review"
  ]),
  alerts: text("alerts"), // JSON array of medication alerts
  startDate: varchar("startDate", { length: 20 }),
  endDate: varchar("endDate", { length: 20 }),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientMedication = typeof clientMedications.$inferSelect;
export type InsertClientMedication = typeof clientMedications.$inferInsert;

// ─── Employment Information ───────────────────────────────────────────────────
export const clientEmployment = mysqlTable("client_employment", {
  id: int("id").autoincrement().primaryKey(),
  clientUserId: int("clientUserId").notNull(),
  employmentStatus: mysqlEnum("employmentStatus", [
    "full_time",
    "part_time",
    "temporary",
    "seasonal",
    "self_employed",
    "unemployed",
    "looking_for_work",
    "student",
    "volunteer",
    "retired"
  ]).notNull(),
  workEligible: boolean("workEligible"),
  workRestrictions: text("workRestrictions"),
  disabilityStatus: mysqlEnum("disabilityStatus", [
    "none",
    "temporary",
    "permanent",
    "pending_determination"
  ]).default("none"),
  receivingSSI: boolean("receivingSSI").default(false),
  receivingSSID: boolean("receivingSSID").default(false),
  vocationalRehabilitationEnrolled: boolean("vocationalRehabilitationEnrolled").default(false),
  employmentGoal: text("employmentGoal"),
  currentEmployer: varchar("currentEmployer", { length: 255 }),
  jobTitle: varchar("jobTitle", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientEmployment = typeof clientEmployment.$inferSelect;
export type InsertClientEmployment = typeof clientEmployment.$inferInsert;

// ─── Housing Information ──────────────────────────────────────────────────────
export const clientHousing = mysqlTable("client_housing", {
  id: int("id").autoincrement().primaryKey(),
  clientUserId: int("clientUserId").notNull(),
  currentHousingStatus: mysqlEnum("currentHousingStatus", [
    "unsheltered",
    "emergency_shelter",
    "transitional_housing",
    "sober_living",
    "permanent_housing",
    "with_family",
    "motel",
    "institution",
    "other"
  ]).notNull(),
  housingStabilityScore: int("housingStabilityScore"), // 0-100
  housingGoal: text("housingGoal"),
  moveInDate: varchar("moveInDate", { length: 20 }),
  leaseExpirationDate: varchar("leaseExpirationDate", { length: 20 }),
  landlordName: varchar("landlordName", { length: 255 }),
  landlordContact: varchar("landlordContact", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientHousing = typeof clientHousing.$inferSelect;
export type InsertClientHousing = typeof clientHousing.$inferInsert;

// ─── Court & Probation Information ────────────────────────────────────────────
export const clientCourt = mysqlTable("client_court", {
  id: int("id").autoincrement().primaryKey(),
  clientUserId: int("clientUserId").notNull(),
  probationOfficerId: int("probationOfficerId"), // userId
  probationOfficerName: varchar("probationOfficerName", { length: 255 }),
  probationOfficerContact: varchar("probationOfficerContact", { length: 100 }),
  courtDates: text("courtDates"), // JSON array of court dates
  conditions: text("conditions"), // JSON array of probation conditions
  communityServiceHours: int("communityServiceHours"),
  communityServiceHoursCompleted: int("communityServiceHoursCompleted").default(0),
  drugTestingRequired: boolean("drugTestingRequired").default(false),
  curfew: varchar("curfew", { length: 255 }),
  protectiveOrders: text("protectiveOrders"), // JSON array
  requiredClasses: text("requiredClasses"), // JSON array
  complianceStatus: mysqlEnum("complianceStatus", [
    "compliant",
    "non_compliant",
    "pending_review"
  ]).default("pending_review"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientCourt = typeof clientCourt.$inferSelect;
export type InsertClientCourt = typeof clientCourt.$inferInsert;

// ─── Child Welfare (CPS/CFS) Information ──────────────────────────────────────
export const clientChildWelfare = mysqlTable("client_child_welfare", {
  id: int("id").autoincrement().primaryKey(),
  clientUserId: int("clientUserId").notNull(),
  activeCPSCase: boolean("activeCPSCase").default(false),
  caseWorkerId: int("caseWorkerId"), // userId
  caseWorkerName: varchar("caseWorkerName", { length: 255 }),
  caseWorkerContact: varchar("caseWorkerContact", { length: 100 }),
  childrenInCustody: int("childrenInCustody").default(0),
  visitationSchedule: text("visitationSchedule"),
  courtHearings: text("courtHearings"), // JSON array
  parentingClasses: text("parentingClasses"), // JSON array
  reunificationPlan: text("reunificationPlan"),
  requiredServices: text("requiredServices"), // JSON array
  progressNotes: text("progressNotes"),
  upcomingDeadlines: text("upcomingDeadlines"), // JSON array
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientChildWelfare = typeof clientChildWelfare.$inferSelect;
export type InsertClientChildWelfare = typeof clientChildWelfare.$inferInsert;

// ─── Behavioral Health Information ────────────────────────────────────────────
export const clientBehavioralHealth = mysqlTable("client_behavioral_health", {
  id: int("id").autoincrement().primaryKey(),
  clientUserId: int("clientUserId").notNull(),
  diagnosis: text("diagnosis"), // JSON array of diagnoses
  mentalHealthProviderId: int("mentalHealthProviderId"), // userId
  mentalHealthProviderName: varchar("mentalHealthProviderName", { length: 255 }),
  therapistName: varchar("therapistName", { length: 255 }),
  psychiatristName: varchar("psychiatristName", { length: 255 }),
  substanceUseCounselorName: varchar("substanceUseCounselorName", { length: 255 }),
  levelOfCare: mysqlEnum("levelOfCare", [
    "outpatient",
    "intensive_outpatient",
    "partial_hospitalization",
    "inpatient",
    "residential"
  ]),
  riskLevel: mysqlEnum("riskLevel", [
    "low",
    "moderate",
    "high",
    "crisis"
  ]).default("low"),
  suicideRisk: boolean("suicideRisk").default(false),
  safetyPlan: text("safetyPlan"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientBehavioralHealth = typeof clientBehavioralHealth.$inferSelect;
export type InsertClientBehavioralHealth = typeof clientBehavioralHealth.$inferInsert;

// ─── Medical Information ──────────────────────────────────────────────────────
export const clientMedical = mysqlTable("client_medical", {
  id: int("id").autoincrement().primaryKey(),
  clientUserId: int("clientUserId").notNull(),
  primaryCarePhysician: varchar("primaryCarePhysician", { length: 255 }),
  primaryCarePhysicianContact: varchar("primaryCarePhysicianContact", { length: 100 }),
  specialists: text("specialists"), // JSON array
  medicalConditions: text("medicalConditions"), // JSON array
  allergies: text("allergies"), // JSON array
  emergencyContact: varchar("emergencyContact", { length: 255 }),
  emergencyContactPhone: varchar("emergencyContactPhone", { length: 20 }),
  hospitalizations: text("hospitalizations"), // JSON array with dates and reasons
  upcomingAppointments: text("upcomingAppointments"), // JSON array
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientMedical = typeof clientMedical.$inferSelect;
export type InsertClientMedical = typeof clientMedical.$inferInsert;

// ─── Recovery Information ─────────────────────────────────────────────────────
export const clientRecovery = mysqlTable("client_recovery", {
  id: int("id").autoincrement().primaryKey(),
  clientUserId: int("clientUserId").notNull(),
  cleanDate: varchar("cleanDate", { length: 20 }),
  primaryDrug: varchar("primaryDrug", { length: 100 }),
  recoveryMeetings: text("recoveryMeetings"), // JSON array (type, frequency, location)
  sponsorName: varchar("sponsorName", { length: 255 }),
  sponsorContact: varchar("sponsorContact", { length: 100 }),
  recoveryGoals: text("recoveryGoals"),
  relapseHistory: text("relapseHistory"), // JSON array
  triggers: text("triggers"), // JSON array
  milestones: text("milestones"), // JSON array of recovery milestones
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientRecovery = typeof clientRecovery.$inferSelect;
export type InsertClientRecovery = typeof clientRecovery.$inferInsert;

// ─── Education Information ───────────────────────────────────────────────────
export const clientEducation = mysqlTable("client_education", {
  id: int("id").autoincrement().primaryKey(),
  clientUserId: int("clientUserId").notNull(),
  hasHighSchoolDiploma: boolean("hasHighSchoolDiploma").default(false),
  hasGED: boolean("hasGED").default(false),
  collegeEnrolled: boolean("collegeEnrolled").default(false),
  tradeSchoolEnrolled: boolean("tradeSchoolEnrolled").default(false),
  certifications: text("certifications"), // JSON array
  currentEnrollment: varchar("currentEnrollment", { length: 255 }),
  careerGoals: text("careerGoals"),
  lifeGoals: text("lifeGoals"), // JSON array of life goals
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientEducation = typeof clientEducation.$inferSelect;
export type InsertClientEducation = typeof clientEducation.$inferInsert;

// ─── Provider Permissions & Role-Based Access ────────────────────────────────
export const providerPermissions = mysqlTable("provider_permissions", {
  id: int("id").autoincrement().primaryKey(),
  providerId: int("providerId").notNull(), // userId of provider
  clientId: int("clientId").notNull(), // userId of client
  providerRole: varchar("providerRole", { length: 50 }).notNull(), // ecm, rehabilitation, probation, housing, employment, counselor
  permissions: text("permissions").notNull(), // JSON array of permissions
  consentGiven: boolean("consentGiven").default(false).notNull(),
  consentDate: timestamp("consentDate"),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProviderPermission = typeof providerPermissions.$inferSelect;
export type InsertProviderPermission = typeof providerPermissions.$inferInsert;

// ─── Multi-Agency Outcome & ROI Dashboard ─────────────────────────────────────
export const multiAgencyOutcomes = mysqlTable("multi_agency_outcomes", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull(),
  organizationId: int("organizationId"), // if applicable
  housingStability: boolean("housingStability").default(false),
  treatmentEngagement: boolean("treatmentEngagement").default(false),
  medicationAdherence: boolean("medicationAdherence").default(false),
  appointmentAttendance: int("appointmentAttendance").default(0), // percentage
  employmentPlacement: boolean("employmentPlacement").default(false),
  familyReunification: boolean("familyReunification").default(false),
  edUtilizationReduction: int("edUtilizationReduction").default(0), // percentage reduction
  recidivismReduction: boolean("recidivismReduction").default(false),
  costSavings: int("costSavings").default(0), // in dollars
  grantPerformanceMetrics: text("grantPerformanceMetrics"), // JSON
  qualityMetrics: text("qualityMetrics"), // JSON
  programOutcomes: text("programOutcomes"), // JSON
  reportingPeriodStart: varchar("reportingPeriodStart", { length: 20 }),
  reportingPeriodEnd: varchar("reportingPeriodEnd", { length: 20 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MultiAgencyOutcome = typeof multiAgencyOutcomes.$inferSelect;
export type InsertMultiAgencyOutcome = typeof multiAgencyOutcomes.$inferInsert;


// ─── Provider Profiles (Role-Based Onboarding) ────────────────────────────────
// Stores provider-specific information based on their role (Counselor, Case Manager, ECM Worker, etc.)
export const providerProfiles = mysqlTable("provider_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  
  // STEP 1: Provider Role & Organization
  providerRole: mysqlEnum("providerRole", [
    "counselor",
    "case_manager",
    "ecm_worker",
    "probation_officer",
    "insurance_provider",
    "housing_provider",
    "employment_specialist",
    "peer_support_specialist",
    "medical_provider",
    "admin"
  ]).notNull(),
  organizationName: varchar("organizationName", { length: 255 }).notNull(),
  organizationType: varchar("organizationType", { length: 100 }),
  
  // STEP 2: Credentials & Authority
  licenseNumber: varchar("licenseNumber", { length: 100 }),
  licenseType: varchar("licenseType", { length: 100 }),
  licenseState: varchar("licenseState", { length: 50 }),
  licenseExpiration: varchar("licenseExpiration", { length: 20 }),
  yearsOfExperience: int("yearsOfExperience"),
  certifications: text("certifications"), // JSON array
  
  // STEP 3: Services They Provide
  servicesProvided: text("servicesProvided"), // JSON array
  
  // STEP 4: Client Specializations & Focus Areas
  specializations: text("specializations"), // JSON array
  targetPopulations: text("targetPopulations"), // JSON array
  
  // STEP 5: What They Want to Achieve for Clients
  primaryClientOutcome: text("primaryClientOutcome"),
  secondaryOutcomes: text("secondaryOutcomes"), // JSON array
  measurableMetrics: text("measurableMetrics"), // JSON array
  
  // STEP 6: Capacity & Collaboration
  maxClientsPerMonth: int("maxClientsPerMonth"),
  averageClientsServed: int("averageClientsServed"),
  acceptingNewClients: boolean("acceptingNewClients").default(true),
  serviceDeliveryMethod: varchar("serviceDeliveryMethod", { length: 100 }),
  collaboratingAgencies: text("collaboratingAgencies"), // JSON array
  
  // STEP 7: Data Sharing & Privacy
  dataSharing: boolean("dataSharing").default(false),
  consentRequired: boolean("consentRequired").default(true),
  
  // Contact Information
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 320 }),
  
  // Onboarding Status
  onboardingComplete: boolean("onboardingComplete").default(false),
  onboardingStep: int("onboardingStep").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ProviderProfile = typeof providerProfiles.$inferSelect;
export type InsertProviderProfile = typeof providerProfiles.$inferInsert;




// ─── Saved Searches ───────────────────────────────────────────────────────────
export const savedSearches = mysqlTable("saved_searches", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  searchType: mysqlEnum("searchType", ["clients", "resources", "providers", "events"]).notNull(),
  filters: json("filters").notNull(), // JSON object with filter criteria
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SavedSearch = typeof savedSearches.$inferSelect;
export type InsertSavedSearch = typeof savedSearches.$inferInsert;

// ─── Search Alerts ────────────────────────────────────────────────────────────
export const searchAlerts = mysqlTable("search_alerts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  savedSearchId: int("savedSearchId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  enabled: boolean("enabled").default(true).notNull(),
  frequency: mysqlEnum("frequency", ["immediate", "daily", "weekly"]).default("immediate").notNull(),
  lastAlertSentAt: timestamp("lastAlertSentAt"),
  matchCount: int("matchCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SearchAlert = typeof searchAlerts.$inferSelect;
export type InsertSearchAlert = typeof searchAlerts.$inferInsert;
