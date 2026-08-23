import Mailgun from "mailgun.js";
import formData from "form-data";
import { render } from "@react-email/render";
import { LeadReplyEmail } from "@/emails/LeadReplyEmail";

export async function sendLeadReplyEmail({ to, name, message }: { to: string; name: string; message: string }) {
  const emailElement = LeadReplyEmail({ name, message });
  const [html, text] = await Promise.all([render(emailElement), render(emailElement, { plainText: true })]);

  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({ username: "api", key: process.env.MAILGUN_API_KEY || "" });
  await mg.messages.create(process.env.MAILGUN_DOMAIN || "", {
    from: process.env.CONTACT_FROM_EMAIL || `EliteWorker Site <postmaster@${process.env.MAILGUN_DOMAIN}>`,
    to,
    subject: "Re: Your message to EliteWorker",
    html,
    text,
    // So a reply-to-this-email from the lead lands in the team inbox rather
    // than whatever noreply-style address CONTACT_FROM_EMAIL is set to.
    "h:Reply-To": process.env.CONTACT_TO_EMAIL || process.env.CONTACT_FROM_EMAIL || "",
  });
}
