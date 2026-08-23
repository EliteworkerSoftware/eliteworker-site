import Mailgun from "mailgun.js";
import formData from "form-data";
import { render } from "@react-email/render";
import { AdminInviteEmail } from "@/emails/AdminInviteEmail";

export async function sendInviteEmail({
  to,
  fullName,
  role,
  tempPassword,
  subject,
}: {
  to: string;
  fullName: string;
  role: "owner" | "viewer";
  tempPassword: string;
  subject: string;
}) {
  const emailElement = AdminInviteEmail({ fullName, role, tempPassword });
  const [html, text] = await Promise.all([render(emailElement), render(emailElement, { plainText: true })]);

  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({ username: "api", key: process.env.MAILGUN_API_KEY || "" });
  await mg.messages.create(process.env.MAILGUN_DOMAIN || "", {
    from: process.env.CONTACT_FROM_EMAIL || `EliteWorker Site <postmaster@${process.env.MAILGUN_DOMAIN}>`,
    to,
    subject,
    html,
    text,
  });
}
