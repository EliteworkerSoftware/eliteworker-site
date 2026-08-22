import { NextRequest, NextResponse } from "next/server";
import { createVerifiedToken, verifyChallengeToken } from "@/lib/emailVerification";

export async function POST(req: NextRequest) {
  try {
    const { token, code } = await req.json();

    if (!token || !code) {
      return NextResponse.json({ error: "Enter the code we emailed you" }, { status: 400 });
    }

    const email = verifyChallengeToken(token, String(code).trim());
    if (!email) {
      return NextResponse.json({ error: "That code is invalid or expired" }, { status: 400 });
    }

    return NextResponse.json({ ok: true, verifiedToken: createVerifiedToken(email), email });
  } catch (err) {
    console.error("Verify code error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
