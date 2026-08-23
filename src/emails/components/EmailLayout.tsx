import { Body, Container, Head, Hr, Html, Img, Link, Preview, Section, Text } from "@react-email/components";
import type { ReactNode } from "react";
import { COLORS, LOGO_WHITE_URL, SITE_URL } from "../constants";

const FONT_STACK = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

// Shared shell for every outbound email — dark header with the logo (matching
// the site's nav bar), a tri-color accent stripe (echoing the gradient
// headline treatment used across the site), a white content card, and a
// consistent footer. The card caps at 600px (the readable-width standard for
// email) but sits on a full-bleed tinted background so it never looks like a
// tiny box floating in a stark white void on a wide screen.
export function EmailLayout({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: COLORS.paperAlt, margin: 0, padding: "48px 16px", fontFamily: FONT_STACK }}>
        <Container
          style={{
            maxWidth: 600,
            margin: "0 auto",
            backgroundColor: COLORS.paper,
            borderRadius: 20,
            overflow: "hidden",
            border: `1px solid ${COLORS.line}`,
          }}
        >
          <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ height: 5, fontSize: 0, lineHeight: 0, backgroundColor: COLORS.brandDark, width: "34%" }}>
                  &nbsp;
                </td>
                <td style={{ height: 5, fontSize: 0, lineHeight: 0, backgroundColor: COLORS.brand, width: "33%" }}>
                  &nbsp;
                </td>
                <td style={{ height: 5, fontSize: 0, lineHeight: 0, backgroundColor: COLORS.accent, width: "33%" }}>
                  &nbsp;
                </td>
              </tr>
            </tbody>
          </table>

          <Section style={{ backgroundColor: COLORS.nav, padding: "26px 40px" }}>
            <Img src={LOGO_WHITE_URL} width="150" height="23" alt="EliteWorker" />
          </Section>

          <Section style={{ padding: "40px" }}>{children}</Section>

          <Hr style={{ borderColor: COLORS.line, margin: 0 }} />

          <Section style={{ padding: "24px 40px" }}>
            <Text style={{ margin: 0, fontSize: 12, lineHeight: "20px", color: COLORS.inkMuted, fontFamily: FONT_STACK }}>
              EliteWorker, LLC · PO Box 1025 · Marlton, NJ 08053
            </Text>
            <Text style={{ margin: "4px 0 0", fontSize: 12, lineHeight: "20px", fontFamily: FONT_STACK }}>
              <Link href={SITE_URL} style={{ color: COLORS.brand }}>
                eliteworker.com
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export { FONT_STACK };
