import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import {
  getNotificationPreferences,
  createNotificationPreferences,
  updateNotificationPreferences,
  recordNotificationHistory,
  getNotificationHistory,
  registerDeviceToken,
  getDeviceTokens,
  deactivateDeviceToken,
  getClientCertificates,
} from "../db";
import { sendSMSNotification, formatPhoneNumber } from "../_core/twilio";
import { sendPushNotification, getCertificateNotificationPayload } from "../_core/pushNotifications";

export const notificationsRouter = router({
  // Get user's notification preferences
  getPreferences: protectedProcedure.query(async ({ ctx }) => {
    const prefs = await getNotificationPreferences(ctx.user.id);
    if (!prefs) {
      // Create default preferences if they don't exist
      await createNotificationPreferences({
        userId: ctx.user.id,
        appointmentReminders: true,
        medicationReminders: true,
        goalReminders: true,
        dailyCoachMessage: true,
        weeklyProgressSummary: true,
        devotionals: false,
        motivationalMessages: true,
        crisisAlerts: true,
        alertsEnabled: true,
        messagesEnabled: true,
        referralsEnabled: true,
        appointmentsEnabled: true,
        remindersEnabled: true,
        frequency: "immediate",
        quietHoursEnabled: false,
        soundEnabled: true,
        browserNotificationsEnabled: false,
      });
      return getNotificationPreferences(ctx.user.id);
    }
    return prefs;
  }),

  // Update notification preferences
  updatePreferences: protectedProcedure
    .input(
      z.object({
        appointmentReminders: z.boolean().optional(),
        medicationReminders: z.boolean().optional(),
        goalReminders: z.boolean().optional(),
        dailyCoachMessage: z.boolean().optional(),
        weeklyProgressSummary: z.boolean().optional(),
        devotionals: z.boolean().optional(),
        motivationalMessages: z.boolean().optional(),
        crisisAlerts: z.boolean().optional(),
        alertsEnabled: z.boolean().optional(),
        messagesEnabled: z.boolean().optional(),
        referralsEnabled: z.boolean().optional(),
        appointmentsEnabled: z.boolean().optional(),
        remindersEnabled: z.boolean().optional(),
        frequency: z.enum(["immediate", "hourly_digest", "daily_digest"]).optional(),
        quietHoursEnabled: z.boolean().optional(),
        reminderLeadMinutes: z.number().optional(),
        quietHoursStart: z.string().optional(),
        quietHoursEnd: z.string().optional(),
        soundEnabled: z.boolean().optional(),
        browserNotificationsEnabled: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await updateNotificationPreferences(ctx.user.id, input);
      return getNotificationPreferences(ctx.user.id);
    }),

  // Register device token for push notifications
  registerDeviceToken: protectedProcedure
    .input(
      z.object({
        token: z.string(),
        deviceType: z.enum(["web", "ios", "android"]),
        deviceName: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await registerDeviceToken(ctx.user.id, input.token, input.deviceType, input.deviceName);
      return { success: true };
    }),

  // Get user's device tokens
  getDeviceTokens: protectedProcedure.query(async ({ ctx }) => {
    return getDeviceTokens(ctx.user.id);
  }),

  // Deactivate a device token
  deactivateDeviceToken: protectedProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      await deactivateDeviceToken(input.token);
      return { success: true };
    }),

  // Get notification history
  getHistory: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }))
    .query(async ({ ctx, input }) => {
      return getNotificationHistory(ctx.user.id, input.limit);
    }),

  // Send SMS notification for certificate achievement
  sendCertificateNotification: protectedProcedure
    .input(
      z.object({
        certificateId: z.number(),
        phoneNumber: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Get certificate details
        const certificates = await getClientCertificates(ctx.user.id);
        const certificate = certificates.find((c: any) => c.id === input.certificateId);

        if (!certificate) {
          throw new Error("Certificate not found");
        }

        // Get user preferences
        const prefs = await getNotificationPreferences(ctx.user.id);
        if (!prefs) {
          throw new Error("Notification preferences not found");
        }

        const phoneNumber = input.phoneNumber;

        // Send SMS if enabled
        if (prefs.messagesEnabled && phoneNumber) {
          const message = `🏆 Congratulations! You earned a certificate for "${certificate.title}" at ${certificate.completionPercentage}% completion! Share it on LinkedIn: [link]`;
          await sendSMSNotification({ toPhoneNumber: formatPhoneNumber(phoneNumber), message });

          // Record SMS notification
          await recordNotificationHistory({
            userId: ctx.user.id,
            type: "sms",
            channel: "certificate",
            title: "Certificate Achievement",
            body: message,
            recipient: phoneNumber,
            status: "sent",
            metadata: { certificateId: input.certificateId },
          });
        }

        // Send push notification if enabled
        if (prefs.alertsEnabled) {
          const payload = getCertificateNotificationPayload(
            certificate.title,
            certificate.completionPercentage
          );
          await sendPushNotification(ctx.user.id, payload);

          // Record push notification
          await recordNotificationHistory({
            userId: ctx.user.id,
            type: "push",
            channel: "certificate",
            title: payload.title,
            body: payload.body,
            status: "sent",
            metadata: { certificateId: input.certificateId },
          });
        }

        return { success: true, message: "Notifications sent successfully" };
      } catch (error) {
        console.error("Failed to send certificate notification:", error);
        throw error;
      }
    }),

  // Send milestone notification
  sendMilestoneNotification: protectedProcedure
    .input(
      z.object({
        milestoneTitle: z.string(),
        description: z.string().optional(),
        phoneNumber: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const prefs = await getNotificationPreferences(ctx.user.id);
        if (!prefs) {
          return { success: false, message: "Notification preferences not found" };
        }

        const phoneNumber = input.phoneNumber;

        // Send SMS if enabled
        if (prefs.messagesEnabled && phoneNumber) {
          const message = `🎯 Milestone Reached! You've achieved "${input.milestoneTitle}". Keep up the great work!`;
          await sendSMSNotification({ toPhoneNumber: formatPhoneNumber(phoneNumber), message });

          await recordNotificationHistory({
            userId: ctx.user.id,
            type: "sms",
            channel: "milestone",
            title: "Milestone Reached",
            body: message,
            recipient: phoneNumber,
            status: "sent",
            metadata: { milestone: input.milestoneTitle },
          });
        }

        // Send push notification if enabled
        if (prefs.alertsEnabled) {
          await sendPushNotification(ctx.user.id, {
            title: "🎯 Milestone Reached!",
            body: `You've achieved "${input.milestoneTitle}"!`,
            tag: "milestone",
            data: { type: "milestone", action: "view_progress" },
          });

          await recordNotificationHistory({
            userId: ctx.user.id,
            type: "push",
            channel: "milestone",
            title: "Milestone Reached",
            body: `You've achieved "${input.milestoneTitle}"!`,
            status: "sent",
            metadata: { milestone: input.milestoneTitle },
          });
        }

        return { success: true };
      } catch (error) {
        console.error("Failed to send milestone notification:", error);
        throw error;
      }
    }),

  // Send referral notification
  sendReferralNotification: protectedProcedure
    .input(
      z.object({
        referralTitle: z.string(),
        provider: z.string(),
        phoneNumber: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const prefs = await getNotificationPreferences(ctx.user.id);
        if (!prefs) {
          return { success: false, message: "Notification preferences not found" };
        }

        const phoneNumber = input.phoneNumber;

        // Send SMS if enabled
        if (prefs.messagesEnabled && phoneNumber) {
          const message = `📋 New Referral: ${input.referralTitle} from ${input.provider}. Tap to learn more!`;
          await sendSMSNotification({ toPhoneNumber: formatPhoneNumber(phoneNumber), message });

          await recordNotificationHistory({
            userId: ctx.user.id,
            type: "sms",
            channel: "referral",
            title: "New Referral",
            body: message,
            recipient: phoneNumber,
            status: "sent",
            metadata: { referral: input.referralTitle, provider: input.provider },
          });
        }

        // Send push notification if enabled
        if (prefs.alertsEnabled) {
          await sendPushNotification(ctx.user.id, {
            title: "📋 New Referral",
            body: `${input.referralTitle} from ${input.provider}`,
            tag: "referral",
            data: { type: "referral", action: "view_referrals" },
          });

          await recordNotificationHistory({
            userId: ctx.user.id,
            type: "push",
            channel: "referral",
            title: "New Referral",
            body: `${input.referralTitle} from ${input.provider}`,
            status: "sent",
            metadata: { referral: input.referralTitle, provider: input.provider },
          });
        }

        return { success: true };
      } catch (error) {
        console.error("Failed to send referral notification:", error);
        throw error;
      }
    }),

  // Send feed item notification
  sendFeedItemNotification: protectedProcedure
    .input(
      z.object({
        itemType: z.enum(["job", "meal", "medical", "counseling", "resource"]),
        itemTitle: z.string(),
        phoneNumber: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const prefs = await getNotificationPreferences(ctx.user.id);
        if (!prefs) {
          return { success: false, message: "Notification preferences not found" };
        }

        const phoneNumber = input.phoneNumber;
        const icons: Record<string, string> = {
          job: "💼",
          meal: "🍽️",
          medical: "🏥",
          counseling: "💬",
          resource: "📚",
        };

        // Send SMS if enabled
        if (prefs.messagesEnabled && phoneNumber) {
          const message = `${icons[input.itemType]} New ${input.itemType} opportunity: ${input.itemTitle}. Check it out!`;
          await sendSMSNotification({ toPhoneNumber: formatPhoneNumber(phoneNumber), message });

          await recordNotificationHistory({
            userId: ctx.user.id,
            type: "sms",
            channel: "feed_item",
            title: `New ${input.itemType} Opportunity`,
            body: message,
            recipient: phoneNumber,
            status: "sent",
            metadata: { itemType: input.itemType, itemTitle: input.itemTitle },
          });
        }

        // Send push notification if enabled
        if (prefs.alertsEnabled) {
          await sendPushNotification(ctx.user.id, {
            title: `${icons[input.itemType]} New ${input.itemType} Opportunity`,
            body: input.itemTitle,
            tag: `feed-${input.itemType}`,
            data: { type: "feed_item", itemType: input.itemType, action: "view_feed" },
          });

          await recordNotificationHistory({
            userId: ctx.user.id,
            type: "push",
            channel: "feed_item",
            title: `New ${input.itemType} Opportunity`,
            body: input.itemTitle,
            status: "sent",
            metadata: { itemType: input.itemType, itemTitle: input.itemTitle },
          });
        }

        return { success: true };
      } catch (error) {
        console.error("Failed to send feed item notification:", error);
        throw error;
      }
    }),
});
