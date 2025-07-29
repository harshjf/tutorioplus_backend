// api/contact/contactService.ts
import notificationQueue from "@/notifications/queue";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export const handleContactFormSubmission = async (data: ContactFormData) => {
  await notificationQueue.add("sendNotification", {
    type: "CONTACT_FORM_SUBMISSION",
    // or use data.email to send back to user
    params: {
      email: "janvi@juniperforge.com", 
      "%name%": data.name,
      "%email%": data.email,
      "%phone%": data.phone,
      "%subject%": data.subject || "No Subject",
      "%message%": data.message,
    },
  });
};
