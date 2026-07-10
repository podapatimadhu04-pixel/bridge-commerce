import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { useCart } from "@/lib/cart";
import { useLocale } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { placeOrder } from "@/lib/orders.functions";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Truck,
  ShieldCheck,
  AlertTriangle,
  TrendingDown,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useMemo } from "react";
import type { Product } from "@/lib/mock-data";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — OrbitMarket" }] }),
  component: CartPage,
});

type TierInfo = {
  unitUsd: number;
  currentTierQty: number | null;
  nextTier: { qty: number; priceUsd: number } | null;
  savingsPerUnitUsd: number;
};

function computeTier(product: Product, qty: number): TierInfo {
  let unitUsd = product.priceUsd;
  let currentTierQty: number | null = null;
  let nextTier: { qty: number; priceUsd: number } | null = null;

  if (product.bulkTiers && product.bulkTiers.length > 0) {
    const sorted = [...product.bulkTiers].sort((a, b) => a.qty - b.qty);
    for (const tier of sorted) {
      if (qty >= tier.qty) {
        unitUsd = tier.priceUsd;
        currentTierQty = tier.qty;
      } else if (!nextTier) {
        nextTier = tier;
      }
    }
    const savings = nextTier ? unitUsd - nextTier.priceUsd : 0;
    return { unitUsd, currentTierQty, nextTier, savingsPerUnitUsd: Math.max(0, savings) };
  }
  return { unitUsd, currentTierQty, nextTier, savingsPerUnitUsd: 0 };
}

