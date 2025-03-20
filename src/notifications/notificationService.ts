import { query } from "@/common/models/database";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Define Notification Params Type
interface NotificationParams {
  [key: string]: string;
}

// Define Notification Job Type
interface NotificationJob {
  type: string;
  userId: number;
  params: NotificationParams;
}

const sendNotification = async (
  type: string,
  userId: number,
  params: NotificationParams
): Promise<void> => {
  try {
    // Fetch notification details for all channels linked to this notification type
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

    // Loop through each channel assigned to this notification type
    for (const row of result) {
      const { id, subject, content, wildcards, channel } = row;

      // Replace wildcards in the message
      let finalMessage = content;
      if (wildcards && Array.isArray(wildcards)) {
        wildcards.forEach((placeholder: string) => {
          const key = placeholder;
          finalMessage = finalMessage.replace(placeholder, params[key] || "");
        });
      }

      // Handle each channel accordingly
      if (channel === "EMAIL") {
        await sendEmailNotification(userId, subject, finalMessage);
      } else if (channel === "NOTIFICATION") {
        await storeSystemNotification(userId, id, subject, finalMessage);
      }
    }
  } catch (error) {
    console.error("Error sending notification:", error);
  }
};

const sendEmailNotification = async (
  userId: number,
  subject: string,
  message: string
): Promise<void> => {
  try {
    // Fetch user email
    const userResult = await query("SELECT email FROM users WHERE id = $1", [
      userId,
    ]);
    if (userResult.length === 0) throw new Error("User not found");

    const userEmail = userResult[0].email;

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
