import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateText, streamText, Output, NoObjectGeneratedError } from "ai";
import { createLovableAiGatewayProvider, requireLovableApiKey, AI_MODEL } from "./ai-gateway.server";
import { catalogRows, catalogPromptLines, keywordFallback, LANG_NAMES } from "./ai-catalog";

const SearchInput = z.object({
  query: z.string().min(1).max(300),
  kind: z.enum(["food", "grocery"]).optional(),
  country: z.string().length(2).optional(),
});

export const smartSearch = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => SearchInput.parse(data))
  .handler(async ({ data }) => {
    const rows = catalogRows(data.country ?? null, data.kind);
    const fallback = () => ({
      summary: "",
      ids: keywordFallback(rows, data.query).map((r) => r.id),
    });

    try {
      const gateway = createLovableAiGatewayProvider(requireLovableApiKey());
      const result = streamText({
        model: gateway(AI_MODEL),
        output: Output.object({
          schema: z.object({
            summary: z.string(),
            ids: z.array(z.string()),
          }),
        }),
        prompt: [
          "You are the search engine for OrbitMarket, a global food & grocery marketplace.",
          "Given the shopper's request, pick the most relevant catalog items.",
          "Return at most 16 product ids, best match first, and a one-sentence summary (max 160 characters) of what you found.",
          "Only use ids that appear in the catalog. If nothing fits, return an empty id list.",
          "",
          `Shopper request: ${data.query}`,
          "",
          "Catalog (id | name | kind/category | price | vendor, city country | description):",
          catalogPromptLines(rows),
        ].join("\n"),
      });
      const output = await result.output;
      const valid = new Set(rows.map((r) => r.id));
      const ids = output.ids.filter((id) => valid.has(id)).slice(0, 16);
      if (ids.length === 0) return fallback();
      return { summary: output.summary.slice(0, 200), ids };
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) return fallback();
      console.error("[smartSearch]", error);
      return fallback();
    }
  });

const TranslateInput = z.object({
  text: z.string().min(1).max(2000),
  lang: z.string().min(2).max(5),
});

export const translateCopy = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => TranslateInput.parse(data))
  .handler(async ({ data }) => {
    const target = LANG_NAMES[data.lang] ?? data.lang;
    const gateway = createLovableAiGatewayProvider(requireLovableApiKey());
    const result = await generateText({
      model: gateway(AI_MODEL),
      prompt: `Translate the following marketplace product copy into ${target}. Keep it natural, appetising and roughly the same length. Reply with the translation only, no quotes or notes.\n\n${data.text}`,
    });
    return { text: result.text.trim() };
  });

const BlurbInput = z.object({
  name: z.string().min(1).max(120),
  city: z.string().max(120).optional(),
  country: z.string().max(120).optional(),
  type: z.enum(["restaurant", "grocery"]),
  notes: z.string().max(600).optional(),
});

export const generateStorefrontBlurb = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => BlurbInput.parse(data))
  .handler(async ({ data }) => {
    const gateway = createLovableAiGatewayProvider(requireLovableApiKey());
    const result = await generateText({
      model: gateway(AI_MODEL),
      prompt: [
        "Write a warm, concrete storefront description for a marketplace vendor listing.",
        "2 to 3 sentences, max 400 characters, no emojis, no hashtags, no bullet points.",
        "Mention what shoppers can order and why the place is worth trying.",
        "",
        `Business name: ${data.name}`,
        `Type: ${data.type === "restaurant" ? "Restaurant / food hotel" : "Grocery / provision shop"}`,
        `Location: ${[data.city, data.country].filter(Boolean).join(", ") || "not specified"}`,
        `Owner notes: ${data.notes || "none"}`,
      ].join("\n"),
    });
    return { text: result.text.trim().slice(0, 600) };
  });
