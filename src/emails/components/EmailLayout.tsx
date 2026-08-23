import { Head, Html, Img, Preview, Section } from "@react-email/components";
import type { ReactNode } from "react";
import { COLORS, LOGO_WHITE_URL } from "../constants";

const FONT_STACK = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

// Shared shell for every outbound email. The header and gradient stripe are
// full-bleed — they span the entire viewport edge-to-edge just like the real
// site's NavBar, unconstrained by any max-width. Only the text content below
// is capped to a comfortable reading width and centered within that band, so
// a wide desktop client doesn't get a header that stops short and looks boxed in.
export function EmailLayout({ preview, children }: { preview: string; children: ReactNode }) {
  return (
    <Html>
      <Head />
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
                <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse" }}>
                  <tbody>
                    <tr>
                      <td align="center" style={{ backgroundColor: COLORS.nav, padding: "44px 40px" }}>
                        <Img src={LOGO_WHITE_URL} width="180" height="27" alt="EliteWorker" style={{ margin: "0 auto" }} />
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse" }}>
                  <tbody>
                    <tr>
                      <td style={{ height: 4, fontSize: 0, lineHeight: 0, backgroundColor: COLORS.brandDark, width: "34%" }}>
                        &nbsp;
                      </td>
                      <td style={{ height: 4, fontSize: 0, lineHeight: 0, backgroundColor: COLORS.brand, width: "33%" }}>
                        &nbsp;
                      </td>
                      <td style={{ height: 4, fontSize: 0, lineHeight: 0, backgroundColor: COLORS.accent, width: "33%" }}>
                        &nbsp;
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table
                  role="presentation"
                  width="100%"
                  cellPadding={0}
                  cellSpacing={0}
                  style={{ borderCollapse: "collapse", maxWidth: 640, backgroundColor: COLORS.paper }}
                >
                  <tbody>
                    <tr>
                      <td>
                        <Section style={{ padding: "48px 40px", textAlign: "center" }}>{children}</Section>
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
