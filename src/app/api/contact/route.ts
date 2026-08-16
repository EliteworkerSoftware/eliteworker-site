import { NextRequest, NextResponse } from "next/server";
import Mailgun from "mailgun.js";
import formData from "form-data";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { name, email, company, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Save the lead to Supabase so nothing is lost even if email fails
    const supabase = getSupabaseAdmin();
    const { error: dbError } = await supabase
      .from("eliteworker_leads")
      .insert({ name, email, company, message });

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
      subject: `New EliteWorker inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || "—"}\n\n${message}`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
