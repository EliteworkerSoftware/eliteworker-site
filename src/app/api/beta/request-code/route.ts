import { NextRequest, NextResponse } from "next/server";
import Mailgun from "mailgun.js";
import formData from "form-data";
import { createChallengeToken, generateCode } from "@/lib/emailVerification";
import { verifyTurnstile } from "@/lib/turnstile";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { email, turnstileToken } = await req.json();

    if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
    }

    const remoteIp = req.headers.get("x-forwarded-for");
    const isHuman = await verifyTurnstile(turnstileToken, remoteIp);
    if (!isHuman) {
      return NextResponse.json({ error: "Verification failed — please try again" }, { status: 400 });
    }

    const code = generateCode();
    const token = createChallengeToken(email, code);

    const mailgun = new Mailgun(formData);
    const mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY || "",
    });
    await mg.messages.create(process.env.MAILGUN_DOMAIN || "", {
      from: process.env.CONTACT_FROM_EMAIL || `EliteWorker Site <postmaster@${process.env.MAILGUN_DOMAIN}>`,
      to: email,
      subject: `Your EliteWorker verification code: ${code}`,
      text: `Your verification code is ${code}. It expires in 10 minutes.\n\nIf you didn't request this, you can ignore this email.`,
    });

    return NextResponse.json({ ok: true, token });
  } catch (err) {
    console.error("Request code error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
