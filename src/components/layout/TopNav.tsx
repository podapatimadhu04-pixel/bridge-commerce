import { Link } from "@tanstack/react-router";
import { Globe, MapPin, ShoppingCart, Store, Search, Menu, User as UserIcon, LogOut } from "lucide-react";
import { CURRENCIES, LANGUAGES, useLocale, type Currency, type Lang } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const LOCATIONS = [
  "New York, US", "London, GB", "Mumbai, IN", "Tokyo, JP", "Rome, IT",
  "Shenzhen, CN", "Kigali, RW", "São Paulo, BR", "Dubai, AE", "Cusco, PE",
];

export function TopNav() {
  const { lang, setLang, currency, setCurrency, location, setLocation, t } = useLocale();
  const { count } = useCart();
  const { user } = useAuth();
  const [q, setQ] = useState("");

  const langLabel = LANGUAGES.find((l) => l.code === lang)!;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl gradient-hero text-primary-foreground shadow-glow">
            <Store className="h-4 w-4" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">Orbit<span className="text-primary">Market</span></span>
        </Link>

        <div className="ml-2 hidden flex-1 md:block">
          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("search_placeholder")}
              className="h-10 pl-9"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hidden gap-1.5 sm:flex">
                <MapPin className="h-4 w-4" />
                <span className="max-w-[8rem] truncate">{location}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{t("delivers_to")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {LOCATIONS.map((l) => (
                <DropdownMenuItem key={l} onClick={() => setLocation(l)}>{l}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">{langLabel.flag} {langLabel.code.toUpperCase()}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {LANGUAGES.map((l) => (
                <DropdownMenuItem key={l.code} onClick={() => setLang(l.code as Lang)}>
                  <span className="mr-2">{l.flag}</span>{l.label}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Currency</DropdownMenuLabel>
              {CURRENCIES.map((c) => (
                <DropdownMenuItem key={c.code} onClick={() => setCurrency(c.code as Currency)}>
                  <span className="mr-2">{c.symbol}</span>{c.code}
                  {currency === c.code && <span className="ml-auto text-xs text-muted-foreground">✓</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
            <Link to="/vendor">{t("vendor_onboard")}</Link>
          </Button>

          <Button asChild variant="ghost" size="sm" className="relative">
            <Link to="/cart" className="flex items-center gap-1.5">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">{t("cart")}</span>
              {count > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full px-1 text-[10px]">{count}</Badge>
              )}
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
