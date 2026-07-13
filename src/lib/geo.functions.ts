import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";

export type GeoInfo = {
  country: string | null;
  city: string | null;
  region: string | null;
};

export const detectGeo = createServerFn({ method: "GET" }).handler(async (): Promise<GeoInfo> => {
  const headers = getRequestHeaders() as unknown as Record<string, string | undefined>;
  const h = (k: string) => (headers[k] ?? headers[k.toLowerCase()] ?? null) as string | null;

  // Cloudflare Workers headers (primary), with common fallbacks.
  const country =
    h("cf-ipcountry") ||
    h("x-vercel-ip-country") ||
    h("x-country-code") ||
    null;
  const city =
    h("cf-ipcity") ||
    h("x-vercel-ip-city") ||
    null;
  const region =
    h("cf-region") ||
    h("x-vercel-ip-country-region") ||
    null;

  return {
    country: country ? country.toUpperCase() : null,
    city: city ? decodeURIComponent(city) : null,
    region: region ? decodeURIComponent(region) : null,
  };
});
