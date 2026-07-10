import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";

type AuthorizationDetails = {
  client?: { name?: string; client_uri?: string; redirect_uris?: string[] } | null;
  scopes?: string[];
  redirect_url?: string;
  redirect_to?: string;
};

// Beta auth.oauth namespace — local typed wrapper.
type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
};
const oauth = () => (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const next = location.pathname + location.searchStr;
      throw redirect({ to: "/auth", search: { next } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({ href: immediate });
    return data;
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <AppLayout>
      <main className="mx-auto max-w-md px-4 py-16 text-sm">
        <h1 className="text-xl font-semibold">Authorization error</h1>
        <p className="mt-2 text-muted-foreground">
          Could not load this authorization request: {String((error as Error)?.message ?? error)}
        </p>
      </main>
    </AppLayout>
  ),
});

function Consent() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState<"approve" | "deny" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function decide(approve: boolean) {
    setBusy(approve ? "approve" : "deny");
    setError(null);
    const { data, error } = approve
      ? await oauth().approveAuthorization(authorization_id)
      : await oauth().denyAuthorization(authorization_id);
    if (error) {
      setBusy(null);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(null);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "an app";
  const redirectUri = details?.client?.redirect_uris?.[0];
  const scopes = details?.scopes ?? [];

  return (
    <AppLayout>
      <main className="mx-auto max-w-md px-4 py-12">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-xs font-medium uppercase tracking-wide">Authorize connection</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold">Connect {clientName} to OrbitMarket</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This lets <span className="font-medium text-foreground">{clientName}</span> use OrbitMarket's tools as you — reading your
            orders, addresses, and profile. This does not bypass OrbitMarket's permissions or backend policies.
          </p>

          {redirectUri && (
            <p className="mt-4 break-all text-xs text-muted-foreground">
              Will redirect to: <span className="font-mono">{redirectUri}</span>
            </p>
          )}

          {scopes.length > 0 && (
            <ul className="mt-4 space-y-1 text-sm">
              {scopes.map((s: string) => (
                <li key={s} className="rounded-md bg-muted px-2 py-1 font-mono text-xs">{s}</li>
              ))}
            </ul>
          )}

          {error && <p className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">{error}</p>}

          <div className="mt-6 flex gap-2">
            <Button onClick={() => decide(true)} disabled={busy !== null} className="flex-1">
              {busy === "approve" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Approve
            </Button>
            <Button variant="outline" onClick={() => decide(false)} disabled={busy !== null} className="flex-1">
              {busy === "deny" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cancel connection
            </Button>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
