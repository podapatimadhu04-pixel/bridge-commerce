import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { VendorCard } from "@/components/VendorCard";
import { ProductCard } from "@/components/ProductCard";
import { VENDORS, PRODUCTS } from "@/lib/mock-data";
import { useLocale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe2, Languages, Wallet, Wifi, UtensilsCrossed, ShoppingBasket, Cpu, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OrbitMarket — Discover local. Deliver global." },
      { name: "description", content: "A global marketplace for restaurants, groceries and wholesale electronics, connecting urban and rural users in 7 languages and multi-currency." },
    ],
  }),
  component: Home,
});

function Home() {
  const { t, location } = useLocale();
  const featuredVendors = VENDORS.slice(0, 6);
  const featuredElectronics = PRODUCTS.filter((p) => p.kind === "electronics").slice(0, 4);
  const featuredFood = PRODUCTS.filter((p) => p.kind === "food").slice(0, 4);

  return (
    <AppLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.15),transparent_40%),radial-gradient(circle_at_80%_90%,rgba(255,255,255,0.1),transparent_45%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-24">
          <div className="max-w-2xl text-primary-foreground">
            <p className="text-sm font-medium opacity-90">{t("tagline")}</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              {t("hero_title")}
            </h1>
            <p className="mt-4 max-w-xl text-base opacity-90 sm:text-lg">{t("hero_sub")}</p>

            <div className="mt-8 flex max-w-xl items-center gap-2 rounded-2xl bg-background/95 p-2 shadow-soft backdrop-blur">
              <Search className="ml-2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("search_placeholder")}
                className="border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
              <Button size="sm">Search</Button>
            </div>

            <div className="mt-4 text-xs text-primary-foreground/80">
              Delivering to <span className="font-semibold">{location}</span>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              <Button asChild size="lg" variant="secondary">
                <Link to="/restaurants"><UtensilsCrossed className="mr-2 h-4 w-4" />{t("restaurants")}</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/groceries"><ShoppingBasket className="mr-2 h-4 w-4" />{t("groceries")}</Link>
              </Button>
              <Button asChild size="lg" className="bg-brand text-brand-foreground hover:bg-brand/90">
                <Link to="/electronics"><Cpu className="mr-2 h-4 w-4" />{t("electronics")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Value strip */}
      <section className="border-b bg-muted/30">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:grid-cols-4">
          {[
            { icon: Globe2, label: t("global_logistics") },
            { icon: Languages, label: t("live_translate") },
            { icon: Wallet, label: t("multi_currency") },
            { icon: Wifi, label: t("rural_ready") },
          ].map((f) => (
            <div key={f.label} className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-background shadow-soft">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium">{f.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured vendors */}
      <Section title={`${t("featured")} · ${t("near_you")}`} href="/restaurants">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredVendors.map((v) => <VendorCard key={v.id} vendor={v} />)}
        </div>
      </Section>

      {/* Food carousel */}
      <Section title={t("restaurants")} href="/restaurants">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {featuredFood.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </Section>

      {/* Electronics wholesale */}
      <Section title={t("electronics")} href="/electronics">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredElectronics.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </Section>

      {/* Vendor CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="overflow-hidden rounded-3xl border bg-card p-8 shadow-soft sm:p-12">
          <div className="grid gap-6 sm:grid-cols-2 sm:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Sell everywhere. Ship anywhere.</h2>
              <p className="mt-3 text-muted-foreground">
                Onboard your restaurant, provision shop, or electronics wholesale in minutes. Reach customers from the next village to the next continent.
              </p>
            </div>
            <div className="flex sm:justify-end">
              <Button asChild size="lg">
                <Link to="/vendor">{t("vendor_onboard")}<ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}

function Section({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  const { t } = useLocale();
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        <Link to={href} className="text-sm font-medium text-primary hover:underline">{t("view_all")} →</Link>
      </div>
      {children}
    </section>
  );
}
