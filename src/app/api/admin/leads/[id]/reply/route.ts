import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/currentAdmin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { sendLeadReplyEmail } from "@/lib/leadReply";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getCurrentAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const { message } = await req.json();
  if (typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Reply message is required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data: lead, error: leadError } = await supabase
    .from("eliteworker_leads")
    .select("name, email")
    .eq("id", id)
    .single();

  if (leadError || !lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  try {
    await sendLeadReplyEmail({ to: lead.email, name: lead.name, message });
  } catch (err) {
    console.error("Lead reply email error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  const { data: reply, error: insertError } = await supabase
    .from("eliteworker_lead_replies")
    .insert({ lead_id: id, admin_id: admin.id, admin_name: admin.full_name || admin.email, message })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, reply });
}
