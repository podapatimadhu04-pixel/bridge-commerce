import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { PRODUCTS, VENDORS } from "@/lib/mock-data";

export default defineTool({
  name: "browse_products",
  title: "Browse products",
  description:
    "Search OrbitMarket's public catalog of restaurants, groceries, and wholesale electronics. Filter by kind, category, or free-text query.",
  inputSchema: {
    query: z.string().optional().describe("Free-text search over name/description/vendor."),
    kind: z.enum(["food", "grocery", "electronics"]).optional().describe("Product kind filter."),
    category: z.string().optional().describe("Category filter (e.g. 'Air Conditioners')."),
    limit: z.number().int().min(1).max(50).optional().describe("Max results, default 20."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, kind, category, limit }) => {
    const q = query?.toLowerCase().trim();
    const cap = limit ?? 20;
    const results = PRODUCTS.filter((p) => {
      if (kind && p.kind !== kind) return false;
      if (category && p.category.toLowerCase() !== category.toLowerCase()) return false;
      if (q) {
        const v = VENDORS.find((v) => v.id === p.vendorId);
        const hay = `${p.name} ${p.description} ${p.category} ${v?.name ?? ""} ${v?.city ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    })
      .slice(0, cap)
      .map((p) => {
        const v = VENDORS.find((v) => v.id === p.vendorId);
        return {
          id: p.id,
          name: p.name,
          kind: p.kind,
          category: p.category,
          priceUsd: p.priceUsd,
          moq: p.moq,
          bulkTiers: p.bulkTiers,
          vendor: v ? { id: v.id, name: v.name, city: v.city, country: v.country, rating: v.rating } : null,
        };
      });
    return {
      content: [{ type: "text", text: JSON.stringify({ count: results.length, results }, null, 2) }],
      structuredContent: { count: results.length, results },
    };
  },
});
