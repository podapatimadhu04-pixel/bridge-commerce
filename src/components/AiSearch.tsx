import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { smartSearch } from "@/lib/ai.functions";
import { useLocale } from "@/lib/i18n";
import { toast } from "sonner";

export function AiSearch({
  kind,
  onResults,
}: {
  kind: "food" | "grocery";
  onResults: (result: { ids: string[]; summary: string } | null) => void;
}) {
  const { country } = useLocale();
  const search = useServerFn(smartSearch);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const run = async () => {
    const query = q.trim();
    if (!query || loading) return;
    setLoading(true);
    try {
      const res = await search({ data: { query, kind, ...(country ? { country } : {}) } });
      setSummary(res.summary || `${res.ids.length} matches`);
      onResults({ ids: res.ids, summary: res.summary });
    } catch {
      toast.error("AI search is unavailable right now.");
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setQ("");
    setSummary(null);
    onResults(null);
  };

  return (
    <div className="mb-4 rounded-2xl border bg-card p-3 shadow-soft">
      <form
        className="flex flex-wrap items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          void run();
        }}
      >
        <Sparkles className="h-4 w-4 text-primary" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={kind === "food" ? "Describe a craving — “warm spicy noodles under $12”" : "Describe what you need — “bulk staples for a village shop”"}
          className="h-10 min-w-[12rem] flex-1"
        />
        <Button type="submit" disabled={loading || !q.trim()}>
          {loading ? "Searching…" : "AI search"}
        </Button>
        {summary !== null && (
          <Button type="button" variant="ghost" size="icon" onClick={clear} aria-label="Clear AI search">
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>
      {summary && <p className="mt-2 text-xs text-muted-foreground">{summary}</p>}
    </div>
  );
}
