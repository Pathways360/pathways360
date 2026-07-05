import { COOKIE_NAME } from "@shared/const";
import { createHeartbeatJob, deleteHeartbeatJob } from "./_core/heartbeat";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { achievementsRouter } from "./routers/achievements";
import { certificateVerificationRouter } from "./routers/certificateVerification";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { getDb } from "./db";
import { invokeLLM } from "./_core/llm";
import {
  users, userProfiles, needsAssessments, coachSettings,
  goals, appointments, chatMessages, resources, organizations,
  caseManagerAssignments, dailyCoachMessages, milestones,
  notificationPreferences, providerMessages,
  clientAgencyEnrollments, sharedProgressNotes, clientGapFlags,
  resourceRecommendations, countyResources, progressMilestones,
  communityEvents, userServiceAreas, eventEngagement, dailyFeedItems,
  userFavorites, recentlyViewed, userDocuments,
  messageThreads, threadParticipants, threadMessages, auditLog,
  clientTimeline, clientInsurance, clientMedications, clientEmployment,
  clientHousing, clientCourt, clientChildWelfare, clientBehavioralHealth,
  clientMedical, clientRecovery, clientEducation, providerPermissions,
  multiAgencyOutcomes,
  savedSearches,
  searchAlerts,
  jobPostings, jobApplications, recommendations, feedItems, feedInteractions,
  serviceProviders, serviceSchedules, biDirectionalReferrals,
} from "../drizzle/schema";
import { eq, and, desc, gte, lte, or, like, inArray } from "drizzle-orm";
import {
  calculateProviderMatch,
  calculateResourceMatch,
  getTopProviderMatches,
  getTopResourceMatches,
  getReferralSuggestions,
  getMatchExplanation,
  type ClientProfile,
  type ProviderProfile,
  type ResourceProfile,
  type MatchResult,
} from "./matching";
import { jobBoardRouter } from "./routers/jobBoard";
import { liveFeedRouter } from "./routers/liveFeed";
import { recommendationsRouter as postAssessmentRecommendationsRouter } from "./routers/recommendations";
import { biDirectionalReferralsRouter } from "./routers/biDirectionalReferrals";

// ─── Helpers ─────────────────────────────────────────────────────────────────
async function requireDb() {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
  return db;
}

// ─── Auth Router ─────────────────────────────────────────────────────────────
const authRouter = router({
  me: publicProcedure.query(opts => opts.ctx.user),
  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return { success: true } as const;
  }),
});

// ─── Profile Router ───────────────────────────────────────────────────────────
const profileRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const db = await requireDb();
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, ctx.user.id)).limit(1);
    return profile || null;
  }),
  upsert: protectedProcedure
    .input(z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
      dateOfBirth: z.string().optional(),
      gender: z.string().optional(),
      preferredLanguage: z.string().optional(),
      zipCode: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      county: z.string().optional(),
      emergencyContactName: z.string().optional(),
      emergencyContactPhone: z.string().optional(),
      emergencyContactRelation: z.string().optional(),
      housingStatus: z.string().optional(),
      isVeteran: z.boolean().optional(),
      insuranceType: z.string().optional(),
      hasMediCal: z.boolean().optional(),
      onProbationOrParole: z.boolean().optional(),
      probationCounty: z.string().optional(),
      drugOfChoice: z.string().optional(),
      sobrietyDate: z.string().optional(),
      hasTransportation: z.boolean().optional(),
      employmentStatus: z.string().optional(),
      allowCaseManagerAccess: z.boolean().optional(),
      profileComplete: z.boolean().optional(),
      assessmentComplete: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const [existing] = await db.select().from(userProfiles).where(eq(userProfiles.userId, ctx.user.id)).limit(1);
      if (existing) {
        await db.update(userProfiles).set(input).where(eq(userProfiles.userId, ctx.user.id));
      } else {
        await db.insert(userProfiles).values({ userId: ctx.user.id, ...input });
      }
      return { success: true };
    }),
});

// ─── Assessment Router ────────────────────────────────────────────────────────
const assessmentRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const db = await requireDb();
    const [assessment] = await db.select().from(needsAssessments).where(eq(needsAssessments.userId, ctx.user.id)).limit(1);
    return assessment || null;
  }),
  save: protectedProcedure
    .input(z.object({
      housingStatus: z.string().optional(),
      employmentStatus: z.string().optional(),
      hasIncome: z.boolean().optional(),
      incomeSource: z.string().optional(),
      hasHealthInsurance: z.boolean().optional(),
      insuranceType: z.string().optional(),
      hasMedicalConditions: z.boolean().optional(),
      medicalConditions: z.string().optional(),
      takesMedication: z.boolean().optional(),
      hasDentalNeeds: z.boolean().optional(),
      hasVisionNeeds: z.boolean().optional(),
      mentalHealthStatus: z.string().optional(),
      inRecovery: z.boolean().optional(),
      substanceUseHistory: z.string().optional(),
      hasSponsor: z.boolean().optional(),
      attendsMeetings: z.boolean().optional(),
      hasLegalIssues: z.boolean().optional(),
      onProbationOrParole: z.boolean().optional(),
      hasCourtDates: z.boolean().optional(),
      hasGovernmentId: z.boolean().optional(),
      hasSocialSecurityCard: z.boolean().optional(),
      hasBirthCertificate: z.boolean().optional(),
      hasTransportation: z.boolean().optional(),
      hasDriversLicense: z.boolean().optional(),
      hasChildren: z.boolean().optional(),
      numberOfChildren: z.number().optional(),
      domesticViolenceHistory: z.boolean().optional(),
      isVeteran: z.boolean().optional(),
      highestEducation: z.string().optional(),
      hasPhone: z.boolean().optional(),
      hasInternet: z.boolean().optional(),
      techSkillLevel: z.string().optional(),
      primaryGoals: z.string().optional(),
      biggestObstacles: z.string().optional(),
      hasCaseWorker: z.boolean().optional(),
      caseWorkerName: z.string().optional(),
      emergencyContactName: z.string().optional(),
      emergencyContactPhone: z.string().optional(),
      faithBased: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const [existing] = await db.select().from(needsAssessments).where(eq(needsAssessments.userId, ctx.user.id)).limit(1);
      if (existing) {
        await db.update(needsAssessments).set(input).where(eq(needsAssessments.userId, ctx.user.id));
      } else {
        await db.insert(needsAssessments).values({ userId: ctx.user.id, ...input });
      }
      // Mark assessment complete on profile
      await db.update(userProfiles).set({ assessmentComplete: true }).where(eq(userProfiles.userId, ctx.user.id));
      return { success: true };
    }),
  generateGoals: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await requireDb();
    const [assessment] = await db.select().from(needsAssessments).where(eq(needsAssessments.userId, ctx.user.id)).limit(1);
    if (!assessment) throw new TRPCError({ code: "NOT_FOUND", message: "Assessment not found" });

    const prompt = `Based on this person's needs assessment, generate 3-5 prioritized life restoration goals.
Assessment: ${JSON.stringify(assessment, null, 2)}

Return JSON array of goals with: title, description, category (housing/employment/health/legal/recovery/education/identity/financial/family/transportation/other), steps (array of strings), priority (1=highest).`;

    const response = await invokeLLM({
      messages: [
        { role: "system", content: "You are a compassionate life restoration coach. Generate practical, achievable goals." },
        { role: "user", content: prompt }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "goals_list",
          strict: true,
          schema: {
            type: "object",
            properties: {
              goals: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    category: { type: "string" },
                    steps: { type: "array", items: { type: "string" } },
                    priority: { type: "number" }
                  },
                  required: ["title", "description", "category", "steps", "priority"],
                  additionalProperties: false
                }
              }
            },
            required: ["goals"],
            additionalProperties: false
          }
        }
      }
    });

    const rawContent = response.choices[0]?.message?.content;
    if (!rawContent) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "AI failed to generate goals" });
    const contentStr = typeof rawContent === "string" ? rawContent : JSON.stringify(rawContent);
    const parsed = JSON.parse(contentStr);

    for (const g of parsed.goals) {
      await db.insert(goals).values({
        userId: ctx.user.id,
        title: g.title,
        description: g.description,
        category: g.category,
        steps: g.steps,
        priority: g.priority,
        status: "not_started",
      });
    }
    return { success: true, count: parsed.goals.length };
  }),
});

