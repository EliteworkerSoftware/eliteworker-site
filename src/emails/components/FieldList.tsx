import { COLORS } from "../constants";
import { FONT_STACK } from "./EmailLayout";

export type Field = { label: string; value: string };

// Renders a clean, bordered key/value block for structured notification data
// (lead details, booking info, etc.) instead of a wall of plain text lines.
// The card chrome (background/border/padding) lives on a <td>, not a <table>
// style — some webmail clients (IONOS desktop) don't apply those to <table>.
export function FieldList({ fields }: { fields: Field[] }) {
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <td
            style={{
              backgroundColor: COLORS.paperAlt,
              border: `1px solid ${COLORS.line}`,
              borderRadius: 14,
              padding: "4px 24px",
            }}
          >
            <table
              role="presentation"
              width="100%"
              cellPadding={0}
              cellSpacing={0}
              style={{ borderCollapse: "collapse", tableLayout: "fixed" }}
            >
              <tbody>
                {fields.map((field, i) => (
                  <tr key={field.label} style={{ borderTop: i === 0 ? "none" : `1px solid ${COLORS.line}` }}>
                    <td
                      width="35%"
                      style={{
                        padding: "14px 0",
                        fontFamily: FONT_STACK,
                        fontSize: 12,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: COLORS.inkMuted,
                        verticalAlign: "top",
                        paddingRight: 20,
                      }}
                    >
                      {field.label}
                    </td>
                    <td
                      style={{
                        padding: "14px 0",
                        fontFamily: FONT_STACK,
                        fontSize: 14,
                        lineHeight: "22px",
                        color: COLORS.ink,
                        textAlign: "right",
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      {field.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
