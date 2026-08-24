import { NextRequest, NextResponse, after } from "next/server";
import Mailgun from "mailgun.js";
import formData from "form-data";
import { render } from "@react-email/render";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyVerifiedToken } from "@/lib/emailVerification";
import { sendAlertSms } from "@/lib/sms";
import { BetaSignupEmail } from "@/emails/BetaSignupEmail";
import { BetaConfirmationEmail } from "@/emails/BetaConfirmationEmail";

export async function POST(req: NextRequest) {
  try {
    const {
      companyName,
      contactName,
      contactEmail,
      phone,
      address,
      employees,
      annualRevenue,
      brands,
      notes,
      verifiedToken,
    } = await req.json();

    if (
      !companyName ||
      !contactName ||
      !contactEmail ||
      !phone ||
      !address ||
      !employees ||
      !annualRevenue ||
      !brands ||
      !notes
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // The applicant must have verified this exact email before we accept the application
    const verifiedEmail = typeof verifiedToken === "string" ? verifyVerifiedToken(verifiedToken) : null;
    if (!verifiedEmail || verifiedEmail.toLowerCase() !== String(contactEmail).toLowerCase()) {
      return NextResponse.json({ error: "Please verify your email again" }, { status: 401 });
    }

    // 1. Save the signup to Supabase so nothing is lost even if email fails
    const supabase = getSupabaseAdmin();
    const { error: dbError } = await supabase.from("eliteworker_beta_signups").insert({
      company_name: companyName,
      contact_name: contactName,
      contact_email: contactEmail,
      phone,
      address,
      employees,
      annual_revenue: annualRevenue,
      brands,
      notes,
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
    }

    // Notifications (team email, applicant confirmation, SMS) run after the
    // response is already sent — via after(), not just fire-and-forget, so
    // Vercel keeps the function alive long enough to finish even though the
    // applicant isn't waiting on it. Previously these were awaited before
    // responding, so a slow Mailgun/Twilio call could hit Vercel's function
    // timeout and show the applicant an error even after their signup was
    // safely saved.
    after(async () => {
      const mailgun = new Mailgun(formData);
      const mg = mailgun.client({
        username: "api",
        key: process.env.MAILGUN_API_KEY || "",
      });

      try {
        const notifyElement = BetaSignupEmail({
          companyName,
          contactName,
          contactEmail,
          phone,
          address,
          employees,
          annualRevenue,
          brands,
          notes,
        });
        const [notifyHtml, notifyText] = await Promise.all([
          render(notifyElement),
          render(notifyElement, { plainText: true }),
        ]);
        await mg.messages.create(process.env.MAILGUN_DOMAIN || "", {
          from: process.env.CONTACT_FROM_EMAIL || `EliteWorker Site <postmaster@${process.env.MAILGUN_DOMAIN}>`,
          to: process.env.CONTACT_TO_EMAIL || "you@example.com",
          subject: `New EliteWorker beta signup from ${companyName}`,
          html: notifyHtml,
          text: notifyText,
        });
      } catch (err) {
        console.error("Beta signup notification email error:", err);
      }

      try {
        const confirmElement = BetaConfirmationEmail({ contactName, companyName });
        const [confirmHtml, confirmText] = await Promise.all([
          render(confirmElement),
          render(confirmElement, { plainText: true }),
        ]);
        await mg.messages.create(process.env.MAILGUN_DOMAIN || "", {
          // Unlike every other outbound email, this one's copy invites a reply —
          // so it sends from the real monitored inbox instead of noreply@, rather
          // than showing a noreply From with a hidden Reply-To override.
          from: `EliteWorker <${(process.env.CONTACT_TO_EMAIL || "contact@eliteworker.com").trim()}>`,
          to: contactEmail,
          subject: "We got your EliteWorker beta application",
          html: confirmHtml,
          text: confirmText,
        });
      } catch (err) {
        console.error("Beta applicant confirmation email error:", err);
      }

      await sendAlertSms(`New beta signup: ${companyName} (${contactName}). Check /admin for details.`);
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Beta signup error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
