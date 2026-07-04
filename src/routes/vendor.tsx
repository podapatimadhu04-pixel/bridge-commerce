import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/vendor")({
  head: () => ({
    meta: [
      { title: "Become a vendor — OrbitMarket" },
      { name: "description", content: "Onboard your restaurant, provision shop or electronics wholesale business to a global marketplace." },
    ],
  }),
  component: VendorPage,
});

function VendorPage() {
  return (
    <AppLayout>
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1fr_420px]">
        <div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Grow your business globally.</h1>
          <p className="mt-4 text-lg text-muted-foreground">Whether you run a village provision store, an inner-city ramen kitchen, or a wholesale electronics warehouse — OrbitMarket puts you on the map.</p>
          <ul className="mt-8 space-y-3">
            {[
              "Storefront with menus, inventory & bulk pricing tiers",
              "Automatic multi-language product descriptions",
              "Global logistics via pluggable 3PL connectors",
              "Multi-currency checkout with real-time FX",
              "Rural-ready, low-bandwidth vendor dashboard",
              "MOQ, RFQ and quotation workflows for wholesalers",
            ].map((f) => (
              <li key={f} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-success" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <form
          className="h-fit rounded-3xl border bg-card p-6 shadow-soft"
          onSubmit={(e) => { e.preventDefault(); toast.success("Application received. Our team will contact you within 48h."); (e.target as HTMLFormElement).reset(); }}
        >
          <h2 className="text-xl font-semibold">Vendor onboarding</h2>
          <p className="mt-1 text-sm text-muted-foreground">3 minute application.</p>
          <div className="mt-5 space-y-3">
            <div><Label>Business name</Label><Input required /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Country</Label><Input required placeholder="e.g. Kenya" /></div>
              <div><Label>City / Village</Label><Input required /></div>
            </div>
            <div>
              <Label>Business type</Label>
              <Select defaultValue="restaurant">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="restaurant">Restaurant / Food hotel</SelectItem>
                  <SelectItem value="grocery">Grocery / Provision shop</SelectItem>
                  <SelectItem value="electronics">Electronics wholesale</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Contact email</Label><Input type="email" required /></div>
            <div><Label>Tell us about your storefront</Label><Textarea rows={3} placeholder="Categories, MOQ, delivery range…" /></div>
            <Button type="submit" className="w-full" size="lg">Apply to sell</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