// ─── Coach Router ─────────────────────────────────────────────────────────────
const coachRouter = router({
  getSettings: protectedProcedure.query(async ({ ctx }) => {
    const db = await requireDb();
    const [settings] = await db.select().from(coachSettings).where(eq(coachSettings.userId, ctx.user.id)).limit(1);
    return settings || null;
  }),
  saveSettings: protectedProcedure
    .input(z.object({
      coachName: z.string().min(1).max(100),
      avatarType: z.enum(["library", "upload"]),
      avatarLibraryId: z.string().optional(),
      avatarUploadUrl: z.string().optional(),
      devotionalsEnabled: z.boolean(),
      motivationalEnabled: z.boolean(),
      checkInFrequency: z.enum(["morning", "morning_evening", "three_times"]),
      coachPersonality: z.enum(["encouraging", "direct", "gentle", "faith_based"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const [existing] = await db.select().from(coachSettings).where(eq(coachSettings.userId, ctx.user.id)).limit(1);
      if (existing) {
        await db.update(coachSettings).set(input).where(eq(coachSettings.userId, ctx.user.id));
      } else {
        await db.insert(coachSettings).values({ userId: ctx.user.id, ...input });
      }
      return { success: true };
    }),
  getTodayMessage: protectedProcedure.query(async ({ ctx }) => {
    const db = await requireDb();
    const [settings] = await db.select().from(coachSettings).where(eq(coachSettings.userId, ctx.user.id)).limit(1);
    const coachName = settings?.coachName || "Alex";

    // Check for existing today's message
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    const [existing] = await db.select().from(dailyCoachMessages)
      .where(and(eq(dailyCoachMessages.userId, ctx.user.id), gte(dailyCoachMessages.createdAt, todayStart)))
      .limit(1);

    if (existing) return { message: existing.message, coachName };

    // Generate new message
    const personality = settings?.coachPersonality || "encouraging";
    const devotionals = settings?.devotionalsEnabled || false;

    const sysPrompt = `You are ${coachName}, a compassionate ${personality} life coach. 
Keep messages warm, brief (2-3 sentences), and uplifting. ${devotionals ? "Include a brief faith-based encouragement." : ""}
Never be preachy. Always be genuine and human.`;

    const response = await invokeLLM({
      messages: [
        { role: "system", content: sysPrompt },
        { role: "user", content: "Write a brief, warm good morning message for someone rebuilding their life." }
      ]
    });

    const rawMsg = response.choices[0]?.message?.content || `Good morning! Today is a new opportunity. You've got this — one step at a time. 💪`;
    const message = typeof rawMsg === "string" ? rawMsg : JSON.stringify(rawMsg);

    await db.insert(dailyCoachMessages).values({
      userId: ctx.user.id,
      message,
      messageType: "morning",
    });

    return { message, coachName };
  }),
  chat: protectedProcedure
    .input(z.object({ message: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const [settings] = await db.select().from(coachSettings).where(eq(coachSettings.userId, ctx.user.id)).limit(1);
      const coachName = settings?.coachName || "Alex";

      // Save user message
      await db.insert(chatMessages).values({
        userId: ctx.user.id,
        chatType: "coach",
        role: "user",
        content: input.message,
      });

      // Get recent history
      const history = await db.select().from(chatMessages)
        .where(and(eq(chatMessages.userId, ctx.user.id), eq(chatMessages.chatType, "coach")))
        .orderBy(desc(chatMessages.createdAt)).limit(10);

      const messages = [
        {
          role: "system" as const,
          content: `You are ${coachName}, a compassionate ${settings?.coachPersonality || "encouraging"} life coach. 
You help people rebuild their lives. Be warm, supportive, and practical. Never judge. Always encourage.
${settings?.devotionalsEnabled ? "You can include brief faith-based encouragement when appropriate." : ""}`
        },
        ...history.reverse().map(m => ({ role: m.role as "user" | "assistant", content: m.content as string })),
      ];

      const response = await invokeLLM({ messages });
      const reply = response.choices[0]?.message?.content || "I'm here with you. Keep going — you're doing great.";
      const replyStr = typeof reply === "string" ? reply : JSON.stringify(reply);

      await db.insert(chatMessages).values({
        userId: ctx.user.id,
        chatType: "coach",
        role: "assistant",
        content: replyStr,
      });

      return { reply: replyStr, coachName };
    }),
  getChatHistory: protectedProcedure.query(async ({ ctx }) => {
    const db = await requireDb();
    const msgs = await db.select().from(chatMessages)
      .where(and(eq(chatMessages.userId, ctx.user.id), eq(chatMessages.chatType, "coach")))
      .orderBy(desc(chatMessages.createdAt)).limit(50);
    return msgs.reverse();
  }),
});

// ─── Goals Router ─────────────────────────────────────────────────────────────
const goalsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await requireDb();
    return db.select().from(goals).where(eq(goals.userId, ctx.user.id)).orderBy(goals.priority, goals.createdAt);
  }),
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      category: z.enum(["housing","employment","health","legal","recovery","education","identity","financial","family","transportation","other"]),
      steps: z.array(z.string()).optional(),
      dueDate: z.string().optional(),
      priority: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const result = await db.insert(goals).values({
        userId: ctx.user.id,
        title: input.title,
        description: input.description,
        category: input.category,
        steps: input.steps || [],
        dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
        priority: input.priority || 5,
        status: "not_started",
      });
      return { id: Number(result[0].insertId) };
    }),
  updateStatus: protectedProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["not_started","in_progress","completed","paused"]),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const updateData: any = { status: input.status };
      if (input.status === "completed") {
        updateData.completedAt = new Date();
        // Award milestone
        const [goal] = await db.select().from(goals).where(and(eq(goals.id, input.id), eq(goals.userId, ctx.user.id))).limit(1);
        if (goal) {
          await db.insert(milestones).values({
            userId: ctx.user.id,
            title: `Completed: ${goal.title}`,
            description: `You completed your ${goal.category} goal!`,
            celebrationMessage: `Amazing work! You completed "${goal.title}". Every step forward matters. 🎉`,
          });
        }
      }
      await db.update(goals).set(updateData).where(and(eq(goals.id, input.id), eq(goals.userId, ctx.user.id)));
      return { success: true };
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      await db.delete(goals).where(and(eq(goals.id, input.id), eq(goals.userId, ctx.user.id)));
      return { success: true };
    }),
});

// ─── Appointments Router ──────────────────────────────────────────────────────

/** Build a 6-field UTC cron from a JS Date (fires once at that exact minute). */
function dateToCron(date: Date): string {
  return `0 ${date.getUTCMinutes()} ${date.getUTCHours()} ${date.getUTCDate()} ${date.getUTCMonth() + 1} *`;
}

/** Extract the raw session token from the request cookie (needed by heartbeat). */
function getSessionToken(ctx: { req: { headers: { cookie?: string } } }): string {
  const raw = ctx.req.headers.cookie || "";
  const match = raw.match(/manus_session=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

const appointmentsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await requireDb();
    return db.select().from(appointments).where(eq(appointments.userId, ctx.user.id)).orderBy(appointments.appointmentDate);
  }),
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      type: z.enum(["medical","legal","court","probation","employment","housing","recovery","medication","other"]),
      appointmentDate: z.string(),
      location: z.string().optional(),
      reminderEnabled: z.boolean().optional(),
      reminderMinutesBefore: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const apptDate = new Date(input.appointmentDate);
      const reminderEnabled = input.reminderEnabled ?? true;
      const minutesBefore = input.reminderMinutesBefore ?? 60;

      const result = await db.insert(appointments).values({
        userId: ctx.user.id,
        title: input.title,
        description: input.description,
        type: input.type,
        appointmentDate: apptDate,
        location: input.location,
        reminderEnabled,
        reminderMinutesBefore: minutesBefore,
      });
      const apptId = Number(result[0].insertId);

      // Schedule a heartbeat reminder if enabled and appointment is in the future
      if (reminderEnabled) {
        const reminderTime = new Date(apptDate.getTime() - minutesBefore * 60 * 1000);
        if (reminderTime > new Date()) {
          try {
            const sessionToken = getSessionToken(ctx);
            const { taskUid } = await createHeartbeatJob(
              {
                name: `appt-reminder-${apptId}`,
                cron: dateToCron(reminderTime),
                path: "/api/scheduled/appointment-reminder",
                method: "POST",
                payload: { appointmentId: apptId },
                description: `Reminder for appointment: ${input.title}`,
              },
              sessionToken
            );
            await db.update(appointments)
              .set({ scheduleCronTaskUid: taskUid })
              .where(eq(appointments.id, apptId));
          } catch (err) {
            // Non-fatal: appointment is saved, reminder scheduling failed
            console.warn("[Reminder] Failed to schedule heartbeat job:", err);
          }
        }
      }

      return { id: apptId };
    }),
  reschedule: protectedProcedure
    .input(z.object({ id: z.number(), appointmentDate: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const newDate = new Date(input.appointmentDate);
      // Cancel old reminder job if exists
      const [appt] = await db.select().from(appointments)
        .where(and(eq(appointments.id, input.id), eq(appointments.userId, ctx.user.id))).limit(1);
      if (appt?.scheduleCronTaskUid) {
        try { const sessionToken = getSessionToken(ctx); await deleteHeartbeatJob(appt.scheduleCronTaskUid, sessionToken); } catch {}
      }
      await db.update(appointments).set({ appointmentDate: newDate, scheduleCronTaskUid: null }).where(and(eq(appointments.id, input.id), eq(appointments.userId, ctx.user.id)));
      return { success: true };
    }),
  scheduleForClient: protectedProcedure
    .input(z.object({
      clientId: z.number(),
      title: z.string().min(1),
      description: z.string().optional(),
      type: z.enum(["medical","legal","court","probation","employment","housing","recovery","medication","other"]),
      appointmentDate: z.string(),
      location: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const providerRoles = ["case_manager","ecm_worker","probation_officer","counselor","org_admin","admin"];
      if (!providerRoles.includes(ctx.user.role)) throw new TRPCError({ code: "FORBIDDEN" });
      const result = await db.insert(appointments).values({
        userId: input.clientId,
        title: input.title,
        description: input.description,
        type: input.type,
        appointmentDate: new Date(input.appointmentDate),
        location: input.location,
        reminderEnabled: true,
        reminderMinutesBefore: 60,
      });
      return { id: Number(result[0].insertId) };
    }),
  complete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      await db.update(appointments).set({ completed: true }).where(and(eq(appointments.id, input.id), eq(appointments.userId, ctx.user.id)));
      return { success: true };
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      // Cancel the heartbeat job if one exists
      const [appt] = await db.select().from(appointments)
        .where(and(eq(appointments.id, input.id), eq(appointments.userId, ctx.user.id)))
        .limit(1);
      if (appt?.scheduleCronTaskUid) {
        try {
          const sessionToken = getSessionToken(ctx);
          await deleteHeartbeatJob(appt.scheduleCronTaskUid, sessionToken);
        } catch (err) {
          console.warn("[Reminder] Failed to delete heartbeat job:", err);
        }
      }
      await db.delete(appointments).where(and(eq(appointments.id, input.id), eq(appointments.userId, ctx.user.id)));
      return { success: true };
    }),
});

// ─── Resources Router ─────────────────────────────────────────────────────────
const resourcesRouter = router({
  list: publicProcedure
    .input(z.object({
      category: z.string().optional(),
      zipCode: z.string().optional(),
      city: z.string().optional(),
      search: z.string().optional(),
    }).optional())
    .query(async ({ input }) => {
      const db = await requireDb();
      let query = db.select().from(resources).where(eq(resources.isActive, true));
      const results = await db.select().from(resources).where(eq(resources.isActive, true));
      // Filter in JS for simplicity
      return results.filter(r => {
        if (input?.category && r.category !== input.category) return false;
        if (input?.zipCode && r.zipCode !== input.zipCode) return false;
        if (input?.city && !r.city?.toLowerCase().includes(input.city.toLowerCase())) return false;
        if (input?.search) {
          const s = input.search.toLowerCase();
          return r.name.toLowerCase().includes(s) || r.description?.toLowerCase().includes(s) || false;
        }
        return true;
      });
    }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await requireDb();
      const [resource] = await db.select().from(resources).where(eq(resources.id, input.id)).limit(1);
      return resource || null;
    }),
  // Org admin: create/update
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      category: z.enum(["shelter","food","medical","mental_health","recovery","employment","legal","transportation","education","financial","clothing","hygiene","family","veterans","youth","domestic_violence","other"]),
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
      phone: z.string().optional(),
      website: z.string().optional(),
      hours: z.string().optional(),
      eligibility: z.string().optional(),
      documentsNeeded: z.string().optional(),
      appointmentRequired: z.boolean().optional(),
      walkInsWelcome: z.boolean().optional(),
      languages: z.string().optional(),
      isAccessible: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "org_admin" && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
      const db = await requireDb();
      const result = await db.insert(resources).values(input);
      return { id: Number(result[0].insertId) };
    }),
});

