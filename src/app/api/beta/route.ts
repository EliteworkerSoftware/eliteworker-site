import { NextRequest, NextResponse } from "next/server";
import Mailgun from "mailgun.js";
import formData from "form-data";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyVerifiedToken } from "@/lib/emailVerification";

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
    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY || "",
    });
    await mg.messages.create(process.env.MAILGUN_DOMAIN || "", {
      from: process.env.CONTACT_FROM_EMAIL || `EliteWorker Site <postmaster@${process.env.MAILGUN_DOMAIN}>`,
      to: process.env.CONTACT_TO_EMAIL || "you@example.com",
      subject: `New EliteWorker beta signup from ${companyName}`,
      text: [
        `Company: ${companyName}`,
        `Contact: ${contactName}`,
        `Contact email: ${contactEmail}`,
        `Phone: ${phone}`,
        `Address: ${address}`,
        `Employees: ${employees || "—"}`,
        `Annual revenue: ${annualRevenue || "—"}`,
        `Brands carried: ${brands || "—"}`,
        "",
        notes || "",
      ].join("\n"),
    });

    // 3. Confirm receipt with the applicant
    await mg.messages.create(process.env.MAILGUN_DOMAIN || "", {
      from: process.env.CONTACT_FROM_EMAIL || `EliteWorker Site <postmaster@${process.env.MAILGUN_DOMAIN}>`,
      to: contactEmail,
      subject: "We got your EliteWorker beta application",
      text: `Hi ${contactName},\n\nThanks for applying to the EliteWorker beta program on behalf of ${companyName}. We personally review every application and will follow up within 48 hours to let you know next steps.\n\n— The EliteWorker team`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Beta signup error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
