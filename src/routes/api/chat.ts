import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, stepCountIs, tool, type UIMessage } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider, requireLovableApiKey, AI_MODEL } from "@/lib/ai-gateway.server";
import { catalogRows, keywordFallback } from "@/lib/ai-catalog";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let key: string;
        try {
          key = requireLovableApiKey();
        } catch {
          return new Response("AI is not configured for this app yet.", { status: 500 });
        }

        const body = (await request.json()) as {
          messages: UIMessage[];
          country?: string;
          lang?: string;
        };

        const gateway = createLovableAiGatewayProvider(key);

        const result = streamText({
          model: gateway(AI_MODEL),
          stopWhen: stepCountIs(50),
          system: [
            "You are the OrbitMarket shopping assistant for a global restaurant and grocery marketplace.",
            "Help shoppers find dishes, provisions and vendors, compare prices (USD) and plan a cart.",
            "Always use the search_catalog tool before recommending items — never invent products or prices.",
            "Be concise: short paragraphs or compact lists. Mention the vendor and city for each suggestion.",
            body.country ? `The shopper is browsing from country code ${body.country}.` : "",
            body.lang ? `Reply in the language with code "${body.lang}".` : "",
          ]
            .filter(Boolean)
            .join("\n"),
          messages: await convertToModelMessages(body.messages),
          tools: {
            search_catalog: tool({
              description: "Search the OrbitMarket catalog for available products by keywords.",
              inputSchema: z.object({
                query: z.string().describe("Keywords describing what the shopper wants."),
                kind: z.enum(["food", "grocery"]).optional(),
              }),
              execute: async ({ query, kind }) => {
                const rows = catalogRows(body.country ?? null, kind);
                return { results: keywordFallback(rows, query, 12) };
              },
            }),
          },
        });

        return result.toUIMessageStreamResponse();
      },
    },
  },
});
