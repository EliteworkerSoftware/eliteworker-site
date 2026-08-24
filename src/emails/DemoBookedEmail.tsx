import { Heading, Text } from "@react-email/components";
import { EmailLayout, FONT_STACK } from "./components/EmailLayout";
import { FieldList } from "./components/FieldList";
import { PillButton } from "./components/PillButton";
import { Spacer } from "./components/Spacer";
import { COLORS, SITE_URL } from "./constants";

export function DemoBookedEmail({
  attendeeName,
  attendeeEmail,
  when,
  eventTitle,
  notes,
}: {
  attendeeName: string;
  attendeeEmail: string;
  when: string;
  eventTitle?: string | null;
  notes?: string | null;
}) {
  return (
    <EmailLayout preview={`New demo booked with ${attendeeName}`}>
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
        New demo booked
      </Text>
      <Heading
        style={{
          margin: "0 0 24px",
          fontFamily: FONT_STACK,
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: COLORS.ink,
        }}
      >
        {attendeeName} booked a call
      </Heading>

      <FieldList
        fields={[
          { label: "Attendee", value: attendeeName },
          { label: "Email", value: attendeeEmail },
          { label: "When", value: when },
          { label: "Event", value: eventTitle || "—" },
        ]}
      />

      {notes && (
        <>
          <Spacer height={20} />
          <Text
            style={{
              margin: "0 0 4px",
              fontFamily: FONT_STACK,
              fontSize: 12,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: COLORS.inkMuted,
            }}
          >
            Notes from booker
          </Text>
          <Text style={{ margin: 0, fontFamily: FONT_STACK, fontSize: 15, lineHeight: "24px", color: COLORS.ink }}>{notes}</Text>
        </>
      )}

      <Spacer height={32} />
      <PillButton href={`${SITE_URL}/admin`}>View in dashboard</PillButton>
    </EmailLayout>
  );
}

export default DemoBookedEmail;
