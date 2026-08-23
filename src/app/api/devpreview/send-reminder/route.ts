import { sendDemoReminderEmail } from "@/lib/sendDemoReminderEmail";

export async function GET() {
  await sendDemoReminderEmail({
    to: "etheaters@gmail.com",
    name: "Jane Prospect",
    when: "Tuesday, August 25, 2026 at 11:30 AM",
    eventTitle: "30 Min Demo",
    confirmUrl: "https://www.eliteworker.com/api/demo-confirm?token=demo-preview-token",
    rescheduleUrl: "https://cal.com/eliteworker/30min?rescheduleUid=demo-preview-uid",
  });
  return new Response("sent");
}
