export interface SendNotificationOptions {
  to: string; // Phone number e.g. "03001234567"
  message: string;
  type?: "sms" | "whatsapp";
  bookingReference?: string;
}

export interface NotificationResult {
  success: boolean;
  messageId?: string;
  provider: string;
  error?: string;
}

export interface NotificationProvider {
  send(options: SendNotificationOptions): Promise<NotificationResult>;
}

// 1. Mock Provider for Dev / Test / Demo
class MockNotificationProvider implements NotificationProvider {
  async send(options: SendNotificationOptions): Promise<NotificationResult> {
    const msgId = `mock-msg-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    console.log(`[SMS MOCK] [${options.type || "sms"}] To: ${options.to}`);
    console.log(`[SMS MOCK] Content:\n${options.message}`);
    return {
      success: true,
      messageId: msgId,
      provider: "mock",
    };
  }
}

// 2. Twilio Adapter
class TwilioNotificationProvider implements NotificationProvider {
  private accountSid: string;
  private authToken: string;
  private fromPhone: string;
  private whatsappFrom: string;

  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID || "";
    this.authToken = process.env.TWILIO_AUTH_TOKEN || "";
    this.fromPhone = process.env.TWILIO_FROM_PHONE || "";
    this.whatsappFrom = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886";
  }

  async send(options: SendNotificationOptions): Promise<NotificationResult> {
    if (!this.accountSid || !this.authToken) {
      console.warn("[Twilio] Credentials not provided, falling back to mock");
      return new MockNotificationProvider().send(options);
    }

    try {
      // Normalize Pakistani phone to international format: +923001234567
      let toPhone = options.to.replace(/\D/g, "");
      if (toPhone.startsWith("0")) toPhone = "92" + toPhone.slice(1);
      if (!toPhone.startsWith("+")) toPhone = "+" + toPhone;

      const isWhatsApp = options.type === "whatsapp";
      const from = isWhatsApp ? this.whatsappFrom : this.fromPhone;
      const to = isWhatsApp ? `whatsapp:${toPhone}` : toPhone;

      const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`;
      const auth = Buffer.from(`${this.accountSid}:${this.authToken}`).toString("base64");

      const params = new URLSearchParams();
      params.append("To", to);
      params.append("From", from);
      params.append("Body", options.message);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      const data = await res.json();
      if (!res.ok) {
        return {
          success: false,
          error: data.message || "Twilio delivery failure",
          provider: "twilio",
        };
      }

      return {
        success: true,
        messageId: data.sid,
        provider: "twilio",
      };
    } catch (e: any) {
      return {
        success: false,
        error: e.message,
        provider: "twilio",
      };
    }
  }
}

// 3. Generic Pakistani HTTP SMS Gateway Adapter (e.g. Jazz / Telenor / Brandverse)
class GenericHttpNotificationProvider implements NotificationProvider {
  private endpoint: string;
  private apiKey: string;
  private senderId: string;

  constructor() {
    this.endpoint = process.env.GENERIC_SMS_ENDPOINT || "";
    this.apiKey = process.env.GENERIC_SMS_API_KEY || "";
    this.senderId = process.env.GENERIC_SMS_SENDER_ID || "NI-HOSP";
  }

  async send(options: SendNotificationOptions): Promise<NotificationResult> {
    if (!this.endpoint) {
      return new MockNotificationProvider().send(options);
    }

    try {
      const res = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          sender: this.senderId,
          receiver: options.to,
          message: options.message,
        }),
      });

      const data = await res.json().catch(() => ({}));
      return {
        success: res.ok,
        messageId: data.id || "http-gateway-ack",
        provider: "generic_http",
      };
    } catch (e: any) {
      return {
        success: false,
        error: e.message,
        provider: "generic_http",
      };
    }
  }
}

// Factory
export function getNotificationProvider(): NotificationProvider {
  const provider = (process.env.SMS_PROVIDER || "mock").toLowerCase();
  if (provider === "twilio") return new TwilioNotificationProvider();
  if (provider === "generic_http") return new GenericHttpNotificationProvider();
  return new MockNotificationProvider();
}

// Helper template builders
export function createAppointmentConfirmationMessage(params: {
  hospitalName: string;
  patientName: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  referenceNo: string;
  phone: string;
}) {
  return (
    `Assalam-o-Alaikum ${params.patientName},\n\n` +
    `Your appointment at ${params.hospitalName} has been confirmed.\n` +
    `Doctor: ${params.doctorName}\n` +
    `Date & Time: ${params.date} at ${params.timeSlot}\n` +
    `Booking Ref: ${params.referenceNo}\n\n` +
    `Please arrive 15 minutes before your slot. For assistance: ${params.phone}.`
  );
}
