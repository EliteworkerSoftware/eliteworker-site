import { NextRequest, NextResponse } from "next/server";
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

    // 2. Notify your team by email via Mailgun
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

    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY || "",
    });
    await mg.messages.create(process.env.MAILGUN_DOMAIN || "", {
      from: process.env.CONTACT_FROM_EMAIL || `EliteWorker Site <postmaster@${process.env.MAILGUN_DOMAIN}>`,
      to: process.env.CONTACT_TO_EMAIL || "you@example.com",
      subject: `New EliteWorker beta signup from ${companyName}`,
      html: notifyHtml,
      text: notifyText,
    });

    // 3. Confirm receipt with the applicant
    const confirmElement = BetaConfirmationEmail({ contactName, companyName });
    const [confirmHtml, confirmText] = await Promise.all([
      render(confirmElement),
      render(confirmElement, { plainText: true }),
    ]);
    await mg.messages.create(process.env.MAILGUN_DOMAIN || "", {
      from: process.env.CONTACT_FROM_EMAIL || `EliteWorker Site <postmaster@${process.env.MAILGUN_DOMAIN}>`,
      to: contactEmail,
      subject: "We got your EliteWorker beta application",
      html: confirmHtml,
      text: confirmText,
    });

    // 4. Also text you — easy to miss an email, hard to miss a text
    await sendAlertSms(`New beta signup: ${companyName} (${contactName}). Check /admin for details.`);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Beta signup error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
