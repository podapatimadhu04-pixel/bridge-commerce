import type { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { CategorySidebar } from "./CategorySidebar";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />
      <div className="flex flex-1">
        <CategorySidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
      <footer className="border-t bg-muted/30">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} OrbitMarket — connecting neighborhoods to the world.</p>
          <p>Rural-to-urban logistics • 7 languages • Multi-currency</p>
        </div>
      </footer>
    </div>
  );
}
