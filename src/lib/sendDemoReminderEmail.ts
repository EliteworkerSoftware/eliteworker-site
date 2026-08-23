import Mailgun from "mailgun.js";
import formData from "form-data";
import { render } from "@react-email/render";
import { DemoReminderEmail } from "@/emails/DemoReminderEmail";

export async function sendDemoReminderEmail({
  to,
  name,
  when,
  eventTitle,
  confirmUrl,
  rescheduleUrl,
}: {
  to: string;
  name: string;
  when: string;
  eventTitle?: string | null;
  confirmUrl: string;
  rescheduleUrl: string;
}) {
  const emailElement = DemoReminderEmail({ name, when, eventTitle, confirmUrl, rescheduleUrl });
  const [html, text] = await Promise.all([render(emailElement), render(emailElement, { plainText: true })]);

  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({ username: "api", key: process.env.MAILGUN_API_KEY || "" });
  await mg.messages.create(process.env.MAILGUN_DOMAIN || "", {
    // Same reasoning as sendReplyEmail: this invites a reply ("need a
    // different time entirely?"), so it sends from the real monitored inbox
    // instead of noreply@.
    from: `EliteWorker <${(process.env.CONTACT_TO_EMAIL || "contact@eliteworker.com").trim()}>`,
    to,
    subject: "Reminder: your EliteWorker demo is coming up",
    html,
    text,
  });
}
