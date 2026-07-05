import twilio from "twilio";

// Lazy-load Twilio client to avoid startup errors
let client: ReturnType<typeof twilio> | null = null;
let initialized = false;

function initializeTwilio() {
  if (initialized) return;
  initialized = true;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromPhoneNumber) {
    console.warn("Twilio credentials not configured. SMS notifications will be disabled.");
    return;
  }

  try {
    client = twilio(accountSid, authToken);
  } catch (error) {
    console.warn("Failed to initialize Twilio:", error);
  }
}

const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

export interface SMSNotificationOptions {
  toPhoneNumber: string;
  message: string;
}

export interface PushNotificationOptions {
  userId: number;
  title: string;
  body: string;
  data?: Record<string, string>;
}

/**
 * Send SMS notification via Twilio
 */
export async function sendSMSNotification(options: SMSNotificationOptions): Promise<boolean> {
  try {
    initializeTwilio();
    if (!client || !fromPhoneNumber) {
      console.warn("Twilio not configured. SMS notification not sent.");
      return false;
    }

    const message = await client.messages.create({
      body: options.message,
      from: fromPhoneNumber,
      to: options.toPhoneNumber,
    });

    console.log(`SMS sent successfully. SID: ${message.sid}`);
    return true;
  } catch (error) {
    console.error("Failed to send SMS notification:", error);
    return false;
  }
}

/**
 * Send bulk SMS notifications
 */
export async function sendBulkSMSNotifications(
  notifications: SMSNotificationOptions[]
): Promise<{ successful: number; failed: number }> {
  let successful = 0;
  let failed = 0;

  for (const notification of notifications) {
    const result = await sendSMSNotification(notification);
    if (result) {
      successful++;
    } else {
      failed++;
    }
  }

  return { successful, failed };
}

/**
 * Validate Twilio credentials
 */
export async function validateTwilioCredentials(): Promise<boolean> {
  try {
    initializeTwilio();
    if (!client) {
      return false;
    }

    // Try to fetch account details to validate credentials
    const account = await client.api.accounts.list({ limit: 1 });
    return account.length > 0;
  } catch (error) {
    console.error("Twilio credential validation failed:", error);
    return false;
  }
}

/**
 * Format phone number for Twilio (ensure E.164 format)
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, "");

  // If it's a 10-digit US number, add +1
  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`;
  }

  // If it's already 11 digits starting with 1, add +
  if (digitsOnly.length === 11 && digitsOnly.startsWith("1")) {
    return `+${digitsOnly}`;
  }

  // If it's already in E.164 format, return as is
  if (phoneNumber.startsWith("+")) {
    return phoneNumber;
  }

  // Otherwise, assume it's already in the correct format or add +
  return `+${digitsOnly}`;
}