// ─── Counselor (AI) Router ────────────────────────────────────────────────────
const counselorRouter = router({
  chat: protectedProcedure
    .input(z.object({ message: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();

      // Crisis detection keywords
      const crisisKeywords = ["suicide", "kill myself", "end my life", "don't want to live", "hurt myself", "self harm", "overdose", "give up on life"];
      const crisisDetected = crisisKeywords.some(kw => input.message.toLowerCase().includes(kw));

      await db.insert(chatMessages).values({
        userId: ctx.user.id,
        chatType: "counselor",
        role: "user",
        content: input.message,
        crisisDetected,
      });

      // Get recent history
      const history = await db.select().from(chatMessages)
        .where(and(eq(chatMessages.userId, ctx.user.id), eq(chatMessages.chatType, "counselor")))
        .orderBy(desc(chatMessages.createdAt)).limit(20);

      const systemPrompt = `You are a compassionate, non-judgmental AI counselor for people rebuilding their lives.
You provide emotional support, coping strategies, and practical guidance.
NEVER shame, lecture, or diagnose. Always validate feelings first.
If someone seems to be in emotional pain or crisis, gently and warmly acknowledge their feelings and encourage them to reach out to a real person — suggest calling or texting 988 (Suicide & Crisis Lifeline) or texting HOME to 741741 (Crisis Text Line).
Keep responses warm, human, and concise (3-5 sentences unless more detail is needed).
You are NOT a replacement for professional mental health care — always be clear about that when relevant.`;

      const messages = [
        { role: "system" as const, content: systemPrompt },
        ...history.reverse().map(m => ({ role: m.role as "user" | "assistant", content: m.content as string })),
      ];

      const response = await invokeLLM({ messages });
      const rawReply = response.choices[0]?.message?.content || "I hear you. You're not alone in this. I'm here to listen and help however I can.";
      let reply = typeof rawReply === "string" ? rawReply : JSON.stringify(rawReply);

      // Append crisis resources if detected
      if (crisisDetected) {
        reply += "\n\n💙 I want to make sure you're safe. If you're having thoughts of hurting yourself, please reach out to someone who can help right now:\n• **988 Suicide & Crisis Lifeline** — call or text 988\n• **Crisis Text Line** — text HOME to 741741\nYou matter, and support is available 24/7.";
      }

      await db.insert(chatMessages).values({
        userId: ctx.user.id,
        chatType: "counselor",
        role: "assistant",
        content: reply,
        crisisDetected,
      });

      return { reply, crisisDetected };
    }),
  getChatHistory: protectedProcedure.query(async ({ ctx }) => {
    const db = await requireDb();
    const msgs = await db.select().from(chatMessages)
      .where(and(eq(chatMessages.userId, ctx.user.id), eq(chatMessages.chatType, "counselor")))
      .orderBy(desc(chatMessages.createdAt)).limit(50);
    return msgs.reverse();
  }),
});

// ─── Dashboard Router ─────────────────────────────────────────────────────────
const dashboardRouter = router({
  getSummary: protectedProcedure.query(async ({ ctx }) => {
    const db = await requireDb();
    const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, ctx.user.id)).limit(1);
    const allGoals = await db.select().from(goals).where(eq(goals.userId, ctx.user.id));
    const upcomingAppts = await db.select().from(appointments)
      .where(and(eq(appointments.userId, ctx.user.id), eq(appointments.completed, false), gte(appointments.appointmentDate, new Date())))
      .orderBy(appointments.appointmentDate).limit(5);
    const allMilestones = await db.select().from(milestones).where(eq(milestones.userId, ctx.user.id));

    const activeGoals = allGoals.filter(g => g.status !== "completed").slice(0, 4);
    const stats = {
      totalGoals: allGoals.length,
      goalsCompleted: allGoals.filter(g => g.status === "completed").length,
      goalsInProgress: allGoals.filter(g => g.status === "in_progress").length,
      milestones: allMilestones.length,
    };

    return { profile: profile || null, goals: activeGoals, appointments: upcomingAppts, stats };
  }),
});

// ─── Milestones Router ────────────────────────────────────────────────────────
const milestonesRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await requireDb();
    return db.select().from(milestones).where(eq(milestones.userId, ctx.user.id)).orderBy(desc(milestones.achievedAt));
  }),
});

// ─── Case Manager Router ──────────────────────────────────────────────────────
const caseManagerRouter = router({
  getClients: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "case_manager" && ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    const db = await requireDb();
    const assignments = await db.select().from(caseManagerAssignments)
      .where(and(eq(caseManagerAssignments.caseManagerId, ctx.user.id), eq(caseManagerAssignments.isActive, true)));
    const clientIds = assignments.filter(a => a.consentGiven).map(a => a.clientId);
    if (!clientIds.length) return [];
    const clients = await db.select().from(users).where(eq(users.id, clientIds[0]));
    return clients;
  }),
  grantConsent: protectedProcedure
    .input(z.object({ caseManagerId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const [existing] = await db.select().from(caseManagerAssignments)
        .where(and(eq(caseManagerAssignments.caseManagerId, input.caseManagerId), eq(caseManagerAssignments.clientId, ctx.user.id)))
        .limit(1);
      if (existing) {
        await db.update(caseManagerAssignments).set({ consentGiven: true, consentDate: new Date() })
          .where(eq(caseManagerAssignments.id, existing.id));
      } else {
        await db.insert(caseManagerAssignments).values({
          caseManagerId: input.caseManagerId,
          clientId: ctx.user.id,
          consentGiven: true,
          consentDate: new Date(),
        });
      }
      return { success: true };
    }),
  // Provider-side: get full client list (all users with role=user, for providers without assignment system)
  getAllClients: protectedProcedure.query(async ({ ctx }) => {
    const providerRoles = ["case_manager","ecm_worker","probation_officer","counselor","org_admin","admin"];
    if (!providerRoles.includes(ctx.user.role)) throw new TRPCError({ code: "FORBIDDEN" });
    const db = await requireDb();
    return db.select({ id: users.id, name: users.name, role: users.role, createdAt: users.createdAt })
      .from(users).where(eq(users.role, "user")).orderBy(desc(users.createdAt)).limit(100);
  }),
  getClientProfile: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ ctx, input }) => {
      const providerRoles = ["case_manager","ecm_worker","probation_officer","counselor","org_admin","admin"];
      if (!providerRoles.includes(ctx.user.role)) throw new TRPCError({ code: "FORBIDDEN" });
      const db = await requireDb();
      const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, input.clientId)).limit(1);
      const [assessment] = await db.select().from(needsAssessments).where(eq(needsAssessments.userId, input.clientId)).limit(1);
      const clientGoals = await db.select().from(goals).where(eq(goals.userId, input.clientId)).orderBy(desc(goals.createdAt)).limit(10);
      const clientAppts = await db.select().from(appointments).where(eq(appointments.userId, input.clientId)).orderBy(desc(appointments.appointmentDate)).limit(10);
      const gapFlags = await db.select().from(clientGapFlags).where(and(eq(clientGapFlags.clientId, input.clientId), eq(clientGapFlags.resolved, false)));
      return { profile: profile || null, assessment: assessment || null, goals: clientGoals, appointments: clientAppts, gapFlags };
    }),
  addNote: protectedProcedure
    .input(z.object({
      clientId: z.number(),
      content: z.string().min(1),
      noteType: z.enum(["progress","concern","milestone","handoff","referral","crisis","housing_update","employment_update","recovery_update","legal_update","medical_update","general"]).default("general"),
      visibility: z.enum(["all_agencies","own_agency"]).default("all_agencies"),
    }))
    .mutation(async ({ ctx, input }) => {
      const providerRoles = ["case_manager","ecm_worker","probation_officer","counselor","org_admin","admin"];
      if (!providerRoles.includes(ctx.user.role)) throw new TRPCError({ code: "FORBIDDEN" });
      const db = await requireDb();
      await db.insert(sharedProgressNotes).values({
        clientId: input.clientId,
        authorProviderId: ctx.user.id,
        authorOrganizationId: 1,
        noteType: input.noteType,
        content: input.content,
        visibility: input.visibility,
      });
      return { success: true };
    }),
  getNotes: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ ctx, input }) => {
      const providerRoles = ["case_manager","ecm_worker","probation_officer","counselor","org_admin","admin"];
      if (!providerRoles.includes(ctx.user.role)) throw new TRPCError({ code: "FORBIDDEN" });
      const db = await requireDb();
      return db.select().from(sharedProgressNotes)
        .where(eq(sharedProgressNotes.clientId, input.clientId))
        .orderBy(desc(sharedProgressNotes.createdAt)).limit(50);
    }),
  flagGap: protectedProcedure
    .input(z.object({
      clientId: z.number(),
      gapCategory: z.enum(["no_housing_plan","chronically_homeless","no_mental_health_provider","no_substance_use_treatment","no_government_id","no_income","no_health_insurance","no_employment_plan","no_ecm_provider","probation_compliance_risk","no_peer_support","no_transportation","no_legal_representation","no_education_plan","family_reunification_needed","medication_not_managed","crisis_risk","other"]),
      severity: z.enum(["low","medium","high","critical"]).default("medium"),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const providerRoles = ["case_manager","ecm_worker","probation_officer","counselor","org_admin","admin"];
      if (!providerRoles.includes(ctx.user.role)) throw new TRPCError({ code: "FORBIDDEN" });
      const db = await requireDb();
      await db.insert(clientGapFlags).values({
        clientId: input.clientId,
        flaggedByProviderId: ctx.user.id,
        gapCategory: input.gapCategory,
        severity: input.severity,
        notes: input.notes,
      });
      return { success: true };
    }),
});

// ─── Notifications Router ───────────────────────────────────────────────────
const notificationsRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const db = await requireDb();
    const [prefs] = await db.select().from(notificationPreferences)
      .where(eq(notificationPreferences.userId, ctx.user.id)).limit(1);
    return prefs || null;
  }),
  upsert: protectedProcedure
    .input(z.object({
      appointmentReminders: z.boolean().optional(),
      medicationReminders: z.boolean().optional(),
      goalReminders: z.boolean().optional(),
      dailyCoachMessage: z.boolean().optional(),
      weeklyProgressSummary: z.boolean().optional(),
      devotionals: z.boolean().optional(),
      motivationalMessages: z.boolean().optional(),
      crisisAlerts: z.boolean().optional(),
      reminderLeadMinutes: z.number().optional(),
      quietHoursStart: z.string().optional(),
      quietHoursEnd: z.string().optional(),
      alertsEnabled: z.boolean().optional(),
      messagesEnabled: z.boolean().optional(),
      referralsEnabled: z.boolean().optional(),
      appointmentsEnabled: z.boolean().optional(),
      remindersEnabled: z.boolean().optional(),
      frequency: z.enum(['immediate', 'hourly_digest', 'daily_digest']).optional(),
      quietHoursEnabled: z.boolean().optional(),
      soundEnabled: z.boolean().optional(),
      browserNotificationsEnabled: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const [existing] = await db.select().from(notificationPreferences)
        .where(eq(notificationPreferences.userId, ctx.user.id)).limit(1);
      if (existing) {
        await db.update(notificationPreferences).set(input)
          .where(eq(notificationPreferences.userId, ctx.user.id));
      } else {
        await db.insert(notificationPreferences).values({ userId: ctx.user.id, ...input });
      }
      return { success: true };
    }),
});


// ─── Provider Messages Router ─────────────────────────────────────────────────
const providerMessagesRouter = router({
  send: protectedProcedure
    .input(z.object({
      toClientId: z.number(),
      subject: z.string().optional(),
      content: z.string().min(1),
      messageType: z.enum(["message", "task", "reminder", "appointment", "goal", "alert"]).default("message"),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "case_manager" && ctx.user.role !== "org_admin" && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Only providers can send messages" });
      }
      const db = await requireDb();
      await db.insert(providerMessages).values({
        fromProviderId: ctx.user.id,
        toClientId: input.toClientId,
        organizationId: 1,
        subject: input.subject,
        content: input.content,
        messageType: input.messageType,
      });
      return { success: true };
    }),
  getMyMessages: protectedProcedure.query(async ({ ctx }) => {
    const db = await requireDb();
    return db.select().from(providerMessages)
      .where(eq(providerMessages.toClientId, ctx.user.id))
      .orderBy(desc(providerMessages.createdAt)).limit(20);
  }),
  markRead: protectedProcedure
    .input(z.object({ messageId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const [msg] = await db.select().from(providerMessages).where(eq(providerMessages.id, input.messageId)).limit(1);
      if (!msg || msg.toClientId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN" });
      await db.update(providerMessages).set({ read: true, readAt: new Date() }).where(eq(providerMessages.id, input.messageId));
      return { success: true };
    }),
  getSent: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "case_manager" && ctx.user.role !== "org_admin" && ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN" });
    }
    const db = await requireDb();
    return db.select().from(providerMessages)
      .where(eq(providerMessages.fromProviderId, ctx.user.id))
      .orderBy(desc(providerMessages.createdAt)).limit(50);
  }),
});

