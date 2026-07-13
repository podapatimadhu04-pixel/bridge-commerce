import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { VendorCard } from "@/components/VendorCard";
import { ProductCard } from "@/components/ProductCard";
import { VENDORS, PRODUCTS, CATEGORIES, resolveProduct } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/groceries")({
  head: () => ({
    meta: [
      { title: "Groceries & Provisions — OrbitMarket" },
      { name: "description", content: "Fresh, dry and household provisions from local shops — urban and rural, everywhere." },
    ],
  }),
  component: GroceriesPage,
});

function GroceriesPage() {
  const { t, country } = useLocale();
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const vendors = VENDORS.filter((v) => v.type === "grocery");
  const products = PRODUCTS.filter((p) => p.kind === "grocery")
    .filter((p) => resolveProduct(p, country).available)
    .filter((p) => cat === "All" || p.category === cat)
    .filter((p) => !q || p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("groceries")}</h1>
          <p className="mt-2 text-muted-foreground">Provision shops from village markets to city grocers.</p>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          {vendors.map((v) => <VendorCard key={v.id} vendor={v} />)}
        </section>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Input placeholder={t("search_placeholder")} value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />
          <div className="ml-auto flex flex-wrap gap-1.5">
            {["All", ...CATEGORIES.grocery].map((c) => (
              <Button key={c} variant={cat === c ? "default" : "outline"} size="sm" onClick={() => setCat(c)}>{c}</Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </AppLayout>
  );
}
