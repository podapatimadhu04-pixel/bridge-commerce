import { Link, useRouterState } from "@tanstack/react-router";
import { UtensilsCrossed, ShoppingBasket, Cpu, Truck, Package, Building2 } from "lucide-react";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "browse", icon: Building2, exact: true },
  { to: "/restaurants", label: "restaurants", icon: UtensilsCrossed, exact: false },
  { to: "/groceries", label: "groceries", icon: ShoppingBasket, exact: false },
  { to: "/electronics", label: "electronics", icon: Cpu, exact: false },
  { to: "/track", label: "track_order", icon: Truck, exact: false },
  { to: "/vendor", label: "vendor_onboard", icon: Package, exact: false },
] as const;

export function CategorySidebar() {
  const { t } = useLocale();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden w-56 shrink-0 border-r bg-sidebar lg:block">
      <nav className="sticky top-16 flex flex-col gap-0.5 p-3">
        <p className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {t("categories")}
        </p>
        {items.map((it) => {
          const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
              )}
            >
              <it.icon className="h-4 w-4" />
              {t(it.label)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
