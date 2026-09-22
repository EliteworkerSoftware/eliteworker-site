import { Heading, Text } from "@react-email/components";
import { EmailLayout, FONT_STACK } from "./components/EmailLayout";
import { FieldList } from "./components/FieldList";
import { PillButton } from "./components/PillButton";
import { Spacer } from "./components/Spacer";
import { COLORS } from "./constants";

// Attendee-facing confirmation for a fresh booking — separate from
// DemoBookedEmail (which is the internal team notification), same split as
// BetaSignupEmail (team) vs BetaConfirmationEmail (applicant). The .ics
// invite is attached at send time, not rendered here.
export function DemoConfirmationEmail({
  attendeeName,
  when,
  eventTitle,
  meetingUrl,
  cancelUrl,
  rescheduleUrl,
}: {
  attendeeName: string;
  when: string;
  eventTitle?: string | null;
  meetingUrl?: string | null;
  cancelUrl: string;
  rescheduleUrl: string;
}) {
  const firstName = attendeeName.trim().split(/\s+/)[0] || attendeeName;

  return (
    <EmailLayout preview="You're booked for your EliteWorker demo">
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
        Demo booked
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
        You&rsquo;re all set, {firstName}
      </Heading>

      <Text style={{ margin: "0 0 24px", fontFamily: FONT_STACK, fontSize: 16, lineHeight: "26px", color: COLORS.ink }}>
        We&rsquo;ve added your demo to our calendar and attached an invite to this email — open it to add it to yours.
      </Text>

      <FieldList
        fields={[
          { label: "When", value: when },
          { label: "Event", value: eventTitle || "Demo" },
          ...(meetingUrl ? [{ label: "Join link", value: meetingUrl }] : []),
        ]}
      />

      <Spacer height={28} />
      <div style={{ display: "inline-block", verticalAlign: "top", margin: "0 5px 10px" }}>
        <PillButton href={rescheduleUrl} variant="secondary">
          Reschedule
        </PillButton>
      </div>
      <div style={{ display: "inline-block", verticalAlign: "top", margin: "0 5px 10px" }}>
        <PillButton href={cancelUrl} variant="secondary">
          Cancel
        </PillButton>
      </div>

      <Spacer height={18} />
      <Text style={{ margin: 0, fontFamily: FONT_STACK, fontSize: 13, lineHeight: "22px", color: COLORS.inkMuted }}>
        Questions before then? Just reply to this email.
      </Text>
    </EmailLayout>
  );
}

export default DemoConfirmationEmail;
