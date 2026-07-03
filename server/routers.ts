import { COOKIE_NAME } from "@shared/const";
import { createHeartbeatJob, deleteHeartbeatJob } from "./_core/heartbeat";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { getDb } from "./db";
import { invokeLLM } from "./_core/llm";
import {
  users, userProfiles, needsAssessments, coachSettings,
  goals, appointments, chatMessages, resources, organizations,
  caseManagerAssignments, dailyCoachMessages, milestones,
  notificationPreferences, providerMessages
} from "../drizzle/schema";
import { eq, and, desc, gte, lte, or, like } from "drizzle-orm";

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
});

export type AppRouter = typeof appRouter;
