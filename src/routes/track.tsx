import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Package, PackageCheck, Plane, Truck } from "lucide-react";
import { z } from "zod";
import { useLocale } from "@/lib/i18n";

const searchSchema = z.object({ id: z.string().optional() });

export const Route = createFileRoute("/track")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Track order — OrbitMarket" }] }),
  component: TrackPage,
});

function TrackPage() {
  const { id: initial } = Route.useSearch();
  const { t } = useLocale();
  const [id, setId] = useState(initial || "");
  const [active, setActive] = useState<string | undefined>(initial);

  const steps = [
    { label: "Order confirmed", icon: PackageCheck, done: true },
    { label: "Vendor packing", icon: Package, done: true },
    { label: "In transit (regional hub)", icon: Truck, done: true },
    { label: "International shipping", icon: Plane, done: !!active },
    { label: "Out for delivery", icon: Truck, done: false },
    { label: "Delivered", icon: CheckCircle2, done: false },
  ];

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold tracking-tight">{t("track_order")}</h1>
        <p className="mt-2 text-muted-foreground">Global rural-to-urban shipment tracking, powered by pluggable 3PL connectors.</p>
        <form
          className="mt-6 flex gap-2"
          onSubmit={(e) => { e.preventDefault(); setActive(id); }}
        >
          <Input placeholder="e.g. OM-A1B2C3" value={id} onChange={(e) => setId(e.target.value.toUpperCase())} />
          <Button type="submit">Track</Button>
        </form>

        {active && (
          <div className="mt-8 rounded-2xl border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{t("tracking_id")}</p>
                <p className="font-mono text-lg font-semibold">{active}</p>
              </div>
              <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success">In transit</span>
            </div>
            <ol className="mt-6 space-y-4">
              {steps.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className={`grid h-9 w-9 place-items-center rounded-full ${s.done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {s.done ? <s.icon className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                  </div>
                  <div className="pt-1.5">
                    <p className={s.done ? "font-medium" : "text-muted-foreground"}>{s.label}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
