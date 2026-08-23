import { Section } from "@react-email/components";
import { COLORS } from "../constants";
import { FONT_STACK } from "./EmailLayout";

export type Field = { label: string; value: string };

// Renders a clean, bordered key/value block for structured notification data
// (lead details, booking info, etc.) instead of a wall of plain text lines.
export function FieldList({ fields }: { fields: Field[] }) {
  return (
    <Section
      style={{
        backgroundColor: COLORS.paperAlt,
        border: `1px solid ${COLORS.line}`,
        borderRadius: 14,
        padding: "4px 24px",
      }}
    >
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} style={{ borderCollapse: "collapse" }}>
        <tbody>
          {fields.map((field, i) => (
            <tr key={field.label} style={{ borderTop: i === 0 ? "none" : `1px solid ${COLORS.line}` }}>
              <td
                style={{
                  padding: "14px 0",
                  fontFamily: FONT_STACK,
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: COLORS.inkMuted,
                  verticalAlign: "top",
                  whiteSpace: "nowrap",
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
                }}
              >
                {field.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}
