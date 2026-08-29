import { NextRequest, NextResponse, after } from "next/server";
import Mailgun from "mailgun.js";
import formData from "form-data";
import { render } from "@react-email/render";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyVerifiedToken } from "@/lib/emailVerification";
import { sendAlertSms } from "@/lib/sms";
import { BetaSignupEmail } from "@/emails/BetaSignupEmail";
import { BetaConfirmationEmail } from "@/emails/BetaConfirmationEmail";
import { EMPLOYEE_OPTIONS, REVENUE_OPTIONS } from "@/lib/betaFormOptions";
import { isValidEmail } from "@/lib/email";

const PHONE_RE = /^[0-9+()\-.\s]{7,20}$/;

// The form only ever submits strings from text inputs/selects, but this
// route accepts raw JSON — nothing stops a direct POST from sending a
// number, array, or object for any field, or text far past what the UI's
// inputs would allow. Bound every field here so what lands in Supabase (and
// gets emailed out verbatim) can't be a type mismatch or a wall of text.
const TEXT_FIELD_LIMITS = {
  companyName: 200,
  contactName: 200,
  address: 300,
  brands: 2000,
  notes: 2000,
} as const;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyName, contactName, contactEmail, phone, address, employees, annualRevenue, brands, notes, verifiedToken } = body;

    for (const [field, limit] of Object.entries(TEXT_FIELD_LIMITS)) {
      const value = body[field];
      if (typeof value !== "string" || !value.trim() || value.length > limit) {
        return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 });
      }
    }
    if (!isValidEmail(contactEmail)) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
    }
    if (typeof phone !== "string" || !PHONE_RE.test(phone.trim())) {
      return NextResponse.json({ error: "Enter a valid phone number" }, { status: 400 });
    }
    if (!(EMPLOYEE_OPTIONS as readonly string[]).includes(employees)) {
      return NextResponse.json({ error: "Invalid employees value" }, { status: 400 });
    }
    if (!(REVENUE_OPTIONS as readonly string[]).includes(annualRevenue)) {
      return NextResponse.json({ error: "Invalid annual revenue value" }, { status: 400 });
    }

    // The applicant must have verified this exact email before we accept the application
    const verifiedEmail = typeof verifiedToken === "string" ? verifyVerifiedToken(verifiedToken) : null;
    if (!verifiedEmail || verifiedEmail.toLowerCase() !== contactEmail.toLowerCase()) {
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