// ─── Multi-Agency Collaboration Router ──────────────────────────────────────
const multiAgencyRouter = router({
  // Enroll a client in an agency (requires provider role)
  enrollClient: protectedProcedure
    .input(z.object({
      clientId: z.number(),
      organizationId: z.number(),
      agencyRole: z.enum(["primary_ecm","behavioral_health","housing","probation","employment","substance_use","peer_support","legal","other"]),
      consentGiven: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role === "user") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await requireDb();
      // Check if already enrolled
      const [existing] = await db.select().from(clientAgencyEnrollments)
        .where(and(eq(clientAgencyEnrollments.clientId, input.clientId), eq(clientAgencyEnrollments.organizationId, input.organizationId))).limit(1);
      if (existing) {
        await db.update(clientAgencyEnrollments).set({ agencyRole: input.agencyRole, consentGiven: input.consentGiven, isActive: true, consentDate: input.consentGiven ? new Date() : undefined })
          .where(eq(clientAgencyEnrollments.id, existing.id));
      } else {
        await db.insert(clientAgencyEnrollments).values({ clientId: input.clientId, organizationId: input.organizationId, enrolledByProviderId: ctx.user.id, agencyRole: input.agencyRole, consentGiven: input.consentGiven, consentDate: input.consentGiven ? new Date() : undefined });
      }
      return { success: true };
    }),

  // Get all agencies enrolled on a client
  getClientEnrollments: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role === "user") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await requireDb();
      return db.select().from(clientAgencyEnrollments)
        .where(and(eq(clientAgencyEnrollments.clientId, input.clientId), eq(clientAgencyEnrollments.isActive, true)));
    }),

  // Get the full shared client record (profile + goals + milestones + gap flags + notes)
  getSharedClientRecord: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role === "user") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await requireDb();
      const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, input.clientId)).limit(1);
      const [user] = await db.select().from(users).where(eq(users.id, input.clientId)).limit(1);
      const [assessment] = await db.select().from(needsAssessments).where(eq(needsAssessments.userId, input.clientId)).limit(1);
      const clientGoals = await db.select().from(goals).where(eq(goals.userId, input.clientId)).orderBy(desc(goals.createdAt));
      const clientMilestones = await db.select().from(progressMilestones).where(eq(progressMilestones.clientId, input.clientId));
      const gapFlags = await db.select().from(clientGapFlags)
        .where(and(eq(clientGapFlags.clientId, input.clientId), eq(clientGapFlags.resolved, false)))
        .orderBy(desc(clientGapFlags.createdAt));
      const notes = await db.select().from(sharedProgressNotes)
        .where(eq(sharedProgressNotes.clientId, input.clientId))
        .orderBy(desc(sharedProgressNotes.createdAt)).limit(50);
      const enrollments = await db.select().from(clientAgencyEnrollments)
        .where(and(eq(clientAgencyEnrollments.clientId, input.clientId), eq(clientAgencyEnrollments.isActive, true)));
      return { user, profile, assessment, goals: clientGoals, milestones: clientMilestones, gapFlags, notes, enrollments };
    }),

  // Post a cross-agency note
  addNote: protectedProcedure
    .input(z.object({
      clientId: z.number(),
      noteType: z.enum(["progress","concern","milestone","handoff","referral","crisis","housing_update","employment_update","recovery_update","legal_update","medical_update","general"]),
      content: z.string().min(1),
      visibility: z.enum(["all_agencies","own_agency"]).default("all_agencies"),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role === "user") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await requireDb();
      await db.insert(sharedProgressNotes).values({
        clientId: input.clientId,
        authorProviderId: ctx.user.id,
        authorOrganizationId: 1,
        noteType: input.noteType,
        content: input.content,
        visibility: input.visibility,
      });
      return { success: true };
    }),

  // Flag a client gap
  flagGap: protectedProcedure
    .input(z.object({
      clientId: z.number(),
      gapCategory: z.enum(["no_housing_plan","chronically_homeless","no_mental_health_provider","no_substance_use_treatment","no_government_id","no_income","no_health_insurance","no_employment_plan","no_ecm_provider","probation_compliance_risk","no_peer_support","no_transportation","no_legal_representation","no_education_plan","family_reunification_needed","medication_not_managed","crisis_risk","other"]),
      severity: z.enum(["low","medium","high","critical"]).default("medium"),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role === "user") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await requireDb();
      await db.insert(clientGapFlags).values({ clientId: input.clientId, flaggedByProviderId: ctx.user.id, gapCategory: input.gapCategory, severity: input.severity, notes: input.notes });
      return { success: true };
    }),

  // Resolve a gap flag
  resolveGap: protectedProcedure
    .input(z.object({ flagId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role === "user") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await requireDb();
      await db.update(clientGapFlags).set({ resolved: true, resolvedAt: new Date(), resolvedByProviderId: ctx.user.id }).where(eq(clientGapFlags.id, input.flagId));
      return { success: true };
    }),
});

// ─── Resource Recommendation Engine Router ────────────────────────────────────
const recommendationsRouter = router({
  // Analyze a client's profile and return resource recommendations based on gap flags
  getForClient: protectedProcedure
    .input(z.object({ clientId: z.number(), county: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role === "user") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await requireDb();
      const [assessment] = await db.select().from(needsAssessments).where(eq(needsAssessments.userId, input.clientId)).limit(1);
      const gapFlags = await db.select().from(clientGapFlags)
        .where(and(eq(clientGapFlags.clientId, input.clientId), eq(clientGapFlags.resolved, false)));
      // Build category filter from gaps + assessment
      // Note: assessment fields store human-readable phrases from the intake form
      const neededCategories: string[] = [];
      if (assessment) {
        // Housing: matches "Outdoors or in a vehicle", "Emergency shelter", "Transitional housing", "Couch surfing", "Unstable housing"
        const housingLower = (assessment.housingStatus || "").toLowerCase();
        if (housingLower.includes("outdoor") || housingLower.includes("vehicle") || housingLower.includes("shelter") ||
            housingLower.includes("transitional") || housingLower.includes("couch") || housingLower.includes("unstable") ||
            housingLower.includes("homeless") || housingLower.includes("unhoused")) {
          neededCategories.push("Emergency Shelter", "Housing Programs", "Transitional Housing", "STPH");
        }
        // Recovery: inRecovery boolean or substanceUseHistory text
        if (assessment.inRecovery || (assessment.substanceUseHistory && assessment.substanceUseHistory.toLowerCase() !== "no" && assessment.substanceUseHistory.toLowerCase() !== "none")) {
          neededCategories.push("Recovery Housing", "Substance Use Treatment", "AA/NA");
        }
        // Mental health: anything other than "No issues" / "Stable" / empty
        const mhLower = (assessment.mentalHealthStatus || "").toLowerCase();
        if (mhLower && !mhLower.includes("no issue") && !mhLower.includes("stable") && !mhLower.includes("none")) {
          neededCategories.push("Mental Health", "Counseling");
        }
        // ID / benefits
        if (!assessment.hasGovernmentId) neededCategories.push("Benefits");
        if (!assessment.hasHealthInsurance) neededCategories.push("Medical");
        // Employment: "Not currently working", "Unemployed", "Looking for work"
        const empLower = (assessment.employmentStatus || "").toLowerCase();
        if (empLower.includes("not") || empLower.includes("unemployed") || empLower.includes("looking") || empLower.includes("no job")) {
          neededCategories.push("Employment");
        }
        if (assessment.onProbationOrParole) neededCategories.push("Reentry", "Legal Aid");
        if (assessment.isVeteran) neededCategories.push("Veterans");
        if (assessment.domesticViolenceHistory) neededCategories.push("Domestic Violence");
        if (!assessment.hasCaseWorker) neededCategories.push("ECM", "Case Management");
        // Food / basic needs — always include if housing is unstable
        if (housingLower.includes("outdoor") || housingLower.includes("vehicle") || housingLower.includes("shelter")) {
          neededCategories.push("Food Bank");
        }
      }
      for (const flag of gapFlags) {
        if (flag.gapCategory === "chronically_homeless") neededCategories.push("Emergency Shelter", "Permanent Supportive Housing", "STPH");
        if (flag.gapCategory === "no_mental_health_provider") neededCategories.push("Mental Health", "Behavioral Health");
        if (flag.gapCategory === "no_substance_use_treatment") neededCategories.push("Substance Use Treatment", "Recovery Housing", "MAT");
        if (flag.gapCategory === "no_ecm_provider") neededCategories.push("ECM", "Enhanced Care Management");
        if (flag.gapCategory === "no_peer_support") neededCategories.push("Peer Support");
        if (flag.gapCategory === "no_employment_plan") neededCategories.push("Employment", "Job Training");
        if (flag.gapCategory === "probation_compliance_risk") neededCategories.push("Reentry", "Legal Aid");
      }
      // Fetch matching county resources
      const allResources = await db.select().from(countyResources)
        .where(and(
          eq(countyResources.isActive, true),
          input.county ? eq(countyResources.county, input.county as any) : undefined
        ))
        .orderBy(countyResources.name).limit(200);
      // Score and filter
      const scored = allResources.map(r => {
        const score = neededCategories.filter(c => r.category.toLowerCase().includes(c.toLowerCase()) || (r.subCategory || "").toLowerCase().includes(c.toLowerCase())).length;
        return { ...r, score };
      }).filter(r => r.score > 0).sort((a, b) => b.score - a.score).slice(0, 15);
      return { recommendations: scored, gapFlags, neededCategories: Array.from(new Set(neededCategories)) };
    }),

  // Send a resource as a reminder to the client's inbox
  sendReminder: protectedProcedure
    .input(z.object({
      clientId: z.number(),
      resourceName: z.string(),
      resourceCategory: z.string(),
      resourcePhone: z.string().optional(),
      resourceAddress: z.string().optional(),
      resourceWebsite: z.string().optional(),
      resourceCounty: z.string().optional(),
      reason: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role === "user") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await requireDb();
      // Save recommendation record
      await db.insert(resourceRecommendations).values({
        clientId: input.clientId,
        recommendedByProviderId: ctx.user.id,
        resourceName: input.resourceName,
        resourceCategory: input.resourceCategory,
        resourcePhone: input.resourcePhone,
        resourceAddress: input.resourceAddress,
        resourceWebsite: input.resourceWebsite,
        resourceCounty: input.resourceCounty,
        reason: input.reason,
        sentToClientInbox: true,
        status: "sent",
      });
      // Also send as a provider message to client inbox
      await db.insert(providerMessages).values({
        fromProviderId: ctx.user.id,
        toClientId: input.clientId,
        organizationId: 1,
        subject: `Resource Recommendation: ${input.resourceName}`,
        content: `Your care team recommends this resource for you:\n\n**${input.resourceName}** (${input.resourceCategory})\n${input.resourceAddress ? `📍 ${input.resourceAddress}` : ""}\n${input.resourcePhone ? `📞 ${input.resourcePhone}` : ""}\n${input.resourceWebsite ? `🌐 ${input.resourceWebsite}` : ""}\n\n${input.reason ? `Why this matters: ${input.reason}` : ""}`,
        messageType: "reminder",
      });
      return { success: true };
    }),

  // Get recommendations sent to a client (client-side inbox view)
  getMyRecommendations: protectedProcedure.query(async ({ ctx }) => {
    const db = await requireDb();
    return db.select().from(resourceRecommendations)
      .where(eq(resourceRecommendations.clientId, ctx.user.id))
      .orderBy(desc(resourceRecommendations.createdAt)).limit(20);
  }),
});

