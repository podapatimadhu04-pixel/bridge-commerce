import { Plus } from "lucide-react";
import { resolveProduct, type Product } from "@/lib/mock-data";
import { useLocale } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const { fx, t, country } = useLocale();
  const { add } = useCart();
  const resolved = resolveProduct(product, country);
  const isWholesale = (resolved.bulkTiers?.length ?? 0) > 0;
  const startPrice = resolved.bulkTiers?.[0]?.priceUsd ?? resolved.priceUsd;
  const isRegional =
    resolved.priceUsd !== product.priceUsd ||
    resolved.description !== product.description;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={resolved.image}
          alt={resolved.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {isWholesale && (
          <Badge className="absolute left-3 top-3 bg-brand text-brand-foreground">B2B</Badge>
        )}
        {isRegional && country && (
          <Badge variant="secondary" className="absolute right-3 top-3 text-[10px]">
            {country} pricing
          </Badge>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex-1">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{resolved.category}</p>
          <h3 className="mt-0.5 line-clamp-2 font-medium leading-snug">{resolved.name}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{resolved.description}</p>
        </div>
        <div className="flex items-end justify-between pt-1">
          <div>
            {isWholesale && <span className="text-[11px] text-muted-foreground">{t("from")} </span>}
            <span className="text-lg font-semibold text-foreground">{fx(startPrice)}</span>
            {isWholesale && (
              <p className="text-[11px] text-muted-foreground">
                {t("moq")}: {resolved.moq} {t("per_unit")}
              </p>
            )}
          </div>
          <Button
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              add(resolved.id, isWholesale ? resolved.moq ?? 1 : 1);
              toast.success(`${resolved.name} added`);
            }}
          >
            <Plus className="mr-1 h-4 w-4" />
            {isWholesale ? t("request_quote") : t("add_to_cart")}
          </Button>
        </div>
      </div>
    </article>
  );
}
