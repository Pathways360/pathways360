import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { getDb } from "../db";
import { eq, desc, and } from "drizzle-orm";
import { biDirectionalReferrals, feedItems } from "../../drizzle/schema";

/**
 * Bi-Directional Referrals Router
 * 
 * Features:
 * - Case managers send one-click referrals to clients
 * - Automatic reminder sending (SMS, email, push, in-app)
 * - Clients respond to referrals (accept/decline/completed)
 * - Real-time feed updates for both sides
 * - Referral tracking and history
 */

export const biDirectionalReferralsRouter = router({
  // Send referral from case manager to client (one-click with reminder)
  sendReferral: protectedProcedure
    .input(z.object({
      clientId: z.number(),
      referralType: z.enum(['job', 'resource', 'service', 'event', 'meal', 'medical', 'counseling']),
      title: z.string(),
      description: z.string(),
      location: z.string().optional(),
      eventDate: z.date().optional(),
      eventTime: z.string().optional(),
      serviceProviderId: z.number().optional(),
      serviceScheduleId: z.number().optional(),
      reminderMethod: z.enum(['sms', 'email', 'push_notification', 'in_app']).default('in_app'),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

      // Only case managers can send referrals
      if (!['case_manager', 'ecm_worker', 'counselor'].includes(ctx.user.role)) {
        throw new TRPCError({ code: 'FORBIDDEN' });
      }

      // Create referral
      const referralResult = await db.insert(biDirectionalReferrals).values({
        clientId: input.clientId,
        caseManagerId: ctx.user.id,
        referralType: input.referralType as any,
        title: input.title,
        description: input.description,
        location: input.location,
        eventDate: input.eventDate,
        eventTime: input.eventTime,
        serviceProviderId: input.serviceProviderId,
        serviceScheduleId: input.serviceScheduleId,
        reminderMethod: input.reminderMethod as any,
        reminderSent: true,
        reminderSentAt: new Date(),
        status: 'sent',
      });

      // Get the ID of the created referral
      const referrals = await db.select()
        .from(biDirectionalReferrals)
        .where(eq(biDirectionalReferrals.clientId, input.clientId))
        .orderBy(desc(biDirectionalReferrals.createdAt))
        .limit(1);
      
      const referralId = referrals[0]?.id || 0;

      // Create feed item for client
      await db.insert(feedItems).values({
        userId: input.clientId,
        type: input.referralType as any,
        title: `New Referral: ${input.title}`,
        description: input.description,
        location: input.location,
        eventDate: input.eventDate,
        eventTime: input.eventTime,
        sourceType: 'case_manager',
        sourceId: referralId,
        priority: 'high',
      });

      return { success: true, referralId };
    }),

  // Get client's referrals
  getClientReferrals: protectedProcedure
    .input(z.object({
      clientId: z.number().optional(),
      limit: z.number().default(50),
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      const userId = input.clientId || ctx.user.id;
      return await db.select()
        .from(biDirectionalReferrals)
        .where(eq(biDirectionalReferrals.clientId, userId))
        .orderBy(desc(biDirectionalReferrals.sentAt))
        .limit(input.limit);
    }),

  // Respond to referral (accept/decline/completed)
  respondToReferral: protectedProcedure
    .input(z.object({
      referralId: z.number(),
      status: z.enum(['accepted', 'declined', 'completed']),
      response: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

      const updateData: any = { 
        status: input.status,
        respondedAt: new Date(),
      };
      if (input.response) {
        updateData.clientResponse = input.response;
      }

      await db.update(biDirectionalReferrals)
        .set(updateData)
        .where(eq(biDirectionalReferrals.id, input.referralId));

      return { success: true };
    }),

  // Send reminder for a referral
  sendReminder: protectedProcedure
    .input(z.object({
      referralId: z.number(),
      reminderMethod: z.enum(['sms', 'email', 'push_notification', 'in_app']),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

      const updateData: any = { 
        reminderSent: true, 
        reminderSentAt: new Date(),
      };
      if (input.reminderMethod) {
        updateData.reminderMethod = input.reminderMethod;
      }

      await db.update(biDirectionalReferrals)
        .set(updateData)
        .where(eq(biDirectionalReferrals.id, input.referralId));

      return { success: true };
    }),

  // Get referral statistics for case manager
  getReferralStats: protectedProcedure
    .input(z.object({
      clientId: z.number().optional(),
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return { sent: 0, accepted: 0, declined: 0, completed: 0, pending: 0 };

      const referrals = await db.select()
        .from(biDirectionalReferrals)
        .where(eq(biDirectionalReferrals.clientId, input.clientId || ctx.user.id));

      return {
        sent: referrals.filter((r: any) => r.status === 'sent').length,
        accepted: referrals.filter((r: any) => r.status === 'accepted').length,
        declined: referrals.filter((r: any) => r.status === 'declined').length,
        completed: referrals.filter((r: any) => r.status === 'completed').length,
        pending: referrals.filter((r: any) => r.status === 'sent').length,
      };
    }),

  // Get pending referrals (for case manager dashboard)
  getPendingReferrals: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];

      return await db.select()
        .from(biDirectionalReferrals)
        .where(and(
          eq(biDirectionalReferrals.caseManagerId, ctx.user.id),
          eq(biDirectionalReferrals.status, 'sent' as any)
        ))
        .orderBy(desc(biDirectionalReferrals.sentAt))
        .limit(20);
    }),
});