// ─── County Resources Router ──────────────────────────────────────────────────
const countyResourcesRouter = router({
  list: publicProcedure
    .input(z.object({
      county: z.string().optional(),
      category: z.string().optional(),
      search: z.string().optional(),
      ecmEligible: z.boolean().optional(),
      mediCalAccepted: z.boolean().optional(),
      freeService: z.boolean().optional(),
    }))
    .query(async ({ input }) => {
      const db = await requireDb();
      let query = db.select().from(countyResources).where(eq(countyResources.isActive, true));
      const results = await db.select().from(countyResources)
        .where(and(
          eq(countyResources.isActive, true),
          input.county ? eq(countyResources.county, input.county as any) : undefined,
          input.ecmEligible ? eq(countyResources.ecmEligible, true) : undefined,
          input.mediCalAccepted ? eq(countyResources.mediCalAccepted, true) : undefined,
          input.freeService ? eq(countyResources.freeService, true) : undefined,
        ))
        .orderBy(countyResources.county, countyResources.category, countyResources.name)
        .limit(500);
      if (input.search) {
        const s = input.search.toLowerCase();
        return results.filter(r => r.name.toLowerCase().includes(s) || (r.description || "").toLowerCase().includes(s) || r.category.toLowerCase().includes(s) || r.city?.toLowerCase().includes(s));
      }
      if (input.category) {
        const c = input.category.toLowerCase();
        return results.filter(r => r.category.toLowerCase().includes(c) || (r.subCategory || "").toLowerCase().includes(c));
      }
      return results;
    }),

  getByCounty: publicProcedure
    .input(z.object({ county: z.enum(["butte","shasta","trinity","tehama","humboldt","siskiyou","other"]) }))
    .query(async ({ input }) => {
      const db = await requireDb();
      return db.select().from(countyResources)
        .where(and(eq(countyResources.county, input.county), eq(countyResources.isActive, true)))
        .orderBy(countyResources.category, countyResources.name);
    }),

  getCategories: publicProcedure.query(async () => {
    const db = await requireDb();
    const all = await db.select({ category: countyResources.category }).from(countyResources).where(eq(countyResources.isActive, true));
    return Array.from(new Set(all.map(r => r.category))).sort();
  }),
});

// ─── Community Events Router ────────────────────────────────────────────────
const communityEventsRouter = router({
  list: publicProcedure
    .input(z.object({
      county: z.string().optional(),
      eventType: z.string().optional(),
      needsCategory: z.string().optional(),
      date: z.string().optional(), // YYYY-MM-DD, defaults to today
      upcoming: z.boolean().optional(), // next 7 days
      featured: z.boolean().optional(),
      verifiedOnly: z.boolean().optional(), // only verified_today/this_week/this_month
      limit: z.number().min(1).max(100).optional(),
    }))
    .query(async ({ input }) => {
      const db = await requireDb();
      const today = new Date().toISOString().split("T")[0];
      const targetDate = input.date || today;
      let query = db.select().from(communityEvents).$dynamic();
      const conditions = [eq(communityEvents.isActive, true)];
      if (input.county) conditions.push(eq(communityEvents.county, input.county as any));
      if (input.featured) conditions.push(eq(communityEvents.isFeatured, true));
      if (input.verifiedOnly) conditions.push(inArray(communityEvents.confidenceLevel, ["verified_today","verified_this_week","verified_this_month"] as any));
      if (input.upcoming) {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextWeekStr = nextWeek.toISOString().split("T")[0];
        conditions.push(gte(communityEvents.eventDate, today));
        conditions.push(lte(communityEvents.eventDate, nextWeekStr));
      } else if (input.date) {
        conditions.push(eq(communityEvents.eventDate, input.date));
      }
      const events = await db.select().from(communityEvents)
        .where(and(...conditions))
        .orderBy(communityEvents.eventDate, communityEvents.startTime)
        .limit(input.limit || 50);
      // Filter by needsCategory if provided
      if (input.needsCategory) {
        return events.filter(e => (e.needsCategories || "").toLowerCase().includes(input.needsCategory!.toLowerCase()));
      }
      return events;
    }),

  getPersonalized: protectedProcedure
    .input(z.object({ date: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const db = await requireDb();
      const today = new Date().toISOString().split("T")[0];
      const targetDate = input.date || today;
      // Get user's service areas
      const serviceAreas = await db.select().from(userServiceAreas).where(eq(userServiceAreas.userId, ctx.user.id));
      const counties = serviceAreas.length > 0 ? serviceAreas.map(sa => sa.county) : [];
      // Get user's assessment for context
      const [assessment] = await db.select().from(needsAssessments).where(eq(needsAssessments.userId, ctx.user.id)).limit(1);
      // Determine priority needs from assessment
      const priorityNeeds: string[] = [];
      if (assessment) {
        const housingLower = (assessment.housingStatus || "").toLowerCase();
        if (housingLower.includes("outdoor") || housingLower.includes("vehicle") || housingLower.includes("shelter") || housingLower.includes("homeless")) {
          priorityNeeds.push("housing", "meals", "shelter", "medical", "laundry", "shower");
        }
        if (assessment.onProbationOrParole) priorityNeeds.push("probation", "reentry", "legal");
        const empLower = (assessment.employmentStatus || "").toLowerCase();
        if (empLower.includes("not") || empLower.includes("unemployed") || empLower.includes("looking")) {
          priorityNeeds.push("employment", "jobs", "training");
        }
        if (assessment.inRecovery) priorityNeeds.push("recovery", "support_group");
      }
      // Fetch events for user's counties (or all if no service areas set)
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const nextWeekStr = nextWeek.toISOString().split("T")[0];
      let events = await db.select().from(communityEvents)
        .where(and(
          eq(communityEvents.isActive, true),
          gte(communityEvents.eventDate, today),
          lte(communityEvents.eventDate, nextWeekStr)
        ))
        .orderBy(communityEvents.eventDate, communityEvents.startTime)
        .limit(100);
      // Filter to user's counties if set
      if (counties.length > 0) {
        events = events.filter(e => counties.includes(e.county as any));
      }
      // Score by priority needs
      const scored = events.map(e => {
        const cats = (e.needsCategories || "").toLowerCase();
        const score = priorityNeeds.filter(n => cats.includes(n)).length;
        return { ...e, relevanceScore: score };
      }).sort((a, b) => b.relevanceScore - a.relevanceScore);
      return { events: scored, priorityNeeds, serviceAreas };
    }),

  submit: protectedProcedure
    .input(z.object({
      title: z.string().min(3).max(255),
      description: z.string().optional(),
      eventType: z.string(),
      eventDate: z.string(),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      county: z.string(),
      city: z.string().optional(),
      address: z.string().optional(),
      locationName: z.string().optional(),
      organizationName: z.string().optional(),
      organizationPhone: z.string().optional(),
      needsCategories: z.string().optional(),
      spotsAvailable: z.number().optional(),
      requiresRegistration: z.boolean().optional(),
      registrationUrl: z.string().optional(),
      isRecurring: z.boolean().optional(),
      recurringPattern: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role === "user") throw new TRPCError({ code: "FORBIDDEN", message: "Providers only" });
      const db = await requireDb();
      const [event] = await db.insert(communityEvents).values({
        title: input.title,
        description: input.description,
        eventType: input.eventType as any,
        eventDate: input.eventDate,
        startTime: input.startTime,
        endTime: input.endTime,
        county: input.county as any,
        city: input.city,
        address: input.address,
        locationName: input.locationName,
        organizationName: input.organizationName,
        organizationPhone: input.organizationPhone,
        needsCategories: input.needsCategories,
        spotsAvailable: input.spotsAvailable,
        requiresRegistration: input.requiresRegistration || false,
        registrationUrl: input.registrationUrl,
        isRecurring: input.isRecurring || false,
        recurringPattern: input.recurringPattern,
        submittedBy: ctx.user.id,
        sourceType: "provider_submission",
        confidenceLevel: "pending",
      }).$returningId();
      return { success: true, eventId: event.id };
    }),

  verify: protectedProcedure
    .input(z.object({ eventId: z.number(), confidenceLevel: z.enum(["verified_today","verified_this_week","verified_this_month","pending","unverified"]) }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role === "user") throw new TRPCError({ code: "FORBIDDEN" });
      const db = await requireDb();
      await db.update(communityEvents).set({
        confidenceLevel: input.confidenceLevel,
        verifiedAt: new Date(),
        verifiedBy: ctx.user.id,
      }).where(eq(communityEvents.id, input.eventId));
      return { success: true };
    }),

  engage: protectedProcedure
    .input(z.object({ eventId: z.number(), action: z.enum(["viewed","saved","attending","attended","dismissed"]) }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      await db.insert(eventEngagement).values({ userId: ctx.user.id, eventId: input.eventId, action: input.action });
      return { success: true };
    }),

  getMyEngagements: protectedProcedure.query(async ({ ctx }) => {
    const db = await requireDb();
    return db.select().from(eventEngagement).where(eq(eventEngagement.userId, ctx.user.id)).orderBy(desc(eventEngagement.createdAt)).limit(100);
  }),
});

// ─── Service Areas Router ─────────────────────────────────────────────────────
const serviceAreasRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const db = await requireDb();
    return db.select().from(userServiceAreas).where(eq(userServiceAreas.userId, ctx.user.id));
  }),
  set: protectedProcedure
    .input(z.object({
      areas: z.array(z.object({
        county: z.string(),
        areaType: z.enum(["residence","probation","services","temporary_housing","willing_to_travel"]),
        isPrimary: z.boolean().optional(),
      }))
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      // Replace all service areas for this user
      await db.delete(userServiceAreas).where(eq(userServiceAreas.userId, ctx.user.id));
      if (input.areas.length > 0) {
        await db.insert(userServiceAreas).values(
          input.areas.map(a => ({ userId: ctx.user.id, county: a.county as any, areaType: a.areaType, isPrimary: a.isPrimary || false }))
        );
      }
      return { success: true };
    }),
});

