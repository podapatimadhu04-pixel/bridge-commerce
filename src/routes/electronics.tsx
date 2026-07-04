import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { VendorCard } from "@/components/VendorCard";
import { ProductCard } from "@/components/ProductCard";
import { VENDORS, PRODUCTS, CATEGORIES } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileQuestion } from "lucide-react";

export const Route = createFileRoute("/electronics")({
  head: () => ({
    meta: [
      { title: "Wholesale Electronics & Appliances — OrbitMarket" },
      { name: "description", content: "B2B marketplace for ACs, refrigerators, coolers, fans, tube lights, TVs and water motors. Bulk pricing, MOQ, global shipping." },
    ],
  }),
  component: ElectronicsPage,
});

function ElectronicsPage() {
  const { t, fx } = useLocale();
  const { add } = useCart();
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const vendors = VENDORS.filter((v) => v.type === "electronics");
  const products = PRODUCTS.filter((p) => p.kind === "electronics")
    .filter((p) => cat === "All" || p.category === cat)
    .filter((p) => !q || p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("electronics")}</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">Bulk pricing tiers, MOQ logic and RFQ workflows for global wholesale buyers.</p>
          </div>
          <QuoteDialog />
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-2">
          {vendors.map((v) => <VendorCard key={v.id} vendor={v} />)}
        </section>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Input placeholder={t("search_placeholder")} value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
          <div className="ml-auto flex flex-wrap gap-1.5">
            {["All", ...CATEGORIES.electronics].map((c) => (
              <Button key={c} variant={cat === c ? "default" : "outline"} size="sm" onClick={() => setCat(c)}>{c}</Button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <div key={p.id} className="space-y-3">
              <ProductCard product={p} />
              {p.bulkTiers && (
                <div className="rounded-xl border bg-card p-3 text-xs shadow-soft">
                  <p className="mb-2 font-semibold uppercase tracking-wider text-muted-foreground">Bulk tiers</p>
                  <div className="space-y-1">
                    {p.bulkTiers.map((tier) => (
                      <div key={tier.qty} className="flex items-center justify-between">
                        <span className="text-muted-foreground">≥ {tier.qty} units</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{fx(tier.priceUsd)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => { add(p.id, tier.qty); toast.success(`Added ${tier.qty} × ${p.name}`); }}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

function QuoteDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><FileQuestion className="mr-2 h-4 w-4" />Request wholesale quote</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Wholesale Quotation Request</DialogTitle>
        </DialogHeader>
        <form
          className="space-y-3"
          onSubmit={(e) => { e.preventDefault(); setOpen(false); toast.success("Quote request submitted. Vendors will respond within 24h."); }}
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><Label>Company</Label><Input required placeholder="Your business name" /></div>
            <div><Label>Country</Label><Input required placeholder="IN, US, AE…" /></div>
            <div><Label>Contact email</Label><Input required type="email" /></div>
            <div><Label>Product</Label><Input required placeholder="e.g. 1.5T Split AC" /></div>
            <div><Label>Quantity</Label><Input required type="number" min={1} defaultValue={50} /></div>
          </div>
          <div><Label>Specifications / notes</Label><Textarea rows={3} placeholder="Voltage, warranty, certifications, packaging, target port…" /></div>
          <DialogFooter><Button type="submit">Send RFQ</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
