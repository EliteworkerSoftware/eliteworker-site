// Sends an SMS alert via Twilio's REST API directly (no SDK needed — it's a
// single form-encoded POST with basic auth). Soft-skips if not configured yet,
// same pattern as Turnstile, so this doesn't block anything before setup.
export async function sendAlertSms(body: string): Promise<void> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;
  const toNumber = process.env.ALERT_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber || !toNumber) {
    console.warn("Twilio env vars not set — skipping SMS alert");
    return;
  }

  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: toNumber, From: fromNumber, Body: body }),
    });
    if (!res.ok) {
      console.error("Twilio SMS error:", await res.text());
    }
  } catch (err) {
    console.error("Twilio SMS request failed:", err);
  }
}
