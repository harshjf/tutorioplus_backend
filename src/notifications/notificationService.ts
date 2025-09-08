import { query } from "@/common/models/database";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { doubleTickClient } from "@/notifications/doubletickClient";
import { normalizeToE164 } from "@/common/utils/phone";

dotenv.config();

interface NotificationParams {
  [key: string]: string | undefined;
  email?: string;
}

interface NotificationJob {
  type: string;
  userId?: number;
  recipientRole?: string;
  params: NotificationParams;
}

const sendNotification = async (
  type: string,
  userId?: number,
  params: NotificationParams = {},
  recipientRole?: string
): Promise<void> => {
  try {
    const notificationQuery = `
        SELECT
      n.id,
      n.name,
      t.subject,
      t.content,
      t.wildcards,
      c.name AS channel,
      wt.template_name AS wa_template_name,
      wt.language AS wa_language,
      wt.from_number AS wa_from,
      wt.variable_order AS wa_variable_order
    FROM notifications n
    JOIN notification_channel_mapping m ON n.id = m.notification_id
    JOIN notification_channels c ON m.channel_id = c.id
    LEFT JOIN notification_templates t ON m.template_id = t.id
    LEFT JOIN whatsapp_templates wt ON m.whatsapp_template_id = wt.id
    WHERE n.name = $1
      `;

    const result = await query(notificationQuery, [type]);
    if (result.length === 0) throw new Error("Notification type not found");

    let users: { id?: number; email: string }[] = [];

    if (recipientRole) {
      const userQuery = `SELECT u.id, u.email FROM users u JOIN roles r ON u.role_id = r.id WHERE r.role = $1`;
      const result = await query(userQuery, [recipientRole]);
      if (result.length === 0) {
        console.warn(`No users found for role ${recipientRole}`);
        return;
      }
      users = result;
    } else if (userId) {
      const userResult = await query(
        "SELECT id, email FROM users WHERE id = $1",
        [userId]
      );
      if (userResult.length === 0) throw new Error("User not found");
      users = userResult;
    } else if (params.email) {
      users = [{ email: params.email }];
    } else {
      throw new Error(
        "No target user, role, or email provided for notification."
      );
    }

    for (const row of result) {
      const { id, subject, content, wildcards, channel } = row;

      let finalSubject = subject;
      let finalMessage = content;
      if (wildcards && Array.isArray(wildcards)) {
        wildcards.forEach((placeholder: string) => {
          const key = placeholder;
          finalMessage = finalMessage.replaceAll(
            placeholder,
            params[key] || ""
          );
          finalSubject = finalSubject.replaceAll(
            placeholder,
            params[key] || ""
          );
        });
      }

      for (const user of users) {
        if (channel === "EMAIL") {
          await sendEmailNotification(
            user.id,
            user.email,
            finalSubject,
            finalMessage
          );
        } else if (channel === "NOTIFICATION" && user.id) {
          await storeSystemNotification(
            user.id,
            id,
            finalSubject,
            finalMessage
          );
        } else if (channel === "WHATSAPP") {
          let phone = (params as any).phone as string | undefined;
      
          if (!phone && user.id) {
            const phoneRow = await query(
              "SELECT phone_number AS phone, country_code FROM student_metadata WHERE user_id = $1",
              [user.id]
            );
            if (phoneRow.length > 0 && phoneRow[0].phone) {
              const cc = phoneRow[0].country_code || "1";
              phone = normalizeToE164(String(phoneRow[0].phone), String(cc));
            }
          }
          if (!phone) {
            console.warn(`Skipping WhatsApp: missing phone for user ${user.id || "N/A"}`);
            continue;
          }
          const templateName = row.wa_template_name;
          const language = row.wa_language || "en";
          const from = row.wa_from || process.env.DOUBLETICK_DEFAULT_FROM;
      
          try {
            const data = await doubleTickClient.sendTemplate({
              to: phone,
              from,
              templateName,
              language,
            });
            console.log("WhatsApp message sent:", JSON.stringify(data));
          } catch (err: any) {
            console.error("WhatsApp send failed:", err?.response?.data || err?.message || err);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const sendEmailNotification = async (
  userId: number | undefined,
  userEmail: string,
  subject: string,
  message: string
): Promise<void> => {
  try {
    const notificationQuery = `SELECT * FROM notification_templates WHERE name = 'BASE_TEMPLATE'`;
    const result = await query(notificationQuery);
    if (result.length === 0)
      throw new Error("Base notification template not found");

    const { content } = result[0];
    message = content.replace("%BODY%", message);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.hostinger.com",
      port: Number(process.env.SMTP_PORT || 465),
      secure: (process.env.SMTP_SECURE ?? "true") === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized:
          (process.env.SMTP_REJECT_UNAUTHORIZED ?? "true") === "true",
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: userEmail,
      subject,
      html: message,
    });

    console.log(`Email sent to ${userEmail}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

const storeSystemNotification = async (
  userId: number,
  notificationId: number,
  title: string,
  message: string
): Promise<void> => {
  try {
    await query(
      "INSERT INTO user_notifications (user_id, notification_id, title, message) VALUES ($1, $2, $3, $4)",
      [userId, notificationId, title, message]
    );
    console.log(`System notification stored for user ${userId}`);
  } catch (error) {
    console.error("Error storing system notification:", error);
  }
};

export { sendNotification };
