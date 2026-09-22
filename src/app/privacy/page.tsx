import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How EliteWorker, LLC collects, uses, and protects your information, including our SMS messaging program.",
};

const updatedDate = "September 22, 2026";

function Section({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-28">
      <h2 className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink md:text-3xl">{title}</h2>
      <div className="mt-4 space-y-4 text-base leading-7 text-ink/70">{children}</div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <NavBar />

      <main>
        <section className="relative isolate border-b border-line bg-paper-alt">
          <div className="mx-auto max-w-4xl px-6 pt-20 text-center md:pt-28 pb-16 md:pb-20">
            <FadeIn>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand">Legal</p>
              <h1 className="mt-4 text-balance font-display text-4xl font-semibold tracking-[-0.03em] text-ink md:text-6xl">
                Privacy Policy
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-balance text-base leading-7 text-ink/60 md:text-lg">
                This page also includes our{" "}
                <a href="#terms" className="text-brand underline underline-offset-2">
                  Terms &amp; Conditions
                </a>
                . Last updated {updatedDate}.
              </p>
            </FadeIn>
          </div>
        </section>

        <section className="border-b border-line">
          <div className="mx-auto max-w-3xl px-6 py-16 md:py-24 space-y-14">
            <FadeIn className="space-y-4 text-base leading-7 text-ink/70">
              <p>
                EliteWorker, LLC (&ldquo;EliteWorker,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
                provides an operations platform for smart home and low-voltage integrators, along with the
                eliteworker.com website (together, the &ldquo;Services&rdquo;). This Privacy Policy explains what
                information we collect, how we use and share it, and the choices you have — including specific
                terms that govern our SMS/text messaging program.
              </p>
              <p>
                By using our Services or providing us with your information, you agree to the practices described
                in this Privacy Policy.
              </p>
            </FadeIn>

            <Section title="Information We Collect">
              <p>We collect information in the following ways:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <span className="font-semibold text-ink">Information you provide directly</span> — such as your
                  name, company name, email address, phone number, mailing address, and any other details you
                  submit through our contact form, beta signup form, demo booking widget, or by emailing or calling
                  us.
                </li>
                <li>
                  <span className="font-semibold text-ink">Information collected automatically</span> — such as IP
                  address, browser type, device information, pages visited, and referring URLs, collected through
                  cookies and similar technologies when you use our website.
                </li>
                <li>
                  <span className="font-semibold text-ink">Information from the EliteWorker platform</span> — if you
                  are a customer using the EliteWorker platform, we process the business, job, and contact data you
                  and your team enter into the platform in order to provide the Services.
                </li>
              </ul>
            </Section>

            <Section title="How We Use Your Information">
              <p>We use the information we collect to:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Provide, operate, and maintain our website and the EliteWorker platform;</li>
                <li>Schedule, confirm, remind, and follow up on demo bookings and appointments;</li>
                <li>Respond to inquiries, support requests, and beta applications;</li>
                <li>Send transactional communications, including appointment confirmations, reminders, and
                  service updates, by email, phone, or SMS text message where you have consented to receive them;
                </li>
                <li>Improve, secure, and troubleshoot our Services; and</li>
                <li>Comply with legal obligations.</li>
              </ul>
            </Section>

            <Section title="SMS / Text Messaging Program" id="sms">
              <p>
                EliteWorker offers customers and prospective customers the option to receive SMS text messages
                regarding appointments, proposals, scheduling, and service updates (the &ldquo;SMS Program&rdquo;).
              </p>
              <p>
                <span className="font-semibold text-ink">Consent.</span> You are enrolled in the SMS Program only
                after you provide consent. Today, consent is collected verbally during a phone or in-person
                interaction: our team asks for your consent using the script below, and once you agree, that
                consent is recorded in the EliteWorker platform. Text messages are only sent to a phone number
                after consent has been recorded for that number.
              </p>
              <p className="rounded-2xl border border-line bg-paper-alt px-5 py-4 text-ink/80 italic">
                &ldquo;Would you like to receive text message updates from EliteWorker regarding your appointments,
                proposals, scheduling, and service updates? Message frequency varies. Message and data rates may
                apply. You can reply STOP at any time to opt out or HELP for help.&rdquo;
              </p>
              <p>
                <span className="font-semibold text-ink">Message frequency.</span> Message frequency varies based
                on your appointments and interactions with us. Message and data rates may apply.
              </p>
              <p>
                <span className="font-semibold text-ink">Opting out.</span> You can opt out of the SMS Program at
                any time by replying <span className="font-semibold text-ink">STOP</span> to any message you
                receive from us. After you opt out, we will send you a final confirmation message. Reply{" "}
                <span className="font-semibold text-ink">HELP</span> to any message for assistance, or contact us
                at{" "}
                <a href="mailto:contact@eliteworker.com" className="text-brand underline underline-offset-2">
                  contact@eliteworker.com
                </a>
                .
              </p>
              <p>
                <span className="font-semibold text-ink">Carriers.</span> Carriers are not liable for delayed or
                undelivered messages. T-Mobile is not liable for delayed or undelivered messages.
              </p>
              <p className="font-semibold text-ink">
                We do not sell or share your SMS opt-in data or personal information with third parties for
                marketing purposes.
              </p>
              <p>
                Mobile information is used solely for sending the SMS communications described above and will not
                be shared with third parties or affiliates for marketing or promotional purposes.
              </p>
            </Section>

            <Section title="Cookies &amp; Similar Technologies">
              <p>
                We use cookies and similar technologies to operate our website, remember your preferences, and
                understand how visitors use our site. You can control cookies through your browser settings;
                disabling cookies may affect how parts of our website function.
              </p>
            </Section>

            <Section title="How We Share Information">
              <p>We do not sell your personal information. We may share information with:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  Service providers who help us operate our Services — such as calendar scheduling, email delivery,
                  and SMS delivery providers — under obligations to protect your information;
                </li>
                <li>Professional advisors, such as legal or accounting firms, where necessary; and</li>
                <li>Authorities where required by law or to protect our rights and the safety of others.</li>
              </ul>
              <p className="font-semibold text-ink">
                We do not sell or share your SMS opt-in data or personal information with third parties for
                marketing purposes.
              </p>
            </Section>

            <Section title="Data Security">
              <p>
                We use reasonable administrative, technical, and physical safeguards designed to protect your
                information. No method of transmission or storage is completely secure, and we cannot guarantee
                absolute security.
              </p>
            </Section>

            <Section title="Your Choices">
              <p>
                You may opt out of SMS messages at any time by replying STOP, and you may unsubscribe from
                marketing emails using the link in those emails. You may also contact us at{" "}
                <a href="mailto:contact@eliteworker.com" className="text-brand underline underline-offset-2">
                  contact@eliteworker.com
                </a>{" "}
                to ask us to access, correct, or delete the personal information we hold about you, subject to
                applicable law.
              </p>
            </Section>

            <Section title="Children's Privacy">
              <p>
                Our Services are intended for business use and are not directed to individuals under the age of
                18. We do not knowingly collect personal information from children.
              </p>
            </Section>

            <Section title="Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo; date at the top
                of this page reflects the most recent changes. Material changes will be reflected by updating this
                page.
              </p>
            </Section>
          </div>
        </section>

        <section className="border-b border-line bg-paper-alt">
          <div className="mx-auto max-w-3xl px-6 py-16 md:py-24 space-y-14">
            <FadeIn>
              <h1
                id="terms"
                className="scroll-mt-28 text-balance font-display text-3xl font-semibold tracking-[-0.03em] text-ink md:text-5xl"
              >
                Terms &amp; Conditions
              </h1>
              <p className="mt-4 text-base leading-7 text-ink/60">Last updated {updatedDate}.</p>
            </FadeIn>

            <Section title="Acceptance of Terms">
              <p>
                These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your use of the eliteworker.com website
                and the EliteWorker platform operated by EliteWorker, LLC. By accessing our website, booking a
                demo, applying for our beta program, or using the EliteWorker platform, you agree to these Terms.
                If you do not agree, please do not use our Services.
              </p>
            </Section>

            <Section title="Use of Our Services">
              <p>
                You agree to use our Services only for lawful purposes and in accordance with these Terms. You are
                responsible for the accuracy of the information you provide to us, including contact information
                used for scheduling and communications.
              </p>
            </Section>

            <Section title="SMS Program Terms" id="sms-terms">
              <p>
                By providing your phone number and consenting to receive text messages as described in our{" "}
                <a href="#sms" className="text-brand underline underline-offset-2">
                  SMS / Text Messaging Program
                </a>{" "}
                section above, you agree to receive recurring SMS messages from EliteWorker regarding
                appointments, proposals, scheduling, and service updates. Message frequency varies. Message and
                data rates may apply. Reply STOP to opt out at any time, or HELP for help. Carriers are not liable
                for delayed or undelivered messages. Consent to receive SMS messages is not a condition of
                purchasing any goods or services.
              </p>
            </Section>

            <Section title="Intellectual Property">
              <p>
                All content on our website and platform, including text, graphics, logos, and software, is the
                property of EliteWorker, LLC or its licensors and is protected by intellectual property laws. You
                may not copy, reproduce, or distribute our content without our prior written consent.
              </p>
            </Section>

            <Section title="Disclaimers">
              <p>
                Our Services are provided &ldquo;as is&rdquo; without warranties of any kind, whether express or
                implied. We do not guarantee that our Services will be uninterrupted, error-free, or secure.
              </p>
            </Section>

            <Section title="Limitation of Liability">
              <p>
                To the fullest extent permitted by law, EliteWorker, LLC will not be liable for any indirect,
                incidental, special, or consequential damages arising out of or related to your use of our
                Services.
              </p>
            </Section>

            <Section title="Governing Law">
              <p>
                These Terms are governed by the laws of the State of New Jersey, without regard to its conflict of
                law principles.
              </p>
            </Section>

            <Section title="Changes to These Terms">
              <p>
                We may update these Terms from time to time. Continued use of our Services after changes are
                posted constitutes your acceptance of the updated Terms.
              </p>
            </Section>

            <Section title="Contact Us">
              <p>Questions about this Privacy Policy or these Terms can be sent to:</p>
              <p>
                EliteWorker, LLC
                <br />
                PO Box 1025
                <br />
                Marlton, NJ 08053
                <br />
                <a href="mailto:contact@eliteworker.com" className="text-brand underline underline-offset-2">
                  contact@eliteworker.com
                </a>
              </p>
              <p>
                Have another question?{" "}
                <Link href="/contact" className="text-brand underline underline-offset-2">
                  Contact us
                </Link>
                .
              </p>
            </Section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
