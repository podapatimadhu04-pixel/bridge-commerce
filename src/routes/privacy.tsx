import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { ShieldCheck, Globe2, Lock, UserCog } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — OrbitMarket" },
      { name: "description", content: "How OrbitMarket collects, uses, and protects personal data across all regions we operate in, including GDPR, India DPDP, and CCPA rights." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const updated = "9 July 2026";
  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Last updated {updated}</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-3 text-muted-foreground">
          This page is maintained by OrbitMarket to answer common privacy and security questions
          about how personal data is handled on our global marketplace. It is written in plain
          language and reflects controls that are actually enabled in the product today. It is not
          an independent certification.
        </p>

        <div className="my-8 grid gap-3 sm:grid-cols-2">
          <Highlight icon={<ShieldCheck className="h-4 w-4" />} title="Data is encrypted">
            All traffic is served over HTTPS. Data at rest is encrypted by our infrastructure provider.
          </Highlight>
          <Highlight icon={<Lock className="h-4 w-4" />} title="Access is scoped">
            Row-level security means each account can only read and write its own profile, addresses and orders.
          </Highlight>
          <Highlight icon={<UserCog className="h-4 w-4" />} title="You are in control">
            Export or erase your data anytime from your <Link to="/account" className="underline">account</Link>.
          </Highlight>
          <Highlight icon={<Globe2 className="h-4 w-4" />} title="Global by design">
            Rights are honored worldwide, including GDPR (EU/UK), India DPDP, CCPA/CPRA (California), LGPD (Brazil), PIPEDA (Canada) and POPIA (South Africa).
          </Highlight>
        </div>

        <Section title="1. Who we are">
          OrbitMarket is a demonstration global marketplace operated by the app owner. If you have
          questions about your data, contact <a className="underline" href="mailto:privacy@orbitmarket.example">privacy@orbitmarket.example</a>.
        </Section>

        <Section title="2. What we collect">
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>Account data</strong>: email, full name, avatar (if you sign in with Google), phone, language and currency preferences.</li>
            <li><strong>Delivery data</strong>: shipping addresses you save and the country you deliver to.</li>
            <li><strong>Order data</strong>: cart contents, order codes, totals, and delivery status.</li>
            <li><strong>Consent records</strong>: which cookie categories you accepted, timestamp, and user agent, kept as a compliance audit trail.</li>
            <li><strong>Technical data</strong>: IP-derived approximate location and device information used only to run and secure the service.</li>
          </ul>
        </Section>

        <Section title="3. Why we use it (legal bases)">
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>To perform the contract when you place, deliver or track an order.</li>
            <li>With your consent, for optional analytics and marketing communications.</li>
            <li>For our legitimate interest in preventing fraud and keeping the service secure.</li>
            <li>To comply with legal obligations (tax records, lawful requests).</li>
          </ul>
        </Section>

        <Section title="4. Who processes it on our behalf">
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>Lovable Cloud</strong> — authentication, database and file storage (EU/US regions available).</li>
            <li><strong>Google</strong> — optional sign-in with Google. Google shares only the fields you consent to (email, name, avatar).</li>
            <li><strong>Delivery partners</strong> — city-specific couriers receive only the address and phone needed to complete your order.</li>
          </ul>
          These processors are contractually bound to handle your data only for the purpose we specify.
        </Section>

        <Section title="5. International transfers">
          Data may be transferred between the regions we operate in. Where required, we rely on the
          European Commission's Standard Contractual Clauses, the UK IDTA, or equivalent instruments
          in India and other jurisdictions. Rural or low-bandwidth users are served from the nearest
          edge region we support.
        </Section>

        <Section title="6. Retention">
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Profile, addresses: kept while your account is active. Erased within 30 days of an account deletion request.</li>
            <li>Order history: kept for up to 7 years where legally required for tax and consumer-protection records.</li>
            <li>Consent logs: kept for at least 24 months as evidence of your choice.</li>
          </ul>
        </Section>

        <Section title="7. Your rights">
          You may:
          <ul className="mt-2 list-disc pl-5 space-y-1 text-sm">
            <li>Access and download all data we hold about you.</li>
            <li>Correct or update your profile at any time.</li>
            <li>Erase your data, subject to legal retention obligations above.</li>
            <li>Withdraw consent for optional cookies or marketing.</li>
            <li>Object to processing or request restriction.</li>
            <li>Lodge a complaint with your local data protection authority.</li>
          </ul>
          Most of these can be exercised directly from your <Link to="/account" className="underline">account page</Link>.
        </Section>

        <Section title="8. Payments & consumer protection">
          Payments in this build are simulated for demonstration purposes. When live payments are enabled,
          card details are collected and processed exclusively by a PCI-DSS certified payment provider —
          OrbitMarket never sees or stores raw card numbers. Buyer protection covers refunds for
          undelivered or damaged orders in every country we ship to. Refund requests should be raised
          from the order screen within 14 days of delivery.
        </Section>

        <Section title="9. Cookies">
          We use strictly necessary cookies to keep you signed in and remember your language, currency
          and location. Optional analytics and marketing cookies are only set after you accept them
          in the consent banner. You can change your choice anytime by clearing the site data or
          re-visiting this page.
        </Section>

        <Section title="10. Children">
          OrbitMarket is not directed to children under 16. Where local law sets a higher age of
          consent (for example 18 in some Indian states), that higher age applies.
        </Section>

        <Section title="11. Contact & complaints">
          <p className="text-sm">
            Data protection contact: <a className="underline" href="mailto:privacy@orbitmarket.example">privacy@orbitmarket.example</a>
          </p>
          <p className="text-sm">
            If we cannot resolve your concern, you may contact your local supervisory authority (for example
            the ICO in the UK, your EU Member State DPA, the Data Protection Board of India, or the California
            Privacy Protection Agency).
          </p>
        </Section>
      </div>
    </AppLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-2 text-sm leading-6 text-foreground/90">{children}</div>
    </section>
  );
}

function Highlight({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-2 text-primary">{icon}<span className="text-sm font-semibold text-foreground">{title}</span></div>
      <p className="mt-1 text-xs text-muted-foreground">{children}</p>
    </div>
  );
}
