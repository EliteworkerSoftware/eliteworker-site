import { Head, Hr, Html, Img, Link, Preview, Section, Text } from "@react-email/components";
import type { ReactNode } from "react";
import { COLORS, LOGO_WHITE_URL, SITE_URL } from "../constants";

const FONT_STACK = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

// Shared shell for every outbound email. Fluid, edge-to-edge — no boxed
// card floating on a differently-colored canvas. The outer wrapper and the
// content share the same background, so there's no "grey border" effect;
// it just fills whatever width the viewer's reading pane actually is, up to
// a generous cap that only kicks in on very wide windows to keep line
// lengths readable.
export function EmailLayout({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <Html>
      <Head>
        {/* Some webmail clients (IONOS included) auto-detect long digit
            sequences as phone numbers and style/underline them as links —
            this is what causes stray lines through things like a verification
            code. Turn that off explicitly. */}
        <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
      </Head>
      <Preview>{preview}</Preview>
      <body style={{ margin: 0, padding: 0, backgroundColor: COLORS.paper, fontFamily: FONT_STACK }}>
        <table
          role="presentation"
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          style={{ borderCollapse: "collapse", backgroundColor: COLORS.paper }}
        >
          <tbody>
            <tr>
              <td align="center">
                <table
                  role="presentation"
                  width="100%"
                  cellPadding={0}
                  cellSpacing={0}
                  style={{ borderCollapse: "collapse", maxWidth: 960, backgroundColor: COLORS.paper }}
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

                        <Section style={{ backgroundColor: COLORS.nav, padding: "44px 32px" }}>
                          <Img src={LOGO_WHITE_URL} width="170" height="26" alt="EliteWorker" />
                        </Section>

                        <Section style={{ padding: "40px 32px" }}>{children}</Section>

                        <Hr style={{ borderColor: COLORS.line, margin: 0 }} />

                        <Section style={{ padding: "20px 32px" }}>
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
