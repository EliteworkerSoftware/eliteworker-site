import { Heading, Text } from "@react-email/components";
import { EmailLayout, FONT_STACK } from "./components/EmailLayout";
import { PillButton } from "./components/PillButton";
import { Spacer } from "./components/Spacer";
import { COLORS, SITE_URL } from "./constants";

export function DemoCancelledEmail({ attendeeName, when }: { attendeeName: string; when: string }) {
  const firstName = attendeeName.trim().split(/\s+/)[0] || attendeeName;

  return (
    <EmailLayout preview="Your EliteWorker demo has been cancelled">
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
        Demo cancelled
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
        You&rsquo;re cancelled, {firstName}
      </Heading>

      <Text style={{ margin: "0 0 24px", fontFamily: FONT_STACK, fontSize: 16, lineHeight: "26px", color: COLORS.ink }}>
        Your demo scheduled for {when} has been cancelled and removed from our calendar. We&rsquo;ve attached an
        update to remove it from yours too.
      </Text>

      <Spacer height={8} />
      <PillButton href={`${SITE_URL}/demo`}>Book a new time</PillButton>
    </EmailLayout>
  );
}

export default DemoCancelledEmail;
