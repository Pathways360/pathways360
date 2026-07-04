/**
 * Scheduled appointment reminder handler.
 * Mounted at POST /api/scheduled/appointment-reminder
 * Called by the Manus Heartbeat service at the time of each reminder.
 */
import type { Express } from "express";
import { sdk } from "./_core/sdk";
import { getDb } from "./db";
import { appointments, users, providerMessages } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export function registerScheduledRoutes(app: Express) {
  app.post("/api/scheduled/appointment-reminder", async (req, res) => {
    try {
      // Authenticate the cron callback
      const user = await sdk.authenticateRequest(req);
      if (!user.isCron || !user.taskUid) {
        res.status(403).json({ error: "Forbidden: not a cron request" });
        return;
      }

      const db = await getDb();
      if (!db) {
        res.status(500).json({ error: "Database unavailable" });
        return;
      }

      // Find the appointment by its stored cron task UID
      const [appt] = await db
        .select()
        .from(appointments)
        .where(eq(appointments.scheduleCronTaskUid, user.taskUid))
        .limit(1);

      if (!appt) {
        // Appointment was deleted — nothing to do, respond OK so heartbeat doesn't retry
        res.json({ ok: true, message: "Appointment not found, skipping" });
        return;
      }

      if (appt.completed) {
        res.json({ ok: true, message: "Appointment already completed, skipping" });
        return;
      }

      // Get the user's name for a personalised message
      const [owner] = await db
        .select()
        .from(users)
        .where(eq(users.id, appt.userId))
        .limit(1);

      const userName = owner?.name || "there";
      const apptTime = new Date(appt.appointmentDate).toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });

      // Create an inbox notification in the providerMessages table so it appears on the client dashboard
      await db.insert(providerMessages).values({
        fromProviderId: appt.userId, // system message — from self
        toClientId: appt.userId,
        organizationId: 0, // system/automated
        messageType: "reminder",
        subject: `Reminder: ${appt.title}`,
        content: `Hey ${userName}! Your appointment "${appt.title}" is coming up — ${apptTime}${appt.location ? ` at ${appt.location}` : ""}. You've got this! 💪`,
        read: false,
      });
      console.log(`[Reminder] Inbox notification created for user ${appt.userId} — "${appt.title}" at ${apptTime}`);

      res.json({
        ok: true,
        message: `Reminder processed for appointment ${appt.id}`,
        appointmentTitle: appt.title,
        userId: appt.userId,
      });
    } catch (error) {
      console.error("[Reminder] Error processing reminder:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}
