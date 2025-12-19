"use client";

import type { TradePrint } from "@/lib/mock-ws";
import { cn } from "@/lib/utils";

export function TradesFeed({ prints }: { prints: TradePrint[] }) {
  return (
    <div className="rounded-3xl border border-border bg-background/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold">Trades</div>
        <div className="text-[11px] text-muted-foreground">Live prints</div>
      </div>

      <div className="space-y-2 max-h-52 overflow-auto pr-1">
        {prints.slice(0, 20).map((p, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div className={cn("tabular-nums font-medium", p.side === "buy" ? "text-primary" : "text-destructive")}>
              {p.price.toFixed(4)}
            </div>
            <div className="tabular-nums text-muted-foreground">{p.size.toFixed(2)}</div>
            <div className="text-[11px] text-muted-foreground">{new Date(p.ts).toLocaleTimeString()}</div>
          </div>
        ))}
        {prints.length === 0 && <div className="text-xs text-muted-foreground">No prints yet.</div>}
      </div>
    </div>
  );
}
