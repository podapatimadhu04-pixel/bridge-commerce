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

export const placeOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => CheckoutInput.parse(data))
  .handler(async ({ data, context }) => {
    // Recompute all pricing server-side from authoritative product data.
    const items: { productId: string; name: string; qty: number; unitUsd: number; lineUsd: number }[] = [];
    let subtotalUsd = 0;

    for (const line of data.lines) {
      const product = PRODUCTS.find((p) => p.id === line.productId);
      if (!product) {
        throw new Error(`Unknown product: ${line.productId}`);
      }
      if (product.moq && line.qty < product.moq) {
        throw new Error(`Minimum order quantity for ${product.name} is ${product.moq}`);
      }
      let unit = product.priceUsd;
      if (product.bulkTiers) {
        const tier = [...product.bulkTiers].reverse().find((t) => line.qty >= t.qty);
        if (tier) unit = tier.priceUsd;
      }
      const lineUsd = Number((unit * line.qty).toFixed(2));
      subtotalUsd += lineUsd;
      items.push({ productId: product.id, name: product.name, qty: line.qty, unitUsd: unit, lineUsd });
    }

    subtotalUsd = Number(subtotalUsd.toFixed(2));
    const shippingUsd = subtotalUsd > 0 ? Number(Math.max(4.99, subtotalUsd * 0.03).toFixed(2)) : 0;
    const taxUsd = Number((subtotalUsd * 0.08).toFixed(2));
    const totalUsd = Number((subtotalUsd + shippingUsd + taxUsd).toFixed(2));

    const code = `OM-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const { error } = await context.supabase.from("orders").insert({
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
