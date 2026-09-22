import Mailgun from "mailgun.js";
import formData from "form-data";
import { render } from "@react-email/render";
import { DemoConfirmationEmail } from "@/emails/DemoConfirmationEmail";

export async function sendDemoConfirmationEmail({
  to,
  attendeeName,
  when,
  eventTitle,
  meetingUrl,
  cancelUrl,
  rescheduleUrl,
  ics,
}: {
  to: string;
  attendeeName: string;
  when: string;
  eventTitle?: string | null;
  meetingUrl?: string | null;
  cancelUrl: string;
  rescheduleUrl: string;
  ics: { filename: string; content: string };
}) {
  const emailElement = DemoConfirmationEmail({ attendeeName, when, eventTitle, meetingUrl, cancelUrl, rescheduleUrl });
  const [html, text] = await Promise.all([render(emailElement), render(emailElement, { plainText: true })]);

  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({ username: "api", key: process.env.MAILGUN_API_KEY || "" });
  await mg.messages.create(process.env.MAILGUN_DOMAIN || "", {
    from: `EliteWorker <${(process.env.CONTACT_TO_EMAIL || "contact@eliteworker.com").trim()}>`,
    to,
    subject: "You're booked — EliteWorker demo confirmed",
    html,
    text,
    attachment: [{ data: Buffer.from(ics.content), filename: ics.filename }],
  });
}
