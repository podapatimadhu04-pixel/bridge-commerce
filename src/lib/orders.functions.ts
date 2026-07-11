import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { PRODUCTS } from "./mock-data";


const CheckoutInput = z.object({
  lines: z
    .array(
      z.object({
        productId: z.string().min(1).max(64),
        qty: z.number().int().positive().max(100000),
      }),
    )
    .min(1)
    .max(200),
});

// Per-kind maximum quantity caps to prevent obviously invalid orders.
const MAX_QTY_BY_KIND: Record<string, number> = {
  food: 25,
  grocery: 100,
  electronics: 100000,
};

export const placeOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => CheckoutInput.parse(data))
  .handler(async ({ data, context }) => {
    // Recompute all pricing server-side from authoritative product data.
    const items: { productId: string; name: string; qty: number; unitUsd: number; lineUsd: number }[] = [];
    let subtotalUsd = 0;

    // Reject duplicate lines — the client must merge them before checkout.
    const seen = new Set<string>();
    for (const l of data.lines) {
      if (seen.has(l.productId)) {
        throw new Error(`Duplicate line for product ${l.productId}`);
      }
      seen.add(l.productId);
    }

    for (const line of data.lines) {
      const product = PRODUCTS.find((p) => p.id === line.productId);
      if (!product) {
        throw new Error(`Unknown product: ${line.productId}`);
      }
      if (!Number.isInteger(line.qty) || line.qty <= 0) {
        throw new Error(`Invalid quantity for ${product.name}`);
      }
      const maxQty = MAX_QTY_BY_KIND[product.kind] ?? 1000;
      if (line.qty > maxQty) {
        throw new Error(`Quantity for ${product.name} exceeds maximum of ${maxQty}`);
      }
      if (product.moq && line.qty < product.moq) {
        throw new Error(`Minimum order quantity for ${product.name} is ${product.moq}`);
      }
      // Bulk tiers must be honoured: pick the highest tier whose qty threshold
      // is met. Reject any client-supplied unit price implicitly by ignoring it.
      let unit = product.priceUsd;
      if (product.bulkTiers && product.bulkTiers.length > 0) {
        const sorted = [...product.bulkTiers].sort((a, b) => a.qty - b.qty);
        // Enforce the smallest tier as an implicit MOQ floor for bulk products.
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

    // Sanity cap on total order value to avoid absurd inputs slipping through.
    if (subtotalUsd > 5_000_000) {
      throw new Error("Order subtotal exceeds allowed maximum");
    }

    subtotalUsd = Number(subtotalUsd.toFixed(2));
    const shippingUsd = subtotalUsd > 0 ? Number(Math.max(4.99, subtotalUsd * 0.03).toFixed(2)) : 0;
    const taxUsd = Number((subtotalUsd * 0.08).toFixed(2));
    const totalUsd = Number((subtotalUsd + shippingUsd + taxUsd).toFixed(2));

    const code = `OM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    // Use admin client so client-side INSERT policy can be removed; auth is
    // already verified by requireSupabaseAuth middleware above.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("orders").insert({
      user_id: context.userId,
      code,
      status: "placed",
      subtotal_usd: subtotalUsd,
      shipping_usd: shippingUsd,
      tax_usd: taxUsd,
      total_usd: totalUsd,
      items,
    });
    if (error) throw new Error(error.message);

    return { code, subtotalUsd, shippingUsd, taxUsd, totalUsd };
  });
