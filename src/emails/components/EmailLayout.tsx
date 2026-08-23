import { Head, Html, Img, Preview, Section } from "@react-email/components";
import type { ReactNode } from "react";
import { COLORS, LOGO_WHITE_SOLID_URL } from "../constants";

const FONT_STACK = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

// Shared shell for every outbound email. Fluid, edge-to-edge — no boxed card
// floating on a differently-colored canvas. Header is a full gradient hero
// band (mirroring the site's own brand-to-accent gradient treatment) rather
// than a thin corporate bar, so it reads as a real designed page rather than
// a plain notification.
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
                        <table
                          role="presentation"
                          width="100%"
                          cellPadding={0}
                          cellSpacing={0}
                          style={{
                            borderCollapse: "collapse",
                            backgroundColor: COLORS.brandDark,
                            backgroundImage: `linear-gradient(100deg, ${COLORS.brandDark} 10%, ${COLORS.brand} 55%, ${COLORS.accent} 100%)`,
                          }}
                        >
                          <tbody>
                            <tr>
                              <td style={{ padding: "60px 40px" }}>
                                <Img src={LOGO_WHITE_SOLID_URL} width="190" height="29" alt="EliteWorker" />
                              </td>
                            </tr>
                          </tbody>
                        </table>

                        <Section style={{ padding: "48px 40px" }}>{children}</Section>
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
