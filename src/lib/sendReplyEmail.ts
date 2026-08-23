import Mailgun from "mailgun.js";
import formData from "form-data";
import { render } from "@react-email/render";
import { AdminReplyEmail } from "@/emails/AdminReplyEmail";

export async function sendReplyEmail({ to, name, message }: { to: string; name: string; message: string }) {
  const emailElement = AdminReplyEmail({ name, message });
  const [html, text] = await Promise.all([render(emailElement), render(emailElement, { plainText: true })]);

  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({ username: "api", key: process.env.MAILGUN_API_KEY || "" });
  await mg.messages.create(process.env.MAILGUN_DOMAIN || "", {
    // This is a direct reply to something the recipient sent us, so it sends
    // from the real monitored inbox instead of noreply@ — a Reply-To header
    // on a noreply From still leaves "noreply" as the visible sender, which
    // reads as "don't reply" even when it would technically route correctly.
    from: `EliteWorker <${(process.env.CONTACT_TO_EMAIL || "contact@eliteworker.com").trim()}>`,
    to,
    subject: "Re: Your message to EliteWorker",
    html,
    text,
  });
}
