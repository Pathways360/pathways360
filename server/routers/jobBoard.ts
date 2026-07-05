import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";
import { getDb } from "../db";
import { eq, desc, and } from "drizzle-orm";
import { jobPostings, jobApplications, serviceProviders, serviceSchedules } from "../../drizzle/schema";

/**
 * Job Board Router
 * 
 * Features:
 * - Browse active job postings (full-time, part-time, temp, seasonal, contract)
 * - Search and filter by county, job type, location
 * - Apply for jobs (protected)
 * - View temporary agencies by county
 * - Get service provider details with schedules
 * - Track job applications
 */

export const jobBoardRouter = router({
  // Get active job postings with optional filters
  getJobs: publicProcedure
    .input(z.object({
      county: z.string().optional(),
      jobType: z.enum(['full_time', 'part_time', 'temporary', 'seasonal', 'contract']).optional(),
      searchTerm: z.string().optional(),
      limit: z.number().default(20),
      offset: z.number().default(0),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      let query: any = db.select().from(jobPostings).where(eq(jobPostings.isActive, true));
      
      if (input.county) {
        query = query.where(eq(jobPostings.county, input.county as any));
      }
      if (input.jobType) {
        query = query.where(eq(jobPostings.jobType, input.jobType as any));
      }

      return await query
        .orderBy(desc(jobPostings.postedDate))
        .limit(input.limit)
        .offset(input.offset);
    }),

  // Get single job posting details
  getJobById: publicProcedure
    .input(z.number())
    .query(async ({ input: jobId }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db.select().from(jobPostings).where(eq(jobPostings.id, jobId)).limit(1);
      return result.length > 0 ? result[0] : null;
    }),

  // Apply for a job (protected - requires authentication)
  applyForJob: protectedProcedure
    .input(z.object({
      jobPostingId: z.number(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });

      // Check if already applied
      const existing = await db.select()
        .from(jobApplications)
        .where(and(
          eq(jobApplications.userId, ctx.user.id),
          eq(jobApplications.jobPostingId, input.jobPostingId)
        ))
        .limit(1);

      if (existing.length > 0) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Already applied to this job' });
      }

      // Create application
      await db.insert(jobApplications).values({
        userId: ctx.user.id,
        jobPostingId: input.jobPostingId,
        status: 'applied',
        notes: input.notes,
      });

      return { success: true };
    }),

  // Get user's job applications
  getMyApplications: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];

      return await db.select()
        .from(jobApplications)
        .where(eq(jobApplications.userId, ctx.user.id))
        .orderBy(desc(jobApplications.appliedDate));
    }),

  // Get temporary agencies by county (includes staffing agencies, day labor, etc.)
  getTempAgencies: publicProcedure
    .input(z.object({
      county: z.string().optional(),
      limit: z.number().default(50),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      let query: any = db.select()
        .from(serviceProviders)
        .where(eq(serviceProviders.isActive, true));

      if (input.county) {
        query = query.where(eq(serviceProviders.county, input.county as any));
      }

      return await query
        .orderBy(desc(serviceProviders.createdAt))
        .limit(input.limit);
    }),

  // Get service provider details with schedule (for temp agencies, staffing companies, etc.)
  getServiceProviderDetails: publicProcedure
    .input(z.number())
    .query(async ({ input: providerId }) => {
      const db = await getDb();
      if (!db) return null;

      const provider = await db.select()
        .from(serviceProviders)
        .where(eq(serviceProviders.id, providerId))
        .limit(1);

      if (provider.length === 0) return null;

      const schedules = await db.select()
        .from(serviceSchedules)
        .where(eq(serviceSchedules.serviceProviderId, providerId));

      return {
        ...provider[0],
        schedules,
      };
    }),

  // Get jobs by county (for dashboard filtering)
  getJobsByCounty: publicProcedure
    .input(z.string())
    .query(async ({ input: county }) => {
      const db = await getDb();
      if (!db) return [];

      return await db.select()
        .from(jobPostings)
        .where(and(
          eq(jobPostings.isActive, true),
          eq(jobPostings.county, county as any)
        ))
        .orderBy(desc(jobPostings.postedDate))
        .limit(50);
    }),

  // Get job statistics for dashboard
  getJobStats: publicProcedure
    .input(z.object({
      county: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { total: 0, byType: {}, recentCount: 0 };

      let query: any = db.select().from(jobPostings).where(eq(jobPostings.isActive, true));
      
      if (input.county) {
        query = query.where(eq(jobPostings.county, input.county as any));
      }

      const jobs = await query;
      
      // Count by type
      const byType: Record<string, number> = {
        full_time: 0,
        part_time: 0,
        temporary: 0,
        seasonal: 0,
        contract: 0,
      };

      jobs.forEach((job: any) => {
        if (job.jobType in byType) {
          byType[job.jobType]++;
        }
      });

      // Count recent (last 7 days)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const recentCount = jobs.filter((job: any) => job.postedDate > sevenDaysAgo).length;

      return {
        total: jobs.length,
        byType,
        recentCount,
      };
    }),
});
