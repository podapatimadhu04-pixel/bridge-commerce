import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — OrbitMarket" },
      { name: "description", content: "The terms governing use of OrbitMarket's global marketplace for restaurants, groceries and wholesale electronics." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl px-4 py-10 text-sm leading-6">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Last updated 9 July 2026</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Terms of Service</h1>

        <h2 className="mt-8 text-lg font-semibold">1. Marketplace role</h2>
        <p className="mt-2">OrbitMarket is a marketplace connecting buyers with independent restaurants, grocery shops and wholesale electronics vendors. Each vendor is the seller of record for their listings; OrbitMarket facilitates discovery, ordering and delivery routing.</p>

        <h2 className="mt-6 text-lg font-semibold">2. Eligibility</h2>
        <p className="mt-2">You must be able to form a binding contract in your jurisdiction. Wholesale (B2B) purchases may require a valid business tax ID.</p>

        <h2 className="mt-6 text-lg font-semibold">3. Orders, pricing & taxes</h2>
        <p className="mt-2">Prices are shown in your selected currency and converted from vendor-listed prices. Applicable duties and taxes are calculated at checkout and remitted according to local law in the delivery country.</p>

        <h2 className="mt-6 text-lg font-semibold">4. Delivery & rural routing</h2>
        <p className="mt-2">Estimated delivery times depend on vendor location and route. For rural destinations, orders may be handed off to a last-mile partner and offline tracking updates are possible.</p>

        <h2 className="mt-6 text-lg font-semibold">5. Buyer protection & refunds</h2>
        <p className="mt-2">If your order is undelivered, damaged or materially different from the listing, you may request a refund from the order screen within 14 days of delivery. Perishable food refunds must be raised within 24 hours.</p>

        <h2 className="mt-6 text-lg font-semibold">6. Prohibited items</h2>
        <p className="mt-2">You may not use OrbitMarket to buy or sell restricted goods (weapons, controlled substances, counterfeit goods, wildlife products, etc.) or anything prohibited under applicable export or sanctions laws.</p>

        <h2 className="mt-6 text-lg font-semibold">7. Vendor obligations</h2>
        <p className="mt-2">Vendors warrant that their listings are accurate, that they hold all required licences (food safety, electrical compliance, etc.), and that they will fulfil orders in the promised timeframe.</p>

        <h2 className="mt-6 text-lg font-semibold">8. Liability</h2>
        <p className="mt-2">To the maximum extent permitted by law, OrbitMarket is not liable for indirect or consequential damages. Nothing here limits liability that cannot be limited under applicable consumer-protection law.</p>

        <h2 className="mt-6 text-lg font-semibold">9. Governing law</h2>
        <p className="mt-2">These terms are governed by the laws of the operating entity's principal place of business, without prejudice to any mandatory consumer rights in your country of residence.</p>

        <h2 className="mt-6 text-lg font-semibold">10. Contact</h2>
        <p className="mt-2">support@orbitmarket.example</p>
      </div>
    </AppLayout>
  );
}
