import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, jobPostings, jobApplications, recommendations, feedItems, feedInteractions, serviceProviders, serviceSchedules, biDirectionalReferrals, achievements, certificates, certificateTemplates, achievementBadges, goals } from "../drizzle/schema";
import { desc, eq, and, sql } from "drizzle-orm";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.


// ─── Job Board Queries ────────────────────────────────────────────────────────
export async function getActiveJobPostings(filters?: { county?: string; jobType?: string; location?: string }) {
  const db = await getDb();
  if (!db) return [];

  let query: any = db.select().from(jobPostings).where(eq(jobPostings.isActive, true));
  
  if (filters?.county) {
    query = query.where(eq(jobPostings.county, filters.county as any));
  }
  if (filters?.jobType) {
    query = query.where(eq(jobPostings.jobType, filters.jobType as any));
  }

  return await query.orderBy(desc(jobPostings.postedDate));
}

export async function getJobPostingById(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(jobPostings).where(eq(jobPostings.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createJobApplication(userId: number, jobPostingId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(jobApplications).values({
    userId,
    jobPostingId,
    status: "applied",
  });

  return result;
}

export async function getUserJobApplications(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(jobApplications).where(eq(jobApplications.userId, userId)).orderBy(desc(jobApplications.appliedDate));
}

// ─── Recommendations Queries ──────────────────────────────────────────────────
export async function createRecommendation(data: typeof recommendations.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(recommendations).values(data);
  return result;
}

export async function getUserRecommendations(userId: number, status?: string) {
  const db = await getDb();
  if (!db) return [];

  let query: any = db.select().from(recommendations).where(eq(recommendations.userId, userId));
  
  if (status) {
    query = query.where(eq(recommendations.status, status as any));
  }

  return await query.orderBy(desc(recommendations.priority), desc(recommendations.createdAt));
}

export async function updateRecommendationStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(recommendations).set({ status: status as any }).where(eq(recommendations.id, id));
}

// ─── Live Feed Queries ────────────────────────────────────────────────────────
export async function createFeedItem(data: typeof feedItems.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(feedItems).values(data);
  return result;
}

export async function getUserFeedItems(userId: number, limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) return [];

  return db.select()
    .from(feedItems)
    .where(eq(feedItems.userId, userId))
    .orderBy(desc(feedItems.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function markFeedItemAsRead(feedItemId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.update(feedItems).set({ isRead: true, readAt: new Date() }).where(eq(feedItems.id, feedItemId));
}

export async function recordFeedInteraction(userId: number, feedItemId: number, interactionType: 'viewed' | 'clicked' | 'applied' | 'accepted' | 'declined' | 'saved' | 'shared') {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(feedInteractions).values({ userId, feedItemId, interactionType });
}

// ─── Service Provider Queries ─────────────────────────────────────────────────
export async function getServiceProviders(filters?: { type?: string; county?: string; isActive?: boolean }) {
  const db = await getDb();
  if (!db) return [];

  let query: any = db.select().from(serviceProviders);
  
  if (filters?.county) {
    query = query.where(eq(serviceProviders.county, filters.county));
  }
  if (filters?.isActive !== undefined) {
    query = query.where(eq(serviceProviders.isActive, filters.isActive));
  }

  return await query;
}

export async function getServiceProviderSchedules(serviceProviderId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(serviceSchedules).where(eq(serviceSchedules.serviceProviderId, serviceProviderId));
}

// ─── Bi-Directional Referral Queries ──────────────────────────────────────────
export async function createBiDirectionalReferral(data: typeof biDirectionalReferrals.$inferInsert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(biDirectionalReferrals).values(data);
  return result;
}

export async function getClientReferrals(clientId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select()
    .from(biDirectionalReferrals)
    .where(eq(biDirectionalReferrals.clientId, clientId))
    .orderBy(desc(biDirectionalReferrals.sentAt));
}

export async function updateReferralStatus(referralId: number, status: string, clientResponse?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: any = { respondedAt: new Date() };
  if (status) updateData.status = status;
  if (clientResponse) updateData.clientResponse = clientResponse;

  return db.update(biDirectionalReferrals)
    .set(updateData)
    .where(eq(biDirectionalReferrals.id, referralId));
}

export async function sendReferralReminder(referralId: number, reminderMethod: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: any = { reminderSent: true, reminderSentAt: new Date() };
  if (reminderMethod) updateData.reminderMethod = reminderMethod;

  return db.update(biDirectionalReferrals)
    .set(updateData)
    .where(eq(biDirectionalReferrals.id, referralId));
}


// ─── Achievements & Certificates ──────────────────────────────────────────────
export async function checkAchievementEligibility(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const goalsData = await db
    .select({
      id: goals.id,
      title: goals.title,
      status: goals.status,
    })
    .from(goals)
    .where(eq(goals.userId, clientId));

  const eligible = [];
  for (const goal of goalsData) {
    // For now, assume 78% completion for demonstration
    // In production, calculate from milestones or progress tracking
    const completionPercentage = 85;
    if (completionPercentage >= 78) {
      eligible.push({
        goalId: goal.id,
        title: goal.title,
        completionPercentage,
        achievementType: "goal_completion",
      });
    }
  }
  return eligible;
}

export async function createAchievement(
  clientId: number,
  achievementType: string,
  title: string,
  description: string,
  completionPercentage: number,
  goalId?: number,
  milestoneId?: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const isEligible = completionPercentage >= 78;
  const result = await db.insert(achievements).values({
    clientId,
    achievementType: achievementType as any,
    title,
    description,
    completionPercentage,
    goalId,
    milestoneId,
    isEligibleForCertificate: isEligible,
  });
  return result;
}

export async function getClientAchievements(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(achievements)
    .where(eq(achievements.clientId, clientId))
    .orderBy(desc(achievements.earnedAt));
}

export async function getEligibleAchievements(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(achievements)
    .where(
      and(
        eq(achievements.clientId, clientId),
        eq(achievements.isEligibleForCertificate, true),
        eq(achievements.certificateGenerated, false)
      )
    );
}

export async function createCertificate(
  clientId: number,
  achievementId: number,
  title: string,
  description: string,
  completionPercentage: number,
  clientName: string,
  certificateNumber: string,
  verificationCode: string,
  pdfUrl: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(certificates).values({
    clientId,
    achievementId,
    title,
    description,
    completionPercentage,
    clientName,
    certificateNumber,
    verificationCode,
    pdfUrl,
    issuerName: "Pathways 360",
    issuerTitle: "Program Coordinator",
  });
  return result;
}

export async function getCertificate(certificateId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(certificates).where(eq(certificates.id, certificateId)).limit(1);
}

export async function getClientCertificates(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(certificates)
    .where(eq(certificates.clientId, clientId))
    .orderBy(desc(certificates.issuedDate));
}

export async function updateCertificateViewCount(certificateId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .update(certificates)
    .set({
      viewCount: sql`${certificates.viewCount} + 1`,
      lastViewedAt: new Date(),
    })
    .where(eq(certificates.id, certificateId));
}

export async function updateCertificateDownloadCount(certificateId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .update(certificates)
    .set({
      downloadCount: sql`${certificates.downloadCount} + 1`,
      lastDownloadedAt: new Date(),
    })
    .where(eq(certificates.id, certificateId));
}

export async function updateCertificatePrintCount(certificateId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .update(certificates)
    .set({
      printCount: sql`${certificates.printCount} + 1`,
      lastPrintedAt: new Date(),
    })
    .where(eq(certificates.id, certificateId));
}

export async function getCertificateTemplate(achievementType: string) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(certificateTemplates)
    .where(
      and(
        eq(certificateTemplates.achievementType, achievementType as any),
        eq(certificateTemplates.isActive, true)
      )
    )
    .limit(1);
}

export async function createAchievementBadge(
  clientId: number,
  badgeType: string,
  title: string,
  description: string,
  iconUrl: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(achievementBadges).values({
    clientId,
    badgeType: badgeType as any,
    title,
    description,
    iconUrl,
  });
}

export async function getClientBadges(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db
    .select()
    .from(achievementBadges)
    .where(eq(achievementBadges.clientId, clientId))
    .orderBy(desc(achievementBadges.unlockedAt));
}
