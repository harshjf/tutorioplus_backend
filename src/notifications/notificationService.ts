import { query } from "@/common/models/database";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

interface NotificationParams {
  [key: string]: string;
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
        SELECT n.id, n.name, t.subject, t.content, t.wildcards, c.name AS channel
        FROM notifications n
        JOIN notification_channel_mapping m ON n.id = m.notification_id
        JOIN notification_templates t ON m.template_id = t.id
        JOIN notification_channels c ON m.channel_id = c.id
        WHERE n.name = $1
      `;

    const result = await query(notificationQuery, [type]);
    if (result.length === 0) throw new Error("Notification type not found");

    let users: { id: number; email: string }[] = [];

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
    } else {
      throw new Error("No target user or role provided for notification.");
    }

    for (const row of result) {
      const { id, subject, content, wildcards, channel } = row;

      let finalMessage = content;
      if (wildcards && Array.isArray(wildcards)) {
        wildcards.forEach((placeholder: string) => {
          const key = placeholder;
          finalMessage = finalMessage.replace(placeholder, params[key] || "");
        });
      }

      for (const user of users) {
        if (channel === "EMAIL") {
          await sendEmailNotification(
            user.id,
            user.email,
            subject,
            finalMessage
          );
        } else if (channel === "NOTIFICATION") {
          await storeSystemNotification(user.id, id, subject, finalMessage);
        }
      }
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const sendEmailNotification = async (
  userId: number,
  userEmail: string,
  subject: string,
  message: string
): Promise<void> => {
  try {
    const notificationQuery = `SELECT * FROM notification_templates WHERE name = 'BASE_TEMPLATE'`;
    const result = await query(notificationQuery);
    if (result.length === 0)
      throw new Error("Base notification template not found");

    const { id, subject, content, wildcards, channel } = result[0];

    message = content.replace("%BODY%", message);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
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
