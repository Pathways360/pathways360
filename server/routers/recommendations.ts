import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { getDb } from "../db";
import { eq, desc, and } from "drizzle-orm";
import { recommendations, feedItems } from "../../drizzle/schema";

/**
 * Post-Assessment Recommendations Router
 * 
 * Features:
 * - Get personalized recommendations based on assessment data
 * - Accept/decline recommendations
 * - Convert accepted recommendations to feed items
 * - Track recommendation status
 */

export const recommendationsRouter = router({
  // Get recommendations for current user
  getRecommendations: protectedProcedure
    .input(z.object({
      type: z.enum(['job', 'resource', 'service', 'event', 'support_group', 'meal', 'medical', 'counseling']).optional(),
      status: z.enum(['pending', 'accepted', 'declined', 'completed']).optional(),
      limit: z.number().default(20),
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      let query: any = db.select()
        .from(recommendations)
        .where(eq(recommendations.userId, ctx.user.id));

      if (input.type) {
        query = query.where(eq(recommendations.type, input.type as any));
      }
      if (input.status) {
        query = query.where(eq(recommendations.status, input.status as any));
      }

      return await query
        .orderBy(desc(recommendations.priority), desc(recommendations.createdAt))
        .limit(input.limit);
    }),

  // Get pending recommendations (for dashboard)
  getPendingRecommendations: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];

      return await db.select()
        .from(recommendations)
        .where(and(
          eq(recommendations.userId, ctx.user.id),
          eq(recommendations.status, 'pending' as any)
        ))
        .orderBy(desc(recommendations.priority), desc(recommendations.createdAt))
        .limit(10);
    }),

  // Accept a recommendation (converts to feed item/referral)
  acceptRecommendation: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: recommendationId }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

      const rec = await db.select()
        .from(recommendations)
        .where(eq(recommendations.id, recommendationId))
        .limit(1);

      if (rec.length === 0) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }

      // Update recommendation status
      await db.update(recommendations)
        .set({ status: 'accepted' as any, acceptedDate: new Date() })
        .where(eq(recommendations.id, recommendationId));

      // Create feed item
      await db.insert(feedItems).values({
        userId: ctx.user.id,
        type: rec[0].type as any,
        title: rec[0].title,
        description: rec[0].description,
        content: rec[0].reason,
        sourceType: 'system',
        sourceId: recommendationId,
        priority: rec[0].priority as any,
      });

      return { success: true };
    }),

  // Decline a recommendation
  declineRecommendation: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: recommendationId }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

      await db.update(recommendations)
        .set({ status: 'declined' as any })
        .where(eq(recommendations.id, recommendationId));

      return { success: true };
    }),

  // Get recommendation count by status
  getRecommendationStats: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return { pending: 0, accepted: 0, declined: 0, completed: 0 };

      const recs = await db.select()
        .from(recommendations)
        .where(eq(recommendations.userId, ctx.user.id));

      return {
        pending: recs.filter((r: any) => r.status === 'pending').length,
        accepted: recs.filter((r: any) => r.status === 'accepted').length,
        declined: recs.filter((r: any) => r.status === 'declined').length,
        completed: recs.filter((r: any) => r.status === 'completed').length,
      };
    }),

  // Mark recommendation as completed
  completeRecommendation: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: recommendationId }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

      await db.update(recommendations)
        .set({ status: 'completed' as any, completedDate: new Date() })
        .where(eq(recommendations.id, recommendationId));

      return { success: true };
    }),
});
