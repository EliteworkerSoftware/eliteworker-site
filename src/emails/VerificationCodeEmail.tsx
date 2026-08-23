import { Heading, Section, Text } from "@react-email/components";
import { EmailLayout, FONT_STACK } from "./components/EmailLayout";
import { COLORS } from "./constants";

export function VerificationCodeEmail({ code }: { code: string }) {
  return (
    <EmailLayout preview={`Your EliteWorker verification code is ${code}`}>
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
        Verify your email
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
        Here&rsquo;s your code
      </Heading>

      <Text style={{ margin: "0 0 24px", fontFamily: FONT_STACK, fontSize: 16, lineHeight: "26px", color: COLORS.ink }}>
        Enter this code to continue your EliteWorker beta application. It expires in 10 minutes.
      </Text>

      <Section
        style={{
          backgroundColor: COLORS.paperAlt,
          border: `1px solid ${COLORS.line}`,
          borderRadius: 14,
          padding: "24px",
          textAlign: "center",
        }}
      >
        <Text
          style={{
            margin: 0,
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: 40,
            fontWeight: 700,
            letterSpacing: "0.18em",
            color: COLORS.ink,
          }}
        >
          {code}
        </Text>
      </Section>

      <Text style={{ margin: "24px 0 0", fontFamily: FONT_STACK, fontSize: 13, lineHeight: "22px", color: COLORS.inkMuted }}>
        Didn&rsquo;t request this? You can safely ignore this email.
      </Text>
    </EmailLayout>
  );
}

export default VerificationCodeEmail;
