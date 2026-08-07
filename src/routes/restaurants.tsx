import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { VendorCard } from "@/components/VendorCard";
import { ProductCard } from "@/components/ProductCard";
import { VENDORS, PRODUCTS, CATEGORIES, resolveProduct } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n";

export const Route = createFileRoute("/restaurants")({
  head: () => ({
    meta: [
      { title: "Restaurants & Food Hotels — OrbitMarket" },
      { name: "description", content: "Order from restaurants and food hotels worldwide, from Mumbai to Rome to Tokyo." },
    ],
  }),
  component: RestaurantsPage,
});

function RestaurantsPage() {
  const { t, country } = useLocale();
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");
  const vendors = VENDORS.filter((v) => v.type === "restaurant");
  const products = PRODUCTS.filter((p) => p.kind === "food")
    .filter((p) => resolveProduct(p, country).available)
    .filter((p) => cat === "All" || p.category === cat)
    .filter((p) => !q || p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("restaurants")}</h1>
          <p className="mt-2 text-muted-foreground">Explore chef-run kitchens and neighborhood cafés around the world.</p>
        </header>

        <section className="mb-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {vendors
            .filter((v) => !q || `${v.name} ${v.city} ${v.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase()))
            .map((v) => <VendorCard key={v.id} vendor={v} />)}
        </section>


        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Input
            placeholder={t("search_placeholder")}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-sm"
          />
          <div className="ml-auto flex flex-wrap gap-1.5">
            {["All", ...CATEGORIES.food].map((c) => (
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
