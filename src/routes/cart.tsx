import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { useCart } from "@/lib/cart";
import { useLocale } from "@/lib/i18n";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ShoppingBag, Truck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — OrbitMarket" }] }),
  component: CartPage,
});

function CartPage() {
  const { t, fx } = useLocale();
  const { detailed, subtotalUsd, setQty, remove, clear, count } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();

  const shipping = subtotalUsd > 0 ? Math.max(4.99, subtotalUsd * 0.03) : 0;
  const tax = subtotalUsd * 0.08;
  const total = subtotalUsd + shipping + tax;

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
          <div className="divide-y rounded-2xl border bg-card shadow-soft">
            {detailed.map(({ product, qty, lineUsd }) => (
              <div key={product.id} className="flex gap-4 p-4">
                <img src={product.image} alt={product.name} className="h-24 w-24 rounded-lg object-cover" loading="lazy" />
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{product.category}</p>
                      <h3 className="font-medium">{product.name}</h3>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => remove(product.id)} aria-label="Remove"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center rounded-md border">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQty(product.id, qty - 1)}><Minus className="h-3 w-3" /></Button>
                      <Input
                        value={qty}
                        onChange={(e) => setQty(product.id, Math.max(0, parseInt(e.target.value) || 0))}
                        className="h-8 w-14 border-0 text-center shadow-none focus-visible:ring-0"
                      />
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQty(product.id, qty + 1)}><Plus className="h-3 w-3" /></Button>
                    </div>
                    <span className="font-semibold">{fx(lineUsd)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between">
            <Button variant="ghost" onClick={clear}>Clear cart</Button>
            <Button asChild variant="link"><Link to="/">{t("continue_shopping")}</Link></Button>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border bg-card p-6 shadow-soft">
          <h2 className="text-lg font-semibold">Summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <Row label="Subtotal" value={fx(subtotalUsd)} />
            <Row label="Shipping (global)" value={fx(shipping)} />
            <Row label="Duties & tax" value={fx(tax)} />
            <div className="my-3 border-t" />
            <Row label={<span className="text-base font-semibold">Total</span>} value={<span className="text-base font-semibold">{fx(total)}</span>} />
          </dl>
          <Button
            className="mt-6 w-full"
            size="lg"
            onClick={() => {
              const id = `OM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
              clear();
              toast.success(`${t("order_placed")} · ${id}`);
              navigate({ to: "/track", search: { id } });
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
