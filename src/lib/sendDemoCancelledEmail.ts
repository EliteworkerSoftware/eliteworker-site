import Mailgun from "mailgun.js";
import formData from "form-data";
import { render } from "@react-email/render";
import { DemoCancelledEmail } from "@/emails/DemoCancelledEmail";

export async function sendDemoCancelledEmail({
  to,
  attendeeName,
  when,
  ics,
}: {
  to: string;
  attendeeName: string;
  when: string;
  ics: { filename: string; content: string };
}) {
  const emailElement = DemoCancelledEmail({ attendeeName, when });
  const [html, text] = await Promise.all([render(emailElement), render(emailElement, { plainText: true })]);

  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({ username: "api", key: process.env.MAILGUN_API_KEY || "" });
  await mg.messages.create(process.env.MAILGUN_DOMAIN || "", {
    from: `EliteWorker <${(process.env.CONTACT_TO_EMAIL || "contact@eliteworker.com").trim()}>`,
    to,
    subject: "Your EliteWorker demo has been cancelled",
    html,
    text,
    attachment: [{ data: Buffer.from(ics.content), filename: ics.filename }],
  });
}
