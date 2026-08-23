import { Heading, Text } from "@react-email/components";
import { EmailLayout, FONT_STACK } from "./components/EmailLayout";
import { COLORS } from "./constants";

export function VerificationCodeEmail({ code }: { code: string }) {
  const digits = code.split("");

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
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: COLORS.ink,
        }}
      >
        Here&rsquo;s your code
      </Heading>

      <Text style={{ margin: "0 0 28px", fontFamily: FONT_STACK, fontSize: 16, lineHeight: "26px", color: COLORS.ink }}>
        Enter this code to continue your EliteWorker beta application. It expires in 10 minutes.
      </Text>

      {/*
        Each digit lives in its own table cell rather than one continuous
        string — besides looking like a proper OTP input (far more premium
        than a plain number), this is what actually prevents some webmail
        clients from auto-detecting a long digit run as a phone number and
        underlining it (a meta tag alone isn't reliably honored everywhere).
      */}
      <table role="presentation" cellPadding={0} cellSpacing={0} style={{ borderCollapse: "separate", borderSpacing: "10px 0" }}>
        <tbody>
          <tr>
            {digits.map((digit, i) => (
              <td
                key={i}
                style={{
                  width: 52,
                  height: 64,
                  textAlign: "center",
                  verticalAlign: "middle",
                  backgroundColor: COLORS.paperAlt,
                  border: `2px solid ${COLORS.brand}`,
                  borderRadius: 12,
                  fontFamily: "'Courier New', Courier, monospace",
                  fontSize: 30,
                  fontWeight: 700,
                  color: COLORS.ink,
                }}
              >
                {digit}
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      <Text style={{ margin: "28px 0 0", fontFamily: FONT_STACK, fontSize: 13, lineHeight: "22px", color: COLORS.inkMuted }}>
        Didn&rsquo;t request this? You can safely ignore this email.
      </Text>
    </EmailLayout>
  );
}

export default VerificationCodeEmail;
