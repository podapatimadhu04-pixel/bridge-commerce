import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { TopNav } from "./TopNav";
import { CategorySidebar } from "./CategorySidebar";
import { CookieConsent } from "@/components/CookieConsent";
import { AiAssistant } from "@/components/AiAssistant";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />
      <div className="flex flex-1">
        <CategorySidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <footer className="border-t bg-muted/30">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} OrbitMarket — connecting neighborhoods to the world.</p>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/account" className="hover:text-foreground">Your data</Link>
            <span>Rural-to-urban logistics · 7 languages · Multi-currency</span>
          </nav>
        </div>
      </footer>
      <CookieConsent />
    </div>
  );
}

