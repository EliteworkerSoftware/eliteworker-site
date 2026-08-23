import { Heading, Section, Text } from "@react-email/components";
import { EmailLayout, FONT_STACK } from "./components/EmailLayout";
import { FieldList } from "./components/FieldList";
import { PillButton } from "./components/PillButton";
import { COLORS, SITE_URL } from "./constants";

export function BetaSignupEmail({
  companyName,
  contactName,
  contactEmail,
  phone,
  address,
  employees,
  annualRevenue,
  brands,
  notes,
}: {
  companyName: string;
  contactName: string;
  contactEmail: string;
  phone: string;
  address: string;
  employees?: string | null;
  annualRevenue?: string | null;
  brands?: string | null;
  notes?: string | null;
}) {
  return (
    <EmailLayout preview={`New beta signup from ${companyName}`}>
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
        New beta application
      </Text>
      <Heading
        style={{
          margin: "0 0 24px",
          fontFamily: FONT_STACK,
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: COLORS.ink,
        }}
      >
        {companyName}
      </Heading>

      <FieldList
        fields={[
          { label: "Contact", value: contactName },
          { label: "Email", value: contactEmail },
          { label: "Phone", value: phone },
          { label: "Address", value: address },
          { label: "Employees", value: employees || "—" },
          { label: "Revenue", value: annualRevenue || "—" },
          { label: "Brands carried", value: brands || "—" },
        ]}
      />

      {notes && (
        <Section style={{ marginTop: 20 }}>
          <Text
            style={{
              margin: "0 0 8px",
              fontFamily: FONT_STACK,
              fontSize: 12,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: COLORS.inkMuted,
            }}
          >
            Notes
          </Text>
          <Text style={{ margin: 0, fontFamily: FONT_STACK, fontSize: 15, lineHeight: "24px", color: COLORS.ink }}>
            {notes}
          </Text>
        </Section>
      )}

      <Section style={{ marginTop: 32 }}>
        <PillButton href={`${SITE_URL}/admin`}>View in dashboard</PillButton>
      </Section>
    </EmailLayout>
  );
}

export default BetaSignupEmail;
