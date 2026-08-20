import { PRODUCTS, VENDORS, resolveProduct, type Product } from "./mock-data";

export type CatalogHit = {
  id: string;
  name: string;
  kind: Product["kind"];
  category: string;
  priceUsd: number;
  vendor: string;
  city: string;
  country: string;
  description: string;
};

/** Region-aware, availability-filtered catalog rows used as AI context. */
export function catalogRows(country?: string | null, kind?: Product["kind"]): CatalogHit[] {
  return PRODUCTS.filter((p) => !kind || p.kind === kind)
    .map((p) => resolveProduct(p, country))
    .filter((p) => p.available)
    .map((p) => {
      const v = VENDORS.find((v) => v.id === p.vendorId);
      return {
        id: p.id,
        name: p.name,
        kind: p.kind,
        category: p.category,
        priceUsd: p.priceUsd,
        vendor: v?.name ?? "Unknown vendor",
        city: v?.city ?? "",
        country: v?.country ?? "",
        description: p.description,
      };
    });
}

/** Compact one-line-per-product listing that fits comfortably in a prompt. */
export function catalogPromptLines(rows: CatalogHit[]): string {
  return rows
    .map(
      (r) =>
        `${r.id} | ${r.name} | ${r.kind}/${r.category} | $${r.priceUsd} | ${r.vendor}, ${r.city} ${r.country} | ${r.description.slice(0, 110)}`,
    )
    .join("\n");
}

export function keywordFallback(rows: CatalogHit[], query: string, limit = 12): CatalogHit[] {
  const q = query.toLowerCase().trim();
  if (!q) return rows.slice(0, limit);
  const terms = q.split(/\s+/);
  return rows
    .map((r) => {
      const hay = `${r.name} ${r.category} ${r.vendor} ${r.city} ${r.description}`.toLowerCase();
      return { r, score: terms.filter((t) => hay.includes(t)).length };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.r);
}

export const LANG_NAMES: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  hi: "Hindi",
  zh: "Simplified Chinese",
  ar: "Arabic",
  pt: "Portuguese",
};