// ─── Daily Feed Router ────────────────────────────────────────────────────────
const dailyFeedRouter = router({
  get: protectedProcedure
    .input(z.object({ date: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const db = await requireDb();
      const today = new Date().toISOString().split("T")[0];
      const targetDate = input.date || today;
      // Get user's service areas
      const serviceAreas = await db.select().from(userServiceAreas).where(eq(userServiceAreas.userId, ctx.user.id));
      const counties = serviceAreas.map(sa => sa.county);
      // Get assessment context
      const [assessment] = await db.select().from(needsAssessments).where(eq(needsAssessments.userId, ctx.user.id)).limit(1);
      // Determine user context profile
      const isHomeless = assessment ? (() => {
        const h = (assessment.housingStatus || "").toLowerCase();
        return h.includes("outdoor") || h.includes("vehicle") || h.includes("shelter") || h.includes("homeless");
      })() : false;
      const isReentry = assessment?.onProbationOrParole || false;
      const isJobSeeking = assessment ? (() => {
        const e = (assessment.employmentStatus || "").toLowerCase();
        return e.includes("not") || e.includes("unemployed") || e.includes("looking");
      })() : false;
      const inRecovery = assessment?.inRecovery || false;
      // Fetch today's community events for user's counties
      const eventConditions = [eq(communityEvents.isActive, true), eq(communityEvents.eventDate, targetDate)];
      if (counties.length > 0) {
        // Filter to user's counties (client-side since drizzle OR is complex)
      }
      const todayEvents = await db.select().from(communityEvents)
        .where(and(...eventConditions))
        .orderBy(communityEvents.startTime)
        .limit(30);
      const filteredEvents = counties.length > 0 ? todayEvents.filter(e => counties.includes(e.county as any)) : todayEvents;
      // Fetch today's appointments
      const startOfDay = new Date(targetDate + "T00:00:00");
      const endOfDay = new Date(targetDate + "T23:59:59");
      const todayAppointments = await db.select().from(appointments)
        .where(and(eq(appointments.userId, ctx.user.id), gte(appointments.appointmentDate, startOfDay), lte(appointments.appointmentDate, endOfDay)))
        .orderBy(appointments.appointmentDate);
      // Fetch unread provider messages
      const unreadMessages = await db.select().from(providerMessages)
        .where(and(eq(providerMessages.toClientId, ctx.user.id), eq(providerMessages.read, false)))
        .orderBy(desc(providerMessages.createdAt)).limit(10);
      // Fetch active goals
      const activeGoals = await db.select().from(goals)
        .where(and(eq(goals.userId, ctx.user.id), eq(goals.status, "in_progress")))
        .orderBy(goals.priority).limit(5);
      // Score and categorize events
      const scoredEvents = filteredEvents.map(e => {
        const cats = (e.needsCategories || "").toLowerCase();
        let priority = 5;
        if (isHomeless && (cats.includes("meal") || cats.includes("shelter") || cats.includes("food"))) priority = 1;
        else if (isHomeless && (cats.includes("medical") || cats.includes("shower") || cats.includes("laundry"))) priority = 2;
        else if (isReentry && (cats.includes("probation") || cats.includes("legal") || cats.includes("reentry"))) priority = 1;
        else if (isJobSeeking && (cats.includes("job") || cats.includes("employment") || cats.includes("hiring"))) priority = 2;
        else if (inRecovery && (cats.includes("recovery") || cats.includes("support_group") || cats.includes("aa") || cats.includes("na"))) priority = 2;
        return { ...e, feedPriority: priority };
      }).sort((a, b) => a.feedPriority - b.feedPriority);
      return {
        date: targetDate,
        context: { isHomeless, isReentry, isJobSeeking, inRecovery },
        serviceAreas,
        events: scoredEvents,
        appointments: todayAppointments,
        providerMessages: unreadMessages,
        activeGoals,
      };
    }),
});

// ─── Favorites Router ───────────────────────────────────────────────────────
const favoritesRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await requireDb();
    const favs = await db.select().from(userFavorites).where(eq(userFavorites.userId, ctx.user.id)).orderBy(desc(userFavorites.createdAt));
    // Enrich with resource data
    const enriched = await Promise.all(favs.map(async (f) => {
      const [res] = await db.select().from(countyResources).where(eq(countyResources.id, f.resourceId)).limit(1);
      return { ...f, resource: res || null };
    }));
    return enriched;
  }),
  add: protectedProcedure.input(z.object({ resourceId: z.number(), resourceName: z.string().optional() })).mutation(async ({ ctx, input }) => {
    const db = await requireDb();
    const [existing] = await db.select().from(userFavorites).where(and(eq(userFavorites.userId, ctx.user.id), eq(userFavorites.resourceId, input.resourceId))).limit(1);
    if (!existing) {
      await db.insert(userFavorites).values({ userId: ctx.user.id, resourceId: input.resourceId, resourceName: input.resourceName || null });
    }
    return { success: true };
  }),
  remove: protectedProcedure.input(z.object({ resourceId: z.number() })).mutation(async ({ ctx, input }) => {
    const db = await requireDb();
    await db.delete(userFavorites).where(and(eq(userFavorites.userId, ctx.user.id), eq(userFavorites.resourceId, input.resourceId)));
    return { success: true };
  }),
  recentlyViewed: protectedProcedure.query(async ({ ctx }) => {
    const db = await requireDb();
    const items = await db.select().from(recentlyViewed).where(eq(recentlyViewed.userId, ctx.user.id)).orderBy(desc(recentlyViewed.viewedAt)).limit(20);
    const enriched = await Promise.all(items.map(async (item) => {
      const [res] = await db.select().from(countyResources).where(eq(countyResources.id, item.resourceId)).limit(1);
      return { ...item, resource: res || null };
    }));
    return enriched;
  }),
  trackView: protectedProcedure.input(z.object({ resourceId: z.number(), resourceName: z.string().optional() })).mutation(async ({ ctx, input }) => {
    const db = await requireDb();
    // Upsert — delete old entry then insert fresh
    await db.delete(recentlyViewed).where(and(eq(recentlyViewed.userId, ctx.user.id), eq(recentlyViewed.resourceId, input.resourceId)));
    await db.insert(recentlyViewed).values({ userId: ctx.user.id, resourceId: input.resourceId, resourceName: input.resourceName || null });
    return { success: true };
  }),
});

// ─── Documents Router ─────────────────────────────────────────────────────────
const documentsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await requireDb();
    return db.select().from(userDocuments).where(eq(userDocuments.userId, ctx.user.id)).orderBy(desc(userDocuments.createdAt));
  }),
  upload: protectedProcedure.input(z.object({
    fileName: z.string(),
    fileKey: z.string(),
    fileUrl: z.string(),
    fileSize: z.number().optional(),
    mimeType: z.string().optional(),
    documentType: z.enum(['government_id','insurance_card','court_document','consent_form','recovery_plan','medical_record','employment_doc','housing_doc','probation_doc','other']).optional(),
    description: z.string().optional(),
    isSharedWithProviders: z.boolean().optional(),
  })).mutation(async ({ ctx, input }) => {
    const db = await requireDb();
    const [doc] = await db.insert(userDocuments).values({
      userId: ctx.user.id,
      uploadedByUserId: ctx.user.id,
      fileName: input.fileName,
      fileKey: input.fileKey,
      fileUrl: input.fileUrl,
      fileSize: input.fileSize || null,
      mimeType: input.mimeType || null,
      documentType: input.documentType || 'other',
      description: input.description || null,
      isSharedWithProviders: input.isSharedWithProviders || false,
    }).$returningId();
    return { success: true, id: doc.id };
  }),
  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ ctx, input }) => {
    const db = await requireDb();
    await db.delete(userDocuments).where(and(eq(userDocuments.id, input.id), eq(userDocuments.userId, ctx.user.id)));
    return { success: true };
  }),
  updateSharing: protectedProcedure.input(z.object({ id: z.number(), isSharedWithProviders: z.boolean() })).mutation(async ({ ctx, input }) => {
    const db = await requireDb();
    await db.update(userDocuments).set({ isSharedWithProviders: input.isSharedWithProviders }).where(and(eq(userDocuments.id, input.id), eq(userDocuments.userId, ctx.user.id)));
    return { success: true };
  }),
  // Provider: get client documents (shared only)
  getClientDocs: protectedProcedure.input(z.object({ clientId: z.number() })).query(async ({ ctx, input }) => {
    const db = await requireDb();
    const providerRoles = ['case_manager','ecm_worker','probation_officer','counselor','org_admin','admin'];
    if (!providerRoles.includes((ctx.user as any).role)) throw new TRPCError({ code: 'FORBIDDEN' });
    return db.select().from(userDocuments).where(and(eq(userDocuments.userId, input.clientId), eq(userDocuments.isSharedWithProviders, true))).orderBy(desc(userDocuments.createdAt));
  }),
});

// ─── Messaging Router ─────────────────────────────────────────────────────────
const messagingRouter = router({
  getThreads: protectedProcedure.query(async ({ ctx }) => {
    const db = await requireDb();
    const participations = await db.select().from(threadParticipants).where(eq(threadParticipants.userId, ctx.user.id));
    if (participations.length === 0) return [];
    const threadIds = participations.map(p => p.threadId);
    const threads = await db.select().from(messageThreads).where(inArray(messageThreads.id, threadIds)).orderBy(desc(messageThreads.lastMessageAt));
    // Get last message and unread count for each thread
    const enriched = await Promise.all(threads.map(async (t) => {
      const [lastMsg] = await db.select().from(threadMessages).where(eq(threadMessages.threadId, t.id)).orderBy(desc(threadMessages.createdAt)).limit(1);
      const myParticipation = participations.find(p => p.threadId === t.id);
      const unreadCount = myParticipation?.lastReadAt
        ? (await db.select().from(threadMessages).where(and(eq(threadMessages.threadId, t.id), gte(threadMessages.createdAt, myParticipation.lastReadAt)))).length
        : (await db.select().from(threadMessages).where(eq(threadMessages.threadId, t.id))).length;
      const participants = await db.select({ userId: threadParticipants.userId }).from(threadParticipants).where(eq(threadParticipants.threadId, t.id));
      const participantUsers = await Promise.all(participants.map(async (p) => {
        const [u] = await db.select({ id: users.id, name: users.name, role: users.role }).from(users).where(eq(users.id, p.userId)).limit(1);
        return u;
      }));
      return { ...t, lastMessage: lastMsg || null, unreadCount, participants: participantUsers.filter(Boolean) };
    }));
    return enriched;
  }),
  getMessages: protectedProcedure.input(z.object({ threadId: z.number() })).query(async ({ ctx, input }) => {
    const db = await requireDb();
    // Verify participation
    const [participation] = await db.select().from(threadParticipants).where(and(eq(threadParticipants.threadId, input.threadId), eq(threadParticipants.userId, ctx.user.id))).limit(1);
    if (!participation) throw new TRPCError({ code: 'FORBIDDEN' });
    const messages = await db.select().from(threadMessages).where(eq(threadMessages.threadId, input.threadId)).orderBy(threadMessages.createdAt);
    const enriched = await Promise.all(messages.map(async (m) => {
      const [sender] = await db.select({ id: users.id, name: users.name, role: users.role }).from(users).where(eq(users.id, m.senderUserId)).limit(1);
      return { ...m, sender: sender || null };
    }));
    // Mark as read
    await db.update(threadParticipants).set({ lastReadAt: new Date() }).where(and(eq(threadParticipants.threadId, input.threadId), eq(threadParticipants.userId, ctx.user.id)));
    return enriched;
  }),
  createThread: protectedProcedure.input(z.object({
    subject: z.string().optional(),
    participantIds: z.array(z.number()),
    initialMessage: z.string(),
  })).mutation(async ({ ctx, input }) => {
    const db = await requireDb();
    const [thread] = await db.insert(messageThreads).values({ subject: input.subject || null, createdByUserId: ctx.user.id }).$returningId();
    const allParticipants = Array.from(new Set([ctx.user.id, ...input.participantIds]));
    await db.insert(threadParticipants).values(allParticipants.map(uid => ({ threadId: thread.id, userId: uid })));
    await db.insert(threadMessages).values({ threadId: thread.id, senderUserId: ctx.user.id, content: input.initialMessage });
    return { success: true, threadId: thread.id };
  }),
  sendMessage: protectedProcedure.input(z.object({ threadId: z.number(), content: z.string() })).mutation(async ({ ctx, input }) => {
    const db = await requireDb();
    const [participation] = await db.select().from(threadParticipants).where(and(eq(threadParticipants.threadId, input.threadId), eq(threadParticipants.userId, ctx.user.id))).limit(1);
    if (!participation) throw new TRPCError({ code: 'FORBIDDEN' });
    await db.insert(threadMessages).values({ threadId: input.threadId, senderUserId: ctx.user.id, content: input.content });
    await db.update(messageThreads).set({ lastMessageAt: new Date() }).where(eq(messageThreads.id, input.threadId));
    return { success: true };
  }),
  getProviderClients: protectedProcedure.query(async ({ ctx }) => {
    const db = await requireDb();
    const providerRoles = ['case_manager','ecm_worker','probation_officer','counselor','org_admin','admin'];
    if (!providerRoles.includes((ctx.user as any).role)) return [];
    const assignments = await db.select().from(caseManagerAssignments).where(eq(caseManagerAssignments.caseManagerId, ctx.user.id));
    if (assignments.length === 0) return [];
    const clientIds = assignments.map(a => a.clientId);
    const clients = await db.select({ id: users.id, name: users.name, role: users.role }).from(users).where(inArray(users.id, clientIds));
    return clients;
  }),
});

