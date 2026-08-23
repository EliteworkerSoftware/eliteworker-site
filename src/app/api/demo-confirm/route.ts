import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyConfirmToken } from "@/lib/demoConfirmToken";

// A human clicks this from an email, so it renders a small standalone HTML
// page rather than JSON.
function page(title: string, body: string) {
  return new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">` +
      `<title>${title}</title><style>` +
      `body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;` +
      `background:#f7f9fc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a}` +
      `.card{background:#fff;border-radius:16px;padding:40px;max-width:420px;margin:24px;text-align:center;` +
      `box-shadow:0 20px 60px rgba(15,23,42,0.12)}h1{font-size:20px;margin:0 0 8px}p{color:#5b6472;margin:0;font-size:14px;line-height:1.5}` +
      `</style></head><body><div class="card"><h1>${title}</h1><p>${body}</p></div></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") || "";
  const bookingId = verifyConfirmToken(token);
  if (!bookingId) {
    return page(
      "Link expired or invalid",
      "This confirmation link isn&rsquo;t valid. If you still need to confirm, just reply to one of our emails and we&rsquo;ll take care of it."
    );
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("eliteworker_demo_bookings")
    .update({ pipeline_status: "confirm_2" })
    .eq("id", bookingId)
    .eq("pipeline_status", "confirm_1");

  if (error) {
    return page(
      "Something went wrong",
      "We couldn&rsquo;t record your confirmation. Please reply to one of our emails and we&rsquo;ll confirm manually."
    );
  }

  return page("You're confirmed!", "Thanks for confirming — we'll see you at your scheduled time.");
}
