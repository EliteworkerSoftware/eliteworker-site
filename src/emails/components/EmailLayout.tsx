import { Head, Hr, Html, Img, Link, Preview, Section, Text } from "@react-email/components";
import type { ReactNode } from "react";
import { COLORS, LOGO_WHITE_URL, SITE_URL } from "../constants";

const FONT_STACK = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

// Shared shell for every outbound email. Many webmail clients (IONOS, Gmail,
// Outlook.com among them) strip the <body> tag's own styling and only keep
// inner content, so the full-bleed background + centering can't live on
// <Body> — it has to be an explicit 100%-wide table INSIDE the body content,
// with the card as a nested max-width table. This is the pattern that
// actually survives across clients instead of clipping/going stark white.
export function EmailLayout({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <body style={{ margin: 0, padding: 0, backgroundColor: COLORS.paperAlt, fontFamily: FONT_STACK }}>
        <table
          role="presentation"
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          style={{ borderCollapse: "collapse", backgroundColor: COLORS.paperAlt }}
        >
          <tbody>
            <tr>
              <td align="center" style={{ padding: "48px 16px" }}>
                <table
                  role="presentation"
                  width="100%"
                  cellPadding={0}
                  cellSpacing={0}
                  style={{
                    borderCollapse: "collapse",
                    maxWidth: 640,
                    backgroundColor: COLORS.paper,
                    borderRadius: 20,
                    overflow: "hidden",
                    border: `1px solid ${COLORS.line}`,
                  }}
                >
                  <tbody>
                    <tr>
                      <td>
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
                          <Text
                            style={{ margin: 0, fontSize: 12, lineHeight: "20px", color: COLORS.inkMuted, fontFamily: FONT_STACK }}
                          >
                            EliteWorker, LLC · PO Box 1025 · Marlton, NJ 08053
                          </Text>
                          <Text style={{ margin: "4px 0 0", fontSize: 12, lineHeight: "20px", fontFamily: FONT_STACK }}>
                            <Link href={SITE_URL} style={{ color: COLORS.brand }}>
                              eliteworker.com
                            </Link>
                          </Text>
                        </Section>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </Html>
  );
}

export { FONT_STACK };
