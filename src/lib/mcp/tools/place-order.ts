import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { PRODUCTS } from "../../mock-data";

const MAX_QTY_BY_KIND: Record<string, number> = {
  food: 25,
  grocery: 100,
};

export default defineTool({
  name: "place_order",
  title: "Place order",
  description:
    "Place an OrbitMarket order for the signed-in user from a list of {productId, qty} lines. Pricing, MOQ, bulk tiers, shipping, and tax are recomputed server-side from the authoritative catalog. Returns the new order code, status, and totals.",
  inputSchema: {
    lines: z
      .array(
        z.object({
          productId: z.string().min(1).max(64).describe("Product id from browse_products."),
          qty: z.number().int().positive().max(100000).describe("Quantity of this product."),
        }),
      )
      .min(1)
      .max(200)
      .describe("Cart lines to check out. Merge duplicates before calling."),
  },
  annotations: { readOnlyHint: false, idempotentHint: false, openWorldHint: false },
  handler: async ({ lines }, ctx: ToolContext) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }

    try {
      const seen = new Set<string>();
      const items: {
        productId: string;
        name: string;
        qty: number;
        unitUsd: number;
        lineUsd: number;
      }[] = [];
      let subtotalUsd = 0;

      for (const line of lines) {
        if (seen.has(line.productId)) {
          throw new Error(`Duplicate line for product ${line.productId}`);
        }
        seen.add(line.productId);

        const product = PRODUCTS.find((p) => p.id === line.productId);
        if (!product) throw new Error(`Unknown product: ${line.productId}`);

        const maxQty = MAX_QTY_BY_KIND[product.kind] ?? 1000;
        if (line.qty > maxQty) {
          throw new Error(`Quantity for ${product.name} exceeds maximum of ${maxQty}`);
        }
        if (product.moq && line.qty < product.moq) {
          throw new Error(`Minimum order quantity for ${product.name} is ${product.moq}`);
        }

        let unit = product.priceUsd;
        if (product.bulkTiers && product.bulkTiers.length > 0) {
          const sorted = [...product.bulkTiers].sort((a, b) => a.qty - b.qty);
          const floor = sorted[0]!.qty;
          if (line.qty < floor) {
            throw new Error(`Minimum bulk quantity for ${product.name} is ${floor}`);
          }
          const tier = [...sorted].reverse().find((t) => line.qty >= t.qty);
          if (tier) unit = tier.priceUsd;
        }
        if (!(unit > 0) || !Number.isFinite(unit)) {
          throw new Error(`Invalid price for ${product.name}`);
        }
        const lineUsd = Number((unit * line.qty).toFixed(2));
        subtotalUsd += lineUsd;
        items.push({ productId: product.id, name: product.name, qty: line.qty, unitUsd: unit, lineUsd });
      }

      if (subtotalUsd > 5_000_000) {
        throw new Error("Order subtotal exceeds allowed maximum");
      }

      subtotalUsd = Number(subtotalUsd.toFixed(2));
      const shippingUsd = subtotalUsd > 0 ? Number(Math.max(4.99, subtotalUsd * 0.03).toFixed(2)) : 0;
      const taxUsd = Number((subtotalUsd * 0.08).toFixed(2));
      const totalUsd = Number((subtotalUsd + shippingUsd + taxUsd).toFixed(2));

      const code = `OM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

      const userId = ctx.getUserId();
      if (!userId) {
        return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
      }

      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data, error } = await supabaseAdmin
        .from("orders")
        .insert({
          user_id: userId,
          code,
          status: "placed",
          subtotal_usd: subtotalUsd,
          shipping_usd: shippingUsd,
          tax_usd: taxUsd,
          total_usd: totalUsd,
          items,
        })
        .select("id, code, status, subtotal_usd, shipping_usd, tax_usd, total_usd, currency, created_at")
        .single();

      if (error) throw new Error(error.message);

      const order = {
        id: data.id,
        code: data.code,
        status: data.status,
        currency: data.currency,
        subtotalUsd: Number(data.subtotal_usd),
        shippingUsd: Number(data.shipping_usd),
        taxUsd: Number(data.tax_usd),
        totalUsd: Number(data.total_usd),
        createdAt: data.created_at,
        items,
      };

      return {
        content: [
          {
            type: "text",
            text: `Order ${order.code} placed (status: ${order.status}). Total ${order.totalUsd} ${order.currency}.`,
          },
        ],
        structuredContent: { order },
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to place order";
      return { content: [{ type: "text", text: message }], isError: true };
    }
  },
});
