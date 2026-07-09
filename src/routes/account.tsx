import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "@/lib/i18n";
import { toast } from "sonner";
import { MapPin, Package, User as UserIcon, Trash2, LogOut, Download } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Your account — OrbitMarket" }] }),
  component: AccountPage,
});

const addrSchema = z.object({
  recipient_name: z.string().trim().min(1).max(120),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  line1: z.string().trim().min(1).max(200),
  line2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().min(1).max(120),
  region: z.string().trim().max(120).optional().or(z.literal("")),
  postal_code: z.string().trim().max(20).optional().or(z.literal("")),
  country_code: z.string().trim().length(2, "2-letter code, e.g. IN, US"),
});

function AccountPage() {
  const { user, loading } = useAuth();
  const { fx } = useLocale();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ full_name: string; phone: string; marketing_opt_in: boolean }>({ full_name: "", phone: "", marketing_opt_in: false });
  const [addresses, setAddresses] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [form, setForm] = useState({ recipient_name: "", phone: "", line1: "", line2: "", city: "", region: "", postal_code: "", country_code: "" });

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: p }, { data: a }, { data: o }] = await Promise.all([
        supabase.from("profiles").select("full_name, phone, marketing_opt_in").eq("id", user.id).maybeSingle(),
        supabase.from("addresses").select("*").order("is_default", { ascending: false }).order("created_at", { ascending: false }),
        supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(20),
      ]);
      if (p) setProfile({ full_name: p.full_name ?? "", phone: p.phone ?? "", marketing_opt_in: !!p.marketing_opt_in });
      setAddresses(a ?? []);
      setOrders(o ?? []);
    })();
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: profile.full_name.trim().slice(0, 100),
      phone: profile.phone.trim().slice(0, 40),
      marketing_opt_in: profile.marketing_opt_in,
    });
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
  };

  const addAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const parsed = addrSchema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    const { data, error } = await supabase.from("addresses").insert({
      user_id: user.id,
      ...parsed.data,
      country_code: parsed.data.country_code.toUpperCase(),
      is_default: addresses.length === 0,
    }).select().single();
    if (error) return toast.error(error.message);
    setAddresses([data, ...addresses]);
    setForm({ recipient_name: "", phone: "", line1: "", line2: "", city: "", region: "", postal_code: "", country_code: "" });
    toast.success("Address added");
  };

  const removeAddress = async (id: string) => {
    const { error } = await supabase.from("addresses").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const exportData = async () => {
    if (!user) return;
    const payload = { user: { id: user.id, email: user.email }, profile, addresses, orders };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `orbitmarket-data-${user.id}.json`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Your data has been downloaded");
  };

  const deleteAccount = async () => {
    if (!user) return;
    if (!confirm("This permanently deletes your profile, addresses and order history. Continue?")) return;
    // wipe app data; auth.users deletion requires admin API — surface support path
    await supabase.from("addresses").delete().eq("user_id", user.id);
    await supabase.from("orders").delete().eq("user_id", user.id);
    await supabase.from("profiles").delete().eq("id", user.id);
    await supabase.auth.signOut();
    toast.success("Your account data has been erased.");
    navigate({ to: "/" });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  if (loading || !user) return null;

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your account</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={signOut}><LogOut className="mr-2 h-4 w-4" /> Sign out</Button>
        </div>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6 shadow-soft">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><UserIcon className="h-4 w-4" /> Profile</h2>
            <div className="space-y-3">
              <div><Label>Full name</Label><Input value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} maxLength={100} /></div>
              <div><Label>Phone</Label><Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} maxLength={40} /></div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={profile.marketing_opt_in} onChange={(e) => setProfile({ ...profile, marketing_opt_in: e.target.checked })} />
                I'd like offers and product updates by email
              </label>
              <Button onClick={saveProfile}>Save profile</Button>
            </div>
          </div>

          <div className="rounded-2xl border bg-card p-6 shadow-soft">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><MapPin className="h-4 w-4" /> Delivery addresses</h2>
            <ul className="space-y-2 text-sm">
              {addresses.map((a) => (
                <li key={a.id} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{a.recipient_name} {a.is_default && <span className="ml-1 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">Default</span>}</p>
                    <p className="text-muted-foreground">{a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city}{a.region ? `, ${a.region}` : ""} {a.postal_code} · {a.country_code}</p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => removeAddress(a.id)}><Trash2 className="h-4 w-4" /></Button>
                </li>
              ))}
              {addresses.length === 0 && <li className="text-muted-foreground">No addresses yet.</li>}
            </ul>
            <form onSubmit={addAddress} className="mt-4 grid grid-cols-2 gap-2">
              <Input placeholder="Recipient" value={form.recipient_name} onChange={(e) => setForm({ ...form, recipient_name: e.target.value })} required className="col-span-2" />
              <Input placeholder="Address line 1" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} required className="col-span-2" />
              <Input placeholder="Address line 2" value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} className="col-span-2" />
              <Input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
              <Input placeholder="Region / State" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
              <Input placeholder="Postal code" value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} />
              <Input placeholder="Country (ISO, e.g. IN)" value={form.country_code} onChange={(e) => setForm({ ...form, country_code: e.target.value.toUpperCase() })} maxLength={2} required />
              <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="col-span-2" />
              <Button type="submit" className="col-span-2">Add address</Button>
            </form>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border bg-card p-6 shadow-soft">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><Package className="h-4 w-4" /> Recent orders</h2>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet. <Link to="/" className="underline">Start shopping</Link>.</p>
          ) : (
            <ul className="divide-y text-sm">
              {orders.map((o) => (
                <li key={o.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">{o.code} <span className="ml-1 text-xs text-muted-foreground">· {o.status}</span></p>
                    <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</p>
                  </div>
                  <span className="font-semibold">{fx(Number(o.total_usd))}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-6 rounded-2xl border bg-card p-6 shadow-soft">
          <h2 className="text-lg font-semibold">Your data & rights</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Under GDPR, India DPDP, CCPA and similar laws, you can access, export or erase your data at any time.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="outline" onClick={exportData}><Download className="mr-2 h-4 w-4" /> Export my data</Button>
            <Button variant="destructive" onClick={deleteAccount}><Trash2 className="mr-2 h-4 w-4" /> Erase my data</Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Full auth-record deletion may be completed by our support team within 30 days. See our <Link to="/privacy" className="underline">Privacy Policy</Link>.
          </p>
        </section>
      </div>
    </AppLayout>
  );
}
