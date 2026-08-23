import { Heading, Text } from "@react-email/components";
import { EmailLayout, FONT_STACK } from "./components/EmailLayout";
import { COLORS } from "./constants";

export function BetaConfirmationEmail({
  contactName,
  companyName,
}: {
  contactName: string;
  companyName: string;
}) {
  const firstName = contactName.trim().split(/\s+/)[0] || contactName;

  return (
    <EmailLayout preview="We got your EliteWorker beta application">
      <Text
        style={{
          margin: "0 0 4px",
          fontFamily: FONT_STACK,
          fontSize: 12,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: COLORS.brand,
        }}
      >
        Application received
      </Text>
      <Heading
        style={{
          margin: "0 0 20px",
          fontFamily: FONT_STACK,
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: COLORS.ink,
        }}
      >
        Thanks, {firstName}.
      </Heading>

      <Text style={{ margin: "0 0 16px", fontFamily: FONT_STACK, fontSize: 16, lineHeight: "26px", color: COLORS.ink }}>
        We got your beta application on behalf of <strong>{companyName}</strong>. We personally review every
        application — no automated gatekeeping — and we&rsquo;re actively reviewing yours now. We&rsquo;ll be in
        touch soon with next steps.
      </Text>
      <Text style={{ margin: 0, fontFamily: FONT_STACK, fontSize: 16, lineHeight: "26px", color: COLORS.ink }}>
        In the meantime, if anything changes on your end or you think of details worth adding, just reply to this
        email — it comes straight to us.
      </Text>

      <Text
        style={{
          margin: "32px 0 0",
          fontFamily: FONT_STACK,
          fontSize: 16,
          lineHeight: "26px",
          color: COLORS.ink,
        }}
      >
        — The EliteWorker team
      </Text>
    </EmailLayout>
  );
}

export default BetaConfirmationEmail;
