import { NextRequest, NextResponse, after } from "next/server";
import Mailgun from "mailgun.js";
import formData from "form-data";
import { render } from "@react-email/render";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendAlertSms } from "@/lib/sms";
import { ContactLeadEmail } from "@/emails/ContactLeadEmail";

export async function POST(req: NextRequest) {
  try {
    const { name, email, company, message, turnstileToken } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const remoteIp = req.headers.get("x-forwarded-for");
    const isHuman = await verifyTurnstile(turnstileToken, remoteIp);
    if (!isHuman) {
      return NextResponse.json({ error: "Verification failed — please try again" }, { status: 400 });
    }

    // Save the lead to Supabase — this is the only part the visitor actually
    // needs to wait on. Once it's saved, their submission is a success no
    // matter what happens next.
    const supabase = getSupabaseAdmin();
    const { error: dbError } = await supabase
      .from("eliteworker_leads")
      .insert({ name, email, company, message });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
    }

    // Team notification (email + SMS) runs after the response is already
    // sent — via after(), not just fire-and-forget, so Vercel keeps the
    // function alive long enough to finish even though the visitor isn't
    // waiting on it. Previously these were awaited before responding, so a
    // slow Mailgun/Twilio call could hit Vercel's function timeout and show
    // the visitor an error even after their message was safely saved.
    after(async () => {
      try {
        const emailElement = ContactLeadEmail({ name, email, company, message });
        const [html, text] = await Promise.all([
          render(emailElement),
          render(emailElement, { plainText: true }),
        ]);

        const mailgun = new Mailgun(formData);
        const mg = mailgun.client({
          username: "api",
          key: process.env.MAILGUN_API_KEY || "",
        });
        await mg.messages.create(process.env.MAILGUN_DOMAIN || "", {
          from: process.env.CONTACT_FROM_EMAIL || `EliteWorker Site <postmaster@${process.env.MAILGUN_DOMAIN}>`,
          to: process.env.CONTACT_TO_EMAIL || "you@example.com",
          subject: `New EliteWorker inquiry from ${name}`,
          html,
          text,
        });
      } catch (err) {
        console.error("Contact notification email error:", err);
      }

      await sendAlertSms(`New contact form lead: ${name} (${email}). Check /admin for details.`);
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
