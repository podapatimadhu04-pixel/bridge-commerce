// Region-aware delivery estimation (ETA + shipping cost).
// Pure functions — shared by the cart UI and the server-side checkout so the
// buyer's estimate and the authoritative order total always agree.

export type DeliveryZone = "domestic-metro" | "domestic-rural" | "regional" | "international";

export type DeliveryEstimate = {
  zone: DeliveryZone;
  zoneLabel: string;
  locality: string | null;
  country: string | null;
  rural: boolean;
  shippingUsd: number;
  etaMinDays: number;
  etaMaxDays: number;
  etaLabel: string;
  /** Extra explanation lines shown under the estimate. */
  notes: string[];
};

// Countries with dense last-mile networks → faster + cheaper delivery.
const FAST_LANE = new Set(["US", "GB", "DE", "FR", "IT", "ES", "NL", "JP", "KR", "SG", "AE", "AU", "CA", "CN"]);
// Countries where cross-border customs handling adds days.
const SLOW_LANE = new Set(["RW", "ET", "ML", "KE", "NG", "PE", "BO", "MM", "NP", "TZ", "UG"]);

// Metro hubs served by same-day couriers. Anything else in-country is treated
// as rural / secondary-city routing.
const METROS = new Set([
  "new york", "london", "mumbai", "delhi", "tokyo", "rome", "milan", "paris", "berlin", "madrid",
  "shenzhen", "shanghai", "guangzhou", "beijing", "dubai", "abu dhabi", "são paulo", "sao paulo",
  "rio de janeiro", "mexico city", "seoul", "singapore", "sydney", "melbourne", "toronto",
  "los angeles", "chicago", "san francisco", "istanbul", "cairo", "nairobi", "lagos", "bangkok",
  "amsterdam", "stockholm", "buenos aires", "kigali", "hanoi", "ho chi minh city", "marrakesh",
  "addis ababa", "edinburgh", "jaipur", "cusco", "bamako",
]);

const REGION_GROUPS: string[][] = [
  ["US", "CA", "MX"],
  ["GB", "IE", "FR", "DE", "IT", "ES", "PT", "NL", "SE", "PL"],
  ["AE", "SA", "QA", "KW", "EG"],
  ["IN", "NP", "LK", "BD"],
  ["CN", "JP", "KR", "SG", "TH", "VN", "MY"],
  ["BR", "AR", "PE", "CL", "BO"],
  ["KE", "RW", "TZ", "UG", "ET", "NG", "ML", "MA", "ZA"],
  ["AU", "NZ"],
];

export function parseLocation(location?: string | null): { locality: string | null; country: string | null } {
  if (!location) return { locality: null, country: null };
  const parts = location.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return { locality: null, country: null };
  const country = (parts[parts.length - 1] ?? "").toUpperCase();
  const locality = parts.length > 1 ? parts.slice(0, -1).join(", ") : null;
  return { locality: locality || null, country: country || null };
}

function sameRegion(a: string, b: string) {
  return REGION_GROUPS.some((g) => g.includes(a) && g.includes(b));
}

export function isRuralLocality(locality?: string | null) {
  if (!locality) return false;
  return !METROS.has(locality.trim().toLowerCase());
}

export type DeliveryInput = {
  /** Buyer country (ISO-2). */
  country?: string | null;
  /** Buyer city / locality, e.g. "Cusco". */
  locality?: string | null;
  subtotalUsd: number;
  /** Kinds present in the cart — food is local, electronics ships freight. */
  kinds: ("food" | "grocery" | "electronics")[];
  /** Origin countries of the vendors in the cart (ISO-2). */
  originCountries?: (string | null | undefined)[];
};

export function estimateDelivery(input: DeliveryInput): DeliveryEstimate {
  const country = input.country ? input.country.toUpperCase() : null;
  const locality = input.locality?.trim() || null;
  const rural = isRuralLocality(locality);
  const kinds = new Set(input.kinds);
  const origins = (input.originCountries ?? []).filter(Boolean).map((c) => String(c).toUpperCase());

  const crossBorder = country ? origins.some((o) => o !== country) : origins.length > 0;
  const regional = country ? origins.some((o) => o !== country && sameRegion(o, country)) : false;

  let zone: DeliveryZone;
  if (crossBorder && !regional) zone = "international";
  else if (crossBorder) zone = "regional";
  else zone = rural ? "domestic-rural" : "domestic-metro";

  // ---- Cost ----
  // Base handling + weight-ish proxy on subtotal, then zone and locality factors.
  const base = zone === "domestic-metro" ? 3.49 : zone === "domestic-rural" ? 6.49 : zone === "regional" ? 11.9 : 24.5;
  let rate = zone === "domestic-metro" ? 0.02 : zone === "domestic-rural" ? 0.03 : zone === "regional" ? 0.045 : 0.065;
  if (kinds.has("electronics")) rate += 0.015; // pallet / freight surcharge
  if (kinds.has("food") && zone.startsWith("domestic")) rate = Math.min(rate, 0.02); // hot food is flat-ish

  let shippingUsd = base + input.subtotalUsd * rate;
  if (country && FAST_LANE.has(country)) shippingUsd *= 0.9;
  if (country && SLOW_LANE.has(country)) shippingUsd *= 1.2;
  // Free shipping over a threshold for domestic non-freight orders.
  const freeThreshold = kinds.has("electronics") ? Infinity : 120;
  const freeShipping = zone.startsWith("domestic") && input.subtotalUsd >= freeThreshold;
  shippingUsd = input.subtotalUsd <= 0 ? 0 : freeShipping ? 0 : Number(shippingUsd.toFixed(2));

  // ---- ETA ----
  let min: number, max: number;
  if (kinds.size === 1 && kinds.has("food") && zone.startsWith("domestic")) {
    min = 0; max = rural ? 1 : 0; // same-day courier
  } else if (zone === "domestic-metro") {
    min = 1; max = 3;
  } else if (zone === "domestic-rural") {
    min = 3; max = 7;
  } else if (zone === "regional") {
    min = 4; max = 10;
  } else {
    min = 7; max = 18;
  }
  if (kinds.has("electronics") && !zone.startsWith("domestic")) max += 4; // customs on freight
  if (country && SLOW_LANE.has(country)) { min += 1; max += 5; }
  if (country && FAST_LANE.has(country) && max > 2) max -= 1;

  const zoneLabel =
    zone === "domestic-metro" ? "Metro last-mile" :
    zone === "domestic-rural" ? "Rural routing" :
    zone === "regional" ? "Regional cross-border" : "International freight";

  const etaLabel =
    max === 0 ? "Today, within a few hours" :
    min === 0 ? "Today – tomorrow" :
    min === max ? `${min} day${min > 1 ? "s" : ""}` : `${min}–${max} days`;

  const notes: string[] = [];
  if (locality) notes.push(`Routing to ${locality}${country ? `, ${country}` : ""}`);
  if (rural && zone.startsWith("domestic")) notes.push("Rural address — last-mile handover via regional hub");
  if (zone === "international") notes.push("Duties and customs clearance may add time at the border");
  if (freeShipping) notes.push(`Free delivery unlocked over $${freeThreshold}`);
  if (kinds.has("electronics")) notes.push("Wholesale electronics ship as palletised freight");

  return {
    zone, zoneLabel, locality, country, rural,
    shippingUsd, etaMinDays: min, etaMaxDays: max, etaLabel, notes,
  };
}
