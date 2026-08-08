import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { PRODUCTS, type Product } from "./mock-data";

export type CartLine = { productId: string; qty: number };

type Ctx = {
  lines: CartLine[];
  add: (id: string, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotalUsd: number;
  detailed: { product: Product; qty: number; lineUsd: number }[];
};

const CartContext = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? window.localStorage.getItem("cart") : null;
    if (saved) {
      try { setLines(JSON.parse(saved)); } catch {}
    }
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") window.localStorage.setItem("cart", JSON.stringify(lines));
  }, [lines]);

  const value = useMemo<Ctx>(() => {
    const add = (id: string, qty = 1) =>
      setLines((prev) => {
        const existing = prev.find((l) => l.productId === id);
        if (existing) return prev.map((l) => l.productId === id ? { ...l, qty: l.qty + qty } : l);
        return [...prev, { productId: id, qty }];
      });
    const remove = (id: string) => setLines((prev) => prev.filter((l) => l.productId !== id));
    const setQty = (id: string, qty: number) =>
      setLines((prev) => qty <= 0 ? prev.filter((l) => l.productId !== id) : prev.map((l) => l.productId === id ? { ...l, qty } : l));
    const clear = () => setLines([]);

    const detailed = lines
      .map((l) => {
        const product = PRODUCTS.find((p) => p.id === l.productId);
        if (!product) return null;
        // apply bulk pricing tiers if present
        let unit = product.priceUsd;
        if (product.bulkTiers) {
          const tier = [...product.bulkTiers].reverse().find((t) => l.qty >= t.qty);
          if (tier) unit = tier.priceUsd;
        }
        return { product, qty: l.qty, lineUsd: unit * l.qty };
      })
      .filter(Boolean) as { product: Product; qty: number; lineUsd: number }[];
    const count = lines.reduce((a, b) => a + b.qty, 0);
    const subtotalUsd = detailed.reduce((a, b) => a + b.lineUsd, 0);
    return { lines, add, remove, setQty, clear, count, subtotalUsd, detailed };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}
