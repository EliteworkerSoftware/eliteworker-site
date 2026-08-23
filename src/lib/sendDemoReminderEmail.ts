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
}: {
  to: string;
  name: string;
  when: string;
  eventTitle?: string | null;
  confirmUrl: string;
}) {
  const emailElement = DemoReminderEmail({ name, when, eventTitle, confirmUrl });
  const [html, text] = await Promise.all([render(emailElement), render(emailElement, { plainText: true })]);

  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({ username: "api", key: process.env.MAILGUN_API_KEY || "" });
  await mg.messages.create(process.env.MAILGUN_DOMAIN || "", {
    from: process.env.CONTACT_FROM_EMAIL || `EliteWorker Site <postmaster@${process.env.MAILGUN_DOMAIN}>`,
    to,
    subject: "Reminder: your EliteWorker demo is coming up",
    html,
    text,
    "h:Reply-To": process.env.CONTACT_TO_EMAIL || process.env.CONTACT_FROM_EMAIL || "",
  });
}