// ─── Admin Router ─────────────────────────────────────────────────────────────
const adminRouter = router({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    if ((ctx.user as any).role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
    const db = await requireDb();
    const [{ count: totalUsers }] = await db.select({ count: db.$count(users) }).from(users);
    const [{ count: totalGoals }] = await db.select({ count: db.$count(goals) }).from(goals);
    const [{ count: totalResources }] = await db.select({ count: db.$count(countyResources) }).from(countyResources);
    const [{ count: totalEvents }] = await db.select({ count: db.$count(communityEvents) }).from(communityEvents);
    const [{ count: totalAppointments }] = await db.select({ count: db.$count(appointments) }).from(appointments);
    const [{ count: totalMessages }] = await db.select({ count: db.$count(providerMessages) }).from(providerMessages);
    const recentUsers = await db.select({ id: users.id, name: users.name, role: users.role, createdAt: users.createdAt }).from(users).orderBy(desc(users.createdAt)).limit(10);
    // Role breakdown
    const allUsers = await db.select({ role: users.role }).from(users);
    const roleBreakdown: Record<string, number> = {};
    allUsers.forEach((u: any) => { roleBreakdown[u.role] = (roleBreakdown[u.role] || 0) + 1; });
    // Top resource categories
    const allResources = await db.select({ category: countyResources.category }).from(countyResources);
    const categoryBreakdown: Record<string, number> = {};
    allResources.forEach((r: any) => { categoryBreakdown[r.category] = (categoryBreakdown[r.category] || 0) + 1; });
    const topCategories = Object.entries(categoryBreakdown).sort((a,b) => b[1]-a[1]).slice(0,8).map(([name,count]) => ({ name, count }));
    // County breakdown
    const countyBreakdown: Record<string, number> = {};
    allResources.forEach((r: any) => { if (r.category) countyBreakdown[r.category] = (countyBreakdown[r.category] || 0) + 1; });
    // Recent signups per day (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentSignups = await db.select({ createdAt: users.createdAt }).from(users).where(gte(users.createdAt, sevenDaysAgo));
    const signupsByDay: Record<string, number> = {};
    recentSignups.forEach((u: any) => {
      const day = new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      signupsByDay[day] = (signupsByDay[day] || 0) + 1;
    });
    return { totalUsers, totalGoals, totalResources, totalEvents, totalAppointments, totalMessages, recentUsers, roleBreakdown, topCategories, signupsByDay };
  }),
  setUserRole: protectedProcedure.input(z.object({ userId: z.number(), role: z.enum(['user','case_manager','ecm_worker','probation_officer','counselor','org_admin','admin']) })).mutation(async ({ ctx, input }) => {
    if ((ctx.user as any).role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
    const db = await requireDb();
    await db.update(users).set({ role: input.role }).where(eq(users.id, input.userId));
    return { success: true };
  }),
  getAllUsers: protectedProcedure.query(async ({ ctx }) => {
    if ((ctx.user as any).role !== 'admin') throw new TRPCError({ code: 'FORBIDDEN' });
    const db = await requireDb();
    return db.select({ id: users.id, name: users.name, role: users.role, createdAt: users.createdAt }).from(users).orderBy(desc(users.createdAt));
  }),
  verifyEvent: protectedProcedure.input(z.object({ eventId: z.number() })).mutation(async ({ ctx, input }) => {
    const adminRoles = ['admin','org_admin'];
    if (!adminRoles.includes((ctx.user as any).role)) throw new TRPCError({ code: 'FORBIDDEN' });
    const db = await requireDb();
    await db.update(communityEvents).set({ verifiedAt: new Date(), confidenceLevel: 'verified_today' }).where(eq(communityEvents.id, input.eventId));
    return { success: true };
  }),
  getPendingEvents: protectedProcedure.query(async ({ ctx }) => {
    const adminRoles = ['admin','org_admin'];
    if (!adminRoles.includes((ctx.user as any).role)) throw new TRPCError({ code: 'FORBIDDEN' });
    const db = await requireDb();
    return db.select().from(communityEvents).where(eq(communityEvents.confidenceLevel, 'pending')).orderBy(desc(communityEvents.createdAt));
  }),
});

// ─── Search Router ────────────────────────────────────────────────────────────
const searchRouter = router({
  // Advanced search across clients, resources, providers
  search: publicProcedure
    .input(z.object({
      query: z.string().optional(),
      type: z.enum(['clients', 'resources', 'providers', 'events']).optional(),
      filters: z.record(z.string(), z.any()).optional(),
    }))
    .query(async ({ input }) => {
      const db = await requireDb();
      const results: any[] = [];
      
      if (!input.type || input.type === 'resources') {
        const resourceResults = await db.select().from(resources)
          .where(input.query ? like(resources.name, `%${input.query}%`) : undefined)
          .limit(20);
        results.push(...resourceResults.map((r: any) => ({ type: 'resource', ...r })));
      }
      
      if (!input.type || input.type === 'providers') {
        const providers = await db.select().from(users)
          .where(input.query ? like(users.name, `%${input.query}%`) : undefined)
          .limit(20);
        results.push(...providers.map(p => ({ type: 'provider', ...p })));
      }
      
      return results;
    }),

  // Save search
  saveSearch: protectedProcedure
    .input(z.object({
      name: z.string(),
      searchType: z.enum(['clients', 'resources', 'providers', 'events']),
      filters: z.record(z.string(), z.any()),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const result = await db.insert(savedSearches).values({
        userId: ctx.user.id,
        ...input,
      });
      return { success: true };
    }),
});

// ─── Provider Permissions Router ──────────────────────────────────────────────
const permissionsRouter = router({
  getClientPermissions: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await requireDb();
      const perms = await db.select().from(providerPermissions)
        .where(eq(providerPermissions.clientId, input.clientId));
      return perms;
    }),

  grantPermission: protectedProcedure
    .input(z.object({
      clientId: z.number(),
      providerId: z.number(),
      providerRole: z.string(),
      permissions: z.array(z.string()),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      await db.insert(providerPermissions).values({
        clientId: input.clientId,
        providerId: input.providerId,
        providerRole: input.providerRole,
        permissions: JSON.stringify(input.permissions),
        consentGiven: true,
        consentDate: new Date(),
      });
      return { success: true };
    }),

  revokePermission: protectedProcedure
    .input(z.object({ permissionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      await db.delete(providerPermissions).where(eq(providerPermissions.id, input.permissionId));
      return { success: true };
    }),
});

// ─── Multi-Agency Outcomes & ROI Router ───────────────────────────────────────
const multiAgencyOutcomesRouter = router({
  getOutcomes: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await requireDb();
      const outcomes = await db.select().from(multiAgencyOutcomes)
        .where(eq(multiAgencyOutcomes.clientId, input.clientId)).limit(1);
      return outcomes?.[0] || null;
    }),

  updateOutcomes: protectedProcedure
    .input(z.object({
      clientId: z.number(),
      housingStability: z.boolean().optional(),
      treatmentEngagement: z.boolean().optional(),
      medicationAdherence: z.boolean().optional(),
      appointmentAttendance: z.number().optional(),
      employmentPlacement: z.boolean().optional(),
      familyReunification: z.boolean().optional(),
      edUtilizationReduction: z.number().optional(),
      recidivismReduction: z.boolean().optional(),
      costSavings: z.number().optional(),
      grantPerformanceMetrics: z.record(z.string(), z.any()).optional(),
      qualityMetrics: z.record(z.string(), z.any()).optional(),
      programOutcomes: z.record(z.string(), z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const { clientId, ...data } = input;
      const existing = await db.select().from(multiAgencyOutcomes)
        .where(eq(multiAgencyOutcomes.clientId, clientId)).limit(1);
      const existingRecord = existing?.[0];

      if (existingRecord) {
        await db.update(multiAgencyOutcomes)
          .set({
            ...data,
            grantPerformanceMetrics: data.grantPerformanceMetrics ? JSON.stringify(data.grantPerformanceMetrics) : undefined,
            qualityMetrics: data.qualityMetrics ? JSON.stringify(data.qualityMetrics) : undefined,
            programOutcomes: data.programOutcomes ? JSON.stringify(data.programOutcomes) : undefined,
          })
          .where(eq(multiAgencyOutcomes.clientId, clientId));
      } else {
        await db.insert(multiAgencyOutcomes).values({
          clientId,
          ...data,
          grantPerformanceMetrics: data.grantPerformanceMetrics ? JSON.stringify(data.grantPerformanceMetrics) : undefined,
          qualityMetrics: data.qualityMetrics ? JSON.stringify(data.qualityMetrics) : undefined,
          programOutcomes: data.programOutcomes ? JSON.stringify(data.programOutcomes) : undefined,
        });
      }
      return { success: true };
    }),

  getDashboard: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await requireDb();
      const outcomes = await db.select().from(multiAgencyOutcomes);
      return {
        totalClients: outcomes.length,
        housingStability: outcomes.filter(o => o.housingStability).length,
        treatmentEngagement: outcomes.filter(o => o.treatmentEngagement).length,
        medicationAdherence: outcomes.filter(o => o.medicationAdherence).length,
        employmentPlacement: outcomes.filter(o => o.employmentPlacement).length,
        familyReunification: outcomes.filter(o => o.familyReunification).length,
        recidivismReduction: outcomes.filter(o => o.recidivismReduction).length,
        totalCostSavings: outcomes.reduce((sum, o) => sum + (o.costSavings || 0), 0),
        avgAppointmentAttendance: outcomes.length > 0 
          ? Math.round(outcomes.reduce((sum, o) => sum + (o.appointmentAttendance || 0), 0) / outcomes.length)
          : 0,
      };
    }),
});

