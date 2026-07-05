import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  checkAchievementEligibility,
  createAchievement,
  getClientAchievements,
  getEligibleAchievements,
  createCertificate,
  getCertificate,
  getClientCertificates,
  updateCertificateViewCount,
  updateCertificateDownloadCount,
  updateCertificatePrintCount,
  getCertificateTemplate,
  createAchievementBadge,
  getClientBadges,
} from "../db";
import { generateCertificatePDF } from "../_core/certificateGenerator";

export const achievementsRouter = router({
  // Check if client is eligible for achievements based on goal completion
  checkEligibility: protectedProcedure.input(z.object({ clientId: z.number() })).query(async ({ input }) => {
    const eligible = await checkAchievementEligibility(input.clientId);
    return eligible;
  }),

  // Get all achievements for a client
  getClientAchievements: protectedProcedure.input(z.object({ clientId: z.number() })).query(async ({ input }) => {
    const achievements = await getClientAchievements(input.clientId);
    return achievements;
  }),

  // Create a new achievement
  createAchievement: protectedProcedure
    .input(
      z.object({
        clientId: z.number(),
        achievementType: z.enum([
          "goal_completion",
          "milestone_reached",
          "sobriety_milestone",
          "employment_secured",
          "housing_secured",
          "family_reunification",
          "court_compliance",
          "education_completed",
          "recovery_program_completed",
          "custom",
        ]),
        title: z.string(),
        description: z.string().optional(),
        completionPercentage: z.number().min(0).max(100),
        goalId: z.number().optional(),
        milestoneId: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Only case managers and admins can create achievements
      if (!["case_manager", "admin"].includes(ctx.user.role)) {
        throw new Error("Unauthorized");
      }

      const result = await createAchievement(
        input.clientId,
        input.achievementType,
        input.title,
        input.description || "",
        input.completionPercentage,
        input.goalId,
        input.milestoneId
      );

      // If eligible for certificate, generate it
      if (input.completionPercentage >= 78) {
        const certificateNumber = `CERT-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        const verificationCode = Math.random().toString(36).substring(2, 10).toUpperCase();

        // Generate PDF certificate
        const pdfUrl = await generateCertificatePDF({
          clientName: ctx.user.name || "Client",
          title: input.title,
          description: input.description || "",
          completionPercentage: input.completionPercentage,
          certificateNumber,
          verificationCode,
          issuedDate: new Date(),
          achievementType: input.achievementType,
        });

        const achievementId = (result as any).insertId || 1;
        await createCertificate(
          input.clientId,
          achievementId,
          input.title,
          input.description || "",
          input.completionPercentage,
          ctx.user.name || "Client",
          certificateNumber,
          verificationCode,
          pdfUrl
        );
      }

      return result;
    }),

  // Get eligible achievements (78%+ completion) that haven't been certificated yet
  getEligibleAchievements: protectedProcedure.input(z.object({ clientId: z.number() })).query(async ({ input }) => {
    const eligible = await getEligibleAchievements(input.clientId);
    return eligible;
  }),

  // Generate certificate for an achievement
  generateCertificate: protectedProcedure
    .input(z.object({ achievementId: z.number(), clientId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (!["case_manager", "admin"].includes(ctx.user.role)) {
        throw new Error("Unauthorized");
      }

      const achievementsList = await getClientAchievements(input.clientId);
      const achievement = achievementsList.find((a: any) => a.id === input.achievementId);

      if (!achievement || achievement.completionPercentage < 78) {
        throw new Error("Achievement not eligible for certificate");
      }

      const certificateNumber = `CERT-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const verificationCode = Math.random().toString(36).substring(2, 10).toUpperCase();

      const pdfUrl = await generateCertificatePDF({
        clientName: ctx.user.name || "Client",
        title: achievement.title,
        description: achievement.description || "",
        completionPercentage: achievement.completionPercentage,
        certificateNumber,
        verificationCode,
        issuedDate: new Date(),
        achievementType: achievement.achievementType,
      });

      const result = await createCertificate(
        input.clientId,
        input.achievementId,
        achievement.title,
        achievement.description || "",
        achievement.completionPercentage,
        ctx.user.name || "Client",
        certificateNumber,
        verificationCode,
        pdfUrl
      );

      return result;
    }),

  // Get all certificates for a client
  getClientCertificates: protectedProcedure.input(z.object({ clientId: z.number() })).query(async ({ input }) => {
    const certificates = await getClientCertificates(input.clientId);
    return certificates;
  }),

  // Get a specific certificate
  getCertificate: protectedProcedure.input(z.object({ certificateId: z.number() })).query(async ({ input }) => {
    const cert = await getCertificate(input.certificateId);
    if (cert.length > 0) {
      await updateCertificateViewCount(input.certificateId);
      return cert[0];
    }
    return null;
  }),

  // Track certificate download
  trackDownload: protectedProcedure.input(z.object({ certificateId: z.number() })).mutation(async ({ input }) => {
    await updateCertificateDownloadCount(input.certificateId);
    return { success: true };
  }),

  // Track certificate print
  trackPrint: protectedProcedure.input(z.object({ certificateId: z.number() })).mutation(async ({ input }) => {
    await updateCertificatePrintCount(input.certificateId);
    return { success: true };
  }),

  // Create achievement badge
  createBadge: protectedProcedure
    .input(
      z.object({
        clientId: z.number(),
        badgeType: z.enum([
          "goal_master",
          "milestone_champion",
          "sobriety_warrior",
          "employment_hero",
          "housing_champion",
          "family_reunifier",
          "court_compliant",
          "education_achiever",
          "recovery_champion",
          "community_contributor",
        ]),
        title: z.string(),
        description: z.string(),
        iconUrl: z.string().url(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!["case_manager", "admin"].includes(ctx.user.role)) {
        throw new Error("Unauthorized");
      }

      return await createAchievementBadge(
        input.clientId,
        input.badgeType,
        input.title,
        input.description,
        input.iconUrl
      );
    }),

  // Get all badges for a client
  getClientBadges: protectedProcedure.input(z.object({ clientId: z.number() })).query(async ({ input }) => {
    return await getClientBadges(input.clientId);
  }),
});
