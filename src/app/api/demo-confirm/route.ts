import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { verifyConfirmToken } from "@/lib/demoConfirmToken";
import { htmlResponsePage } from "@/lib/htmlResponsePage";

// A human clicks this from an email, so it renders a small standalone HTML
// page rather than JSON.
function page(title: string, body: string) {
  return htmlResponsePage(title, `<p>${body}</p>`);
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