// ─── Client Profile Data Router (Insurance, Medications, Employment, etc.) ────
const clientProfileRouter = router({
  getInsurance: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await requireDb();
      const [insurance] = await db.select().from(clientInsurance)
        .where(eq(clientInsurance.clientUserId, input.clientId)).limit(1);
      return insurance || null;
    }),

  getMedications: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await requireDb();
      const meds = await db.select().from(clientMedications)
        .where(eq(clientMedications.clientUserId, input.clientId));
      return meds;
    }),

  getEmployment: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await requireDb();
      const [employment] = await db.select().from(clientEmployment)
        .where(eq(clientEmployment.clientUserId, input.clientId)).limit(1);
      return employment || null;
    }),

  getHousing: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await requireDb();
      const [housing] = await db.select().from(clientHousing)
        .where(eq(clientHousing.clientUserId, input.clientId)).limit(1);
      return housing || null;
    }),

  getCourt: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await requireDb();
      const [court] = await db.select().from(clientCourt)
        .where(eq(clientCourt.clientUserId, input.clientId)).limit(1);
      return court || null;
    }),

  getBehavioralHealth: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await requireDb();
      const [health] = await db.select().from(clientBehavioralHealth)
        .where(eq(clientBehavioralHealth.clientUserId, input.clientId)).limit(1);
      return health || null;
    }),

  getRecovery: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await requireDb();
      const [recovery] = await db.select().from(clientRecovery)
        .where(eq(clientRecovery.clientUserId, input.clientId)).limit(1);
      return recovery || null;
    }),

  updateInsurance: protectedProcedure
    .input(z.object({
      clientId: z.number(),
      insuranceProvider: z.enum(["partnership_healthplan", "medi_cal", "medicare", "anthem_blue_cross", "kaiser_permanente", "aetna", "blue_shield", "cigna", "united_healthcare", "self_pay", "uninsured", "other"]),
      insuranceId: z.string().optional(),
      groupNumber: z.string().optional(),
      authorizationNumber: z.string().optional(),
      renewalDate: z.string().optional(),
      coverageStatus: z.enum(["active", "inactive", "pending", "terminated"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      const { clientId, ...data } = input;
      const [existing] = await db.select().from(clientInsurance)
        .where(eq(clientInsurance.clientUserId, clientId)).limit(1);

      if (existing) {
        await db.update(clientInsurance).set(data).where(eq(clientInsurance.clientUserId, clientId));
      } else {
        await db.insert(clientInsurance).values({ clientUserId: clientId, ...data });
      }
      return { success: true };
    }),
});

// ─── Automated Referral Matching Router ──────────────────────────────────────
const matchingRouter = router({
  getMatchedProviders: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await requireDb();
      
      // Get client profile and assessment
      const [client] = await db.select().from(users)
        .where(eq(users.id, input.clientId)).limit(1);
      if (!client) throw new TRPCError({ code: "NOT_FOUND", message: "Client not found" });
      
      const [assessment] = await db.select().from(needsAssessments)
        .where(eq(needsAssessments.userId, input.clientId)).limit(1);
      if (!assessment) throw new TRPCError({ code: "NOT_FOUND", message: "Assessment not found" });
      
      const [profile] = await db.select().from(userProfiles)
        .where(eq(userProfiles.userId, input.clientId)).limit(1);
      
      // Extract client needs from assessment
      const clientNeeds: string[] = [];
      if (assessment.housingStatus) clientNeeds.push('housing');
      if (assessment.employmentStatus) clientNeeds.push('employment');
      if (assessment.hasHealthInsurance) clientNeeds.push('healthcare');
      if (assessment.hasLegalIssues) clientNeeds.push('legal');
      if (assessment.substanceUseHistory) clientNeeds.push('recovery');
      if (assessment.mentalHealthStatus) clientNeeds.push('mental_health');
      if (assessment.hasChildren) clientNeeds.push('family_services');
      
      const clientProfile: ClientProfile = {
        id: String(input.clientId),
        specialties: clientNeeds,
        languages: [profile?.preferredLanguage || 'English'],
        insurance: profile?.insuranceType || 'uninsured',
        location: profile?.county || 'Unknown',
        needs: clientNeeds,
        riskLevel: assessment.onProbationOrParole ? 'high' : 'low',
        roiStatus: 'valid',
      };
      
      // Get all providers
      const allProviders = await db.select().from(users)
        .where(eq(users.role, 'case_manager'));
      
      const providerProfiles: ProviderProfile[] = allProviders.map(p => ({
        id: String(p.id),
        name: p.name || 'Unknown Provider',
        specialties: ['case_management'],
        languages: ['English'],
        acceptedInsurance: ['All'],
        location: 'Unknown',
        availability: 'available' as const,
        roiAccepted: true,
        rating: 4.5,
        successRate: 0.85,
      }));
      
      const matches = getTopProviderMatches(clientProfile, providerProfiles, 5);
      return matches;
    }),

  getMatchedResources: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await requireDb();
      
      // Get client profile and assessment
      const [assessment] = await db.select().from(needsAssessments)
        .where(eq(needsAssessments.userId, input.clientId)).limit(1);
      if (!assessment) throw new TRPCError({ code: "NOT_FOUND", message: "Assessment not found" });
      
      const [profile] = await db.select().from(userProfiles)
        .where(eq(userProfiles.userId, input.clientId)).limit(1);
      
      // Extract client needs from assessment
      const clientNeeds: string[] = [];
      if (assessment.housingStatus) clientNeeds.push('housing');
      if (assessment.employmentStatus) clientNeeds.push('employment');
      if (assessment.hasHealthInsurance) clientNeeds.push('healthcare');
      if (assessment.hasLegalIssues) clientNeeds.push('legal');
      if (assessment.substanceUseHistory) clientNeeds.push('recovery');
      if (assessment.mentalHealthStatus) clientNeeds.push('mental_health');
      if (assessment.hasChildren) clientNeeds.push('family_services');
      
      const clientProfile: ClientProfile = {
        id: String(input.clientId),
        specialties: clientNeeds,
        languages: [profile?.preferredLanguage || 'English'],
        insurance: profile?.insuranceType || 'uninsured',
        location: profile?.county || 'Unknown',
        needs: clientNeeds,
        riskLevel: assessment.onProbationOrParole ? 'high' : 'low',
        roiStatus: 'valid',
      };
      
      // Get all resources
      const allResources = await db.select().from(resources);
      
      const resourceProfiles: ResourceProfile[] = allResources.map(r => ({
        id: String(r.id),
        name: r.name || 'Unknown Resource',
        category: r.category || 'General',
        specialties: [r.category || 'General'],
        location: 'Unknown',
        availability: 'available' as const,
        rating: 4.5,
      }));
      
      const matches = getTopResourceMatches(clientProfile, resourceProfiles, 5);
      return matches;
    }),

  getReferralSuggestions: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await requireDb();
      
      // Get client profile and assessment
      const [assessment] = await db.select().from(needsAssessments)
        .where(eq(needsAssessments.userId, input.clientId)).limit(1);
      if (!assessment) throw new TRPCError({ code: "NOT_FOUND", message: "Assessment not found" });
      
      const [profile] = await db.select().from(userProfiles)
        .where(eq(userProfiles.userId, input.clientId)).limit(1);
      
      // Extract client needs from assessment
      const clientNeeds: string[] = [];
      if (assessment.housingStatus) clientNeeds.push('housing');
      if (assessment.employmentStatus) clientNeeds.push('employment');
      if (assessment.hasHealthInsurance) clientNeeds.push('healthcare');
      if (assessment.hasLegalIssues) clientNeeds.push('legal');
      if (assessment.substanceUseHistory) clientNeeds.push('recovery');
      if (assessment.mentalHealthStatus) clientNeeds.push('mental_health');
      if (assessment.hasChildren) clientNeeds.push('family_services');
      
      const clientProfile: ClientProfile = {
        id: String(input.clientId),
        specialties: clientNeeds,
        languages: [profile?.preferredLanguage || 'English'],
        insurance: profile?.insuranceType || 'uninsured',
        location: profile?.county || 'Unknown',
        needs: clientNeeds,
        riskLevel: assessment.onProbationOrParole ? 'high' : 'low',
        roiStatus: 'valid',
      };
      
      // Get all providers and resources
      const allProviders = await db.select().from(users)
        .where(eq(users.role, 'case_manager'));
      const allResources = await db.select().from(resources);
      
      const providerProfiles: ProviderProfile[] = allProviders.map(p => ({
        id: String(p.id),
        name: p.name || 'Unknown Provider',
        specialties: ['case_management'],
        languages: ['English'],
        acceptedInsurance: ['All'],
        location: 'Unknown',
        availability: 'available' as const,
        roiAccepted: true,
        rating: 4.5,
        successRate: 0.85,
      }));
      
      const resourceProfiles: ResourceProfile[] = allResources.map(r => ({
        id: String(r.id),
        name: r.name || 'Unknown Resource',
        category: r.category || 'General',
        specialties: [r.category || 'General'],
        location: 'Unknown',
        availability: 'available' as const,
        rating: 4.5,
      }));
      
      const matches = getReferralSuggestions(clientProfile, providerProfiles, resourceProfiles, 10);
      return matches.map(match => ({
        ...match,
        explanation: getMatchExplanation(match),
      }));
    }),
});

// ─── 360° Client Timeline Router ──────────────────────────────────────────────
const timelineRouter = router({
  getClientTimeline: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await requireDb();
      // Check permissions
      const [permission] = await db.select().from(providerPermissions)
        .where(and(
          eq(providerPermissions.providerId, ctx.user.id),
          eq(providerPermissions.clientId, input.clientId)
        )).limit(1);
      if (!permission?.consentGiven) {
        throw new TRPCError({ code: "FORBIDDEN", message: "No access to this client's timeline" });
      }
      const events = await db.select().from(clientTimeline)
        .where(eq(clientTimeline.clientUserId, input.clientId))
        .orderBy(desc(clientTimeline.eventDate));
      return events;
    }),

  addTimelineEvent: protectedProcedure
    .input(z.object({
      clientId: z.number(),
      eventType: z.enum(["appointment", "case_note", "milestone", "medication_change", "court_date", "referral", "housing_update", "employment_progress", "message", "assessment", "goal_update", "recovery_milestone", "provider_note"]),
      title: z.string(),
      description: z.string().optional(),
      eventDate: z.date(),
      visibleToRoles: z.array(z.string()).optional(),
      metadata: z.record(z.string(), z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await requireDb();
      await db.insert(clientTimeline).values({
        clientUserId: input.clientId,
        eventType: input.eventType,
        title: input.title,
        description: input.description,
        eventDate: input.eventDate,
        createdByUserId: ctx.user.id,
        createdByRole: ctx.user.role,
        visibleToRoles: JSON.stringify(input.visibleToRoles || []),
        metadata: JSON.stringify(input.metadata || {}),
        consentGiven: true,
      });
      return { success: true };
    }),
});


// ─── App Router ───────────────────────────────────────────────────────────────
export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  profile: profileRouter,
  assessment: assessmentRouter,
  coach: coachRouter,
  goals: goalsRouter,
  appointments: appointmentsRouter,
  resources: resourcesRouter,
  counselor: counselorRouter,
  dashboard: dashboardRouter,
  milestones: milestonesRouter,
  caseManager: caseManagerRouter,
  notifications: notificationsRouter,
  providerMessages: providerMessagesRouter,
  multiAgency: multiAgencyRouter,
  recommendations: recommendationsRouter,
  countyResources: countyResourcesRouter,
  communityEvents: communityEventsRouter,
  serviceAreas: serviceAreasRouter,
  dailyFeed: dailyFeedRouter,
  favorites: favoritesRouter,
  documents: documentsRouter,
  messaging: messagingRouter,
  admin: adminRouter,
  timeline: timelineRouter,
  permissions: permissionsRouter,
  outcomes: multiAgencyOutcomesRouter,
  clientProfile: clientProfileRouter,
  search: searchRouter,
  matching: matchingRouter,
  jobBoard: jobBoardRouter,
  postAssessmentRecommendations: postAssessmentRecommendationsRouter,
  liveFeed: liveFeedRouter,
  biDirectionalReferrals: biDirectionalReferralsRouter,
  achievements: achievementsRouter,
  certificateVerification: certificateVerificationRouter,
});

export type AppRouter = typeof appRouter;
