import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Bot, Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "Spicy vegetarian dinner under $15",
  "Bulk rice and lentils for a small shop",
  "Something light from a Tokyo kitchen",
];

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { country, lang } = useLocale();

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: () => ({ country, lang }),
    }),
  });

  const busy = status === "submitted" || status === "streaming";

  const submit = (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    setInput("");
    void sendMessage({ text: value });
  };

  return (
    <>
      <Button
        onClick={() => setOpen((o) => !o)}
        size="lg"
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full p-0 shadow-glow"
        aria-label="Open shopping assistant"
      >
        {open ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
      </Button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[min(70vh,32rem)] w-[min(92vw,24rem)] flex-col overflow-hidden rounded-3xl border bg-card shadow-glow">
          <header className="flex items-center gap-2 border-b px-4 py-3">
            <div className="grid h-8 w-8 place-items-center rounded-xl gradient-hero text-primary-foreground">
              <Bot className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight">Shopping assistant</p>
              <p className="truncate text-[11px] text-muted-foreground">Finds dishes, provisions & vendors</p>
            </div>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm">
            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-muted-foreground">Ask me what you feel like eating or stocking up on.</p>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="block w-full rounded-xl border px-3 py-2 text-left text-xs hover:bg-muted"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m) => {
              const text = m.parts
                .filter((p) => p.type === "text")
                .map((p) => (p as { text: string }).text)
                .join("");
              if (!text) return null;
              return (
                <div
                  key={m.id}
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2",
                    m.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  {text}
                </div>
              );
            })}

            {busy && <p className="text-xs text-muted-foreground">Thinking…</p>}
            {error && <p className="text-xs text-destructive">{error.message}</p>}
          </div>

          <form
            className="flex items-center gap-2 border-t p-3"
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="What are you craving?"
              className="h-10"
            />
            <Button type="submit" size="icon" disabled={busy || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
