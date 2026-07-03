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
  role: mysqlEnum("role", ["user", "case_manager", "org_admin", "admin"]).default("user").notNull(),
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
