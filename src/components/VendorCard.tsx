import { Link } from "@tanstack/react-router";
import { Star, MapPin, Clock, Wifi } from "lucide-react";
import type { Vendor } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n";

export function VendorCard({ vendor }: { vendor: Vendor }) {
  const { t } = useLocale();
  const route =
    vendor.type === "restaurant" ? "/restaurants" :
    vendor.type === "grocery" ? "/groceries" : "/electronics";
  return (
    <Link
      to={route}
      className="group overflow-hidden rounded-2xl border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={vendor.hero}
          alt={vendor.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-1.5">
          {vendor.open && <Badge className="bg-success text-success-foreground">{t("open_now")}</Badge>}
          {vendor.rural && (
            <Badge variant="secondary" className="gap-1">
              <Wifi className="h-3 w-3" /> {t("rural_ready")}
            </Badge>
          )}
        </div>
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold leading-tight">{vendor.name}</h3>
          <div className="flex shrink-0 items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-xs font-medium">
            <Star className="h-3 w-3 fill-primary text-primary" />
            {vendor.rating}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{vendor.city}, {vendor.country}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{vendor.eta}</span>
        </div>
        <div className="flex flex-wrap gap-1 pt-1">
          {vendor.tags.slice(0, 3).map((tg) => (
            <span key={tg} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{tg}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
