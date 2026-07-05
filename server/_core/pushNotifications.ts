/**
 * Push Notification Service
 * Handles Web Push and Mobile Push notifications using Firebase Cloud Messaging
 */

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, string>;
  actions?: Array<{
    action: string;
    title: string;
  }>;
}

/**
 * Send push notification to a user
 * In production, this would integrate with Firebase Cloud Messaging or similar service
 */
export async function sendPushNotification(
  userId: number,
  payload: PushNotificationPayload
): Promise<boolean> {
  try {
    // TODO: Integrate with Firebase Cloud Messaging or OneSignal
    // For now, this is a placeholder that logs the notification
    console.log(`Push notification queued for user ${userId}:`, payload);

    // In production:
    // 1. Query database for user's device tokens
    // 2. Send via FCM/OneSignal API
    // 3. Track delivery status

    return true;
  } catch (error) {
    console.error("Failed to send push notification:", error);
    return false;
  }
}

/**
 * Send push notification to multiple users
 */
export async function sendBulkPushNotifications(
  userIds: number[],
  payload: PushNotificationPayload
): Promise<{ successful: number; failed: number }> {
  let successful = 0;
  let failed = 0;

  for (const userId of userIds) {
    const result = await sendPushNotification(userId, payload);
    if (result) {
      successful++;
    } else {
      failed++;
    }
  }

  return { successful, failed };
}

/**
 * Certificate achievement notification template
 */
export function getCertificateNotificationPayload(
  certificateTitle: string,
  completionPercentage: number
): PushNotificationPayload {
  return {
    title: "🏆 Achievement Unlocked!",
    body: `You earned a certificate for "${certificateTitle}" at ${completionPercentage}% completion!`,
    icon: "🏆",
    tag: "achievement",
    data: {
      type: "certificate",
      action: "view_achievements",
    },
    actions: [
      {
        action: "view",
        title: "View Certificate",
      },
      {
        action: "share",
        title: "Share Achievement",
      },
    ],
  };
}

/**
 * Milestone achievement notification template
 */
export function getMilestoneNotificationPayload(milestoneTitle: string): PushNotificationPayload {
  return {
    title: "🎯 Milestone Reached!",
    body: `Congratulations! You've reached the "${milestoneTitle}" milestone!`,
    icon: "🎯",
    tag: "milestone",
    data: {
      type: "milestone",
      action: "view_progress",
    },
  };
}

/**
 * Referral notification template
 */
export function getReferralNotificationPayload(
  referralTitle: string,
  provider: string
): PushNotificationPayload {
  return {
    title: "📋 New Referral",
    body: `You have a new referral: ${referralTitle} from ${provider}`,
    icon: "📋",
    tag: "referral",
    data: {
      type: "referral",
      action: "view_referrals",
    },
  };
}

/**
 * Daily feed item notification template
 */
export function getFeedItemNotificationPayload(
  itemType: string,
  itemTitle: string
): PushNotificationPayload {
  const icons: Record<string, string> = {
    job: "💼",
    meal: "🍽️",
    medical: "🏥",
    counseling: "💬",
    resource: "📚",
  };

  return {
    title: `${icons[itemType] || "📌"} New ${itemType} Opportunity`,
    body: itemTitle,
    icon: icons[itemType],
    tag: `feed-${itemType}`,
    data: {
      type: "feed_item",
      itemType,
      action: "view_feed",
    },
  };
}
