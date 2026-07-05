import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { getDb } from "../db";
import { eq, desc } from "drizzle-orm";
import { feedItems, feedInteractions } from "../../drizzle/schema";

/**
 * Live Feed Router
 * 
 * Features:
 * - Get user's daily live feed (jobs, resources, services, events, meals, medical, counseling)
 * - Mark items as read
 * - Record interactions (viewed, clicked, applied, accepted, declined, saved, shared)
 * - Filter by type
 */

export const liveFeedRouter = router({
  // Get user's feed items with pagination and filtering
  getFeedItems: protectedProcedure
    .input(z.object({
      limit: z.number().default(50),
      offset: z.number().default(0),
      type: z.enum(['job', 'resource', 'service', 'event', 'support_group', 'meal', 'medical', 'counseling', 'referral', 'milestone']).optional(),
      unreadOnly: z.boolean().default(false),
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      let query: any = db.select()
        .from(feedItems)
        .where(eq(feedItems.userId, ctx.user.id));

      if (input.type) {
        query = query.where(eq(feedItems.type, input.type as any));
      }

      if (input.unreadOnly) {
        query = query.where(eq(feedItems.isRead, false));
      }

      return await query
        .orderBy(desc(feedItems.createdAt))
        .limit(input.limit)
        .offset(input.offset);
    }),

  // Get unread count
  getUnreadCount: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return 0;

      const result = await db.select()
        .from(feedItems)
        .where(eq(feedItems.userId, ctx.user.id));

      return result.filter((item: any) => !item.isRead).length;
    }),

  // Mark feed item as read
  markAsRead: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input: feedItemId }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

      await db.update(feedItems)
        .set({ isRead: true, readAt: new Date() })
        .where(eq(feedItems.id, feedItemId));

      return { success: true };
    }),

  // Mark all items as read
  markAllAsRead: protectedProcedure
    .mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

      await db.update(feedItems)
        .set({ isRead: true, readAt: new Date() })
        .where(eq(feedItems.userId, ctx.user.id));

      return { success: true };
    }),

  // Record interaction with feed item (viewed, clicked, applied, etc.)
  recordInteraction: protectedProcedure
    .input(z.object({
      feedItemId: z.number(),
      interactionType: z.enum(['viewed', 'clicked', 'applied', 'accepted', 'declined', 'saved', 'shared']),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

      await db.insert(feedInteractions).values({
        userId: ctx.user.id,
        feedItemId: input.feedItemId,
        interactionType: input.interactionType,
      });

      // Also mark as read if clicked/applied/accepted
      if (['clicked', 'applied', 'accepted'].includes(input.interactionType)) {
        await db.update(feedItems)
          .set({ isRead: true, readAt: new Date() })
          .where(eq(feedItems.id, input.feedItemId));
      }

      return { success: true };
    }),

  // Get feed statistics
  getFeedStats: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return { total: 0, unread: 0, byType: {} };

      const items = await db.select()
        .from(feedItems)
        .where(eq(feedItems.userId, ctx.user.id));

      const byType: Record<string, number> = {};
      items.forEach((item: any) => {
        byType[item.type] = (byType[item.type] || 0) + 1;
      });

      return {
        total: items.length,
        unread: items.filter((item: any) => !item.isRead).length,
        byType,
      };
    }),

  // Get feed items by type (for dashboard sections)
  getFeedItemsByType: protectedProcedure
    .input(z.enum(['job', 'resource', 'service', 'event', 'support_group', 'meal', 'medical', 'counseling', 'referral', 'milestone']))
    .query(async ({ ctx, input: type }) => {
      const db = await getDb();
      if (!db) return [];

      return await db.select()
        .from(feedItems)
        .where(eq(feedItems.type, type as any))
        .orderBy(desc(feedItems.createdAt))
        .limit(20);
    }),
});
