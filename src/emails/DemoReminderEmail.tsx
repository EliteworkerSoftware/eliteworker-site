import { Heading, Text } from "@react-email/components";
import { EmailLayout, FONT_STACK } from "./components/EmailLayout";
import { FieldList } from "./components/FieldList";
import { PillButton } from "./components/PillButton";
import { Spacer } from "./components/Spacer";
import { COLORS } from "./constants";

export function DemoReminderEmail({
  name,
  when,
  eventTitle,
  confirmUrl,
  rescheduleUrl,
}: {
  name: string;
  when: string;
  eventTitle?: string | null;
  confirmUrl: string;
  rescheduleUrl: string;
}) {
  const firstName = name.trim().split(/\s+/)[0] || name;

  return (
    <EmailLayout preview="Your EliteWorker demo is coming up — please confirm">
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
        Demo reminder
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
        See you soon, {firstName}?
      </Heading>

      <Text style={{ margin: "0 0 24px", fontFamily: FONT_STACK, fontSize: 16, lineHeight: "26px", color: COLORS.ink }}>
        Just confirming you&rsquo;re still good for your EliteWorker demo tomorrow — or grab a different time if
        something came up.
      </Text>

      <FieldList fields={[{ label: "When", value: when }, { label: "Event", value: eventTitle || "Demo" }]} />

      <Spacer height={28} />
      {/* Two-cell table, not two inline buttons — the reliable cross-client
          way to place block-level buttons side by side with a real gap
          (padding lives on the <td>, per the IONOS <table> padding bug). */}
      <table role="presentation" cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse", margin: "0 auto" }}>
        <tbody>
          <tr>
            <td style={{ paddingRight: 10 }}>
              <PillButton href={confirmUrl}>Confirm I&rsquo;ll be there</PillButton>
            </td>
            <td>
              <PillButton href={rescheduleUrl} variant="secondary">
                Reschedule
              </PillButton>
            </td>
          </tr>
        </tbody>
      </table>

      <Spacer height={28} />
      <Text style={{ margin: 0, fontFamily: FONT_STACK, fontSize: 13, lineHeight: "22px", color: COLORS.inkMuted }}>
        Need something else entirely? Just reply to this email and we&rsquo;ll sort it out.
      </Text>
    </EmailLayout>
  );
}

export default DemoReminderEmail;
