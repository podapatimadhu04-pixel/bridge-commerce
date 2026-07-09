import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Cookie, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const KEY = "om_consent_v1";

type Consent = { necessary: true; analytics: boolean; marketing: boolean; ts: string };

export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(KEY);
    if (!saved) setOpen(true);
  }, []);

  const save = async (analytics: boolean, marketing: boolean) => {
    const c: Consent = { necessary: true, analytics, marketing, ts: new Date().toISOString() };
    window.localStorage.setItem(KEY, JSON.stringify(c));
    const anonKey = window.localStorage.getItem("om_anon_key") ?? crypto.randomUUID();
    window.localStorage.setItem("om_anon_key", anonKey);
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("consent_events").insert({
      user_id: user?.id ?? null,
      anon_key: user ? null : anonKey,
      analytics, marketing,
      user_agent: navigator.userAgent.slice(0, 500),
    });
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:max-w-md">
      <div className="rounded-2xl border bg-card p-4 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-primary/10 text-primary">
            <Cookie className="h-4 w-4" />
          </div>
          <div className="flex-1 text-sm">
            <p className="font-semibold">We value your privacy</p>
            <p className="mt-1 text-muted-foreground">
              We use strictly necessary cookies to run OrbitMarket. Optional cookies help us understand usage and personalise offers. You can change your choice anytime on the{" "}
              <Link to="/privacy" className="underline underline-offset-2">Privacy</Link> page.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" onClick={() => save(true, true)}>Accept all</Button>
              <Button size="sm" variant="secondary" onClick={() => save(true, false)}>Analytics only</Button>
              <Button size="sm" variant="outline" onClick={() => save(false, false)}>Reject optional</Button>
            </div>
            <p className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3 w-3" /> Choice is logged securely for compliance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