function CartPage() {
  const { t, fx } = useLocale();
  const { detailed, setQty, remove, clear, count } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();
  const submitOrder = useServerFn(placeOrder);

  // Recompute totals + validation from tier logic
  const analysis = useMemo(() => {
    const lines = detailed.map(({ product, qty }) => {
      const tier = computeTier(product, qty);
      const moqShortfall = product.moq && qty < product.moq ? product.moq - qty : 0;
      return {
        product,
        qty,
        ...tier,
        lineUsd: Number((tier.unitUsd * qty).toFixed(2)),
        moqShortfall,
      };
    });
    const subtotalUsd = Number(lines.reduce((a, l) => a + l.lineUsd, 0).toFixed(2));
    const shippingUsd = subtotalUsd > 0 ? Number(Math.max(4.99, subtotalUsd * 0.03).toFixed(2)) : 0;
    const taxUsd = Number((subtotalUsd * 0.08).toFixed(2));
    const totalUsd = Number((subtotalUsd + shippingUsd + taxUsd).toFixed(2));
    const violations = lines.filter((l) => l.moqShortfall > 0);
    return { lines, subtotalUsd, shippingUsd, taxUsd, totalUsd, violations };
  }, [detailed]);

  const canCheckout = analysis.violations.length === 0 && count > 0;

  if (count === 0) {
    return (
      <AppLayout>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h1 className="text-2xl font-bold">{t("empty_cart")}</h1>
          <p className="mt-2 text-muted-foreground">Explore restaurants, provisions and wholesale electronics.</p>
          <Button asChild className="mt-6"><Link to="/">{t("continue_shopping")}</Link></Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[1fr_360px]">
        <div>
          <h1 className="mb-6 text-3xl font-bold tracking-tight">{t("cart")}</h1>

          {analysis.violations.length > 0 && (
            <div className="mb-4 flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              <div>
                <p className="font-medium text-destructive">
                  {analysis.violations.length} item{analysis.violations.length > 1 ? "s" : ""} below minimum order quantity
                </p>
                <p className="mt-0.5 text-muted-foreground">
                  Wholesale items need to meet MOQ before checkout. Adjust quantities highlighted below.
                </p>
              </div>
            </div>
          )}

          <div className="divide-y rounded-2xl border bg-card shadow-soft">
            {analysis.lines.map((line) => {
              const { product, qty, unitUsd, currentTierQty, nextTier, savingsPerUnitUsd, lineUsd, moqShortfall } = line;
              const hasTiers = !!product.bulkTiers && product.bulkTiers.length > 0;
              return (
                <div key={product.id} className="flex gap-4 p-4">
                  <img src={product.image} alt={product.name} className="h-24 w-24 rounded-lg object-cover" loading="lazy" />
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{product.category}</p>
                        <h3 className="font-medium">{product.name}</h3>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                          {product.moq && (
                            <Badge variant={moqShortfall > 0 ? "destructive" : "secondary"} className="text-[10px]">
                              MOQ {product.moq}
                            </Badge>
                          )}
                          {hasTiers && currentTierQty !== null && (
                            <Badge variant="secondary" className="text-[10px]">
                              Tier ≥ {currentTierQty} · {fx(unitUsd)}/unit
                            </Badge>
                          )}
                          {hasTiers && currentTierQty === null && (
                            <Badge variant="outline" className="text-[10px]">Base price · {fx(unitUsd)}/unit</Badge>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => remove(product.id)} aria-label="Remove">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {moqShortfall > 0 && product.moq && (
                      <div className="flex items-center justify-between gap-2 rounded-md border border-destructive/40 bg-destructive/5 px-2.5 py-1.5 text-xs">
                        <span className="flex items-center gap-1.5 text-destructive">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Add {moqShortfall} more to reach MOQ of {product.moq}
                        </span>
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setQty(product.id, product.moq!)}>
                          Set to {product.moq}
                        </Button>
                      </div>
                    )}

                    {hasTiers && nextTier && savingsPerUnitUsd > 0 && (
                      <div className="flex items-center justify-between gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-2.5 py-1.5 text-xs">
                        <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                          <TrendingDown className="h-3.5 w-3.5" />
                          Buy {nextTier.qty - qty} more → {fx(nextTier.priceUsd)}/unit (save {fx(savingsPerUnitUsd)}/unit)
                        </span>
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setQty(product.id, nextTier.qty)}>
                          Unlock
                        </Button>
                      </div>
                    )}

                    {hasTiers && !nextTier && (
                      <div className="flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-2.5 py-1.5 text-xs text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Best bulk price unlocked
                      </div>
                    )}

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-md border">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQty(product.id, qty - 1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input
                          value={qty}
                          onChange={(e) => setQty(product.id, Math.max(0, parseInt(e.target.value) || 0))}
                          className="h-8 w-16 border-0 text-center shadow-none focus-visible:ring-0"
                        />
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQty(product.id, qty + 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{fx(lineUsd)}</div>
                        <div className="text-[11px] text-muted-foreground">{qty} × {fx(unitUsd)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex justify-between">
            <Button variant="ghost" onClick={clear}>Clear cart</Button>
            <Button asChild variant="link"><Link to="/">{t("continue_shopping")}</Link></Button>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border bg-card p-6 shadow-soft">
          <h2 className="text-lg font-semibold">Estimated total</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Final pricing is recalculated server-side from the authoritative catalog at checkout.
          </p>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label={`Subtotal (${count} item${count > 1 ? "s" : ""})`} value={fx(analysis.subtotalUsd)} />
            <Row label="Shipping (global, est.)" value={fx(analysis.shippingUsd)} />
            <Row label="Duties & tax (est. 8%)" value={fx(analysis.taxUsd)} />
            <div className="my-3 border-t" />
            <Row
              label={<span className="text-base font-semibold">Total</span>}
              value={<span className="text-base font-semibold">{fx(analysis.totalUsd)}</span>}
            />
          </dl>

          {!canCheckout && analysis.violations.length > 0 && (
            <p className="mt-4 flex items-start gap-1.5 text-xs text-destructive">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Resolve MOQ warnings above to continue.
            </p>
          )}

          <Button
            className="mt-6 w-full"
            size="lg"
            disabled={!canCheckout}
            onClick={async () => {
              if (!user) {
                toast.info("Sign in to place and track your order");
                navigate({ to: "/auth" });
                return;
              }
              try {
                const result = await submitOrder({
                  data: {
                    lines: analysis.lines.map(({ product, qty }) => ({ productId: product.id, qty })),
                  },
                });
                clear();
                toast.success(`${t("order_placed")} · ${result.code}`);
                navigate({ to: "/track", search: { id: result.code } });
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Failed to place order");
              }
            }}
          >
            {t("checkout")}
          </Button>
          <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
            <li className="flex items-center gap-2"><Truck className="h-3.5 w-3.5" />Rural-to-urban routing enabled</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5" />Buyer protection on every order</li>
          </ul>
        </aside>
      </div>
    </AppLayout>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
