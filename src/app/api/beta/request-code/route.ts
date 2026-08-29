import { NextRequest, NextResponse } from "next/server";
import Mailgun from "mailgun.js";
import formData from "form-data";
import { render } from "@react-email/render";
import { createChallengeToken, generateCode } from "@/lib/emailVerification";
import { verifyTurnstile } from "@/lib/turnstile";
import { isValidEmail } from "@/lib/email";
import { VerificationCodeEmail } from "@/emails/VerificationCodeEmail";

export async function POST(req: NextRequest) {
  try {
    const { email, turnstileToken } = await req.json();

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
    }

    const remoteIp = req.headers.get("x-forwarded-for");
    const isHuman = await verifyTurnstile(turnstileToken, remoteIp);
    if (!isHuman) {
      return NextResponse.json({ error: "Verification failed — please try again" }, { status: 400 });
    }

    const code = generateCode();
    const token = createChallengeToken(email, code);

    const emailElement = VerificationCodeEmail({ code });
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
      to: email,
      subject: `Your EliteWorker verification code: ${code}`,
      html,
      text,
    });

    return NextResponse.json({ ok: true, token });
  } catch (err) {
    console.error("Request code error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
