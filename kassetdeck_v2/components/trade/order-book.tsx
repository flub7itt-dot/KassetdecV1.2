"use client";

import { cn } from "@/lib/utils";
import type { OrderBook } from "@/lib/mock-ws";

function Row({ price, size, side }: { price: number; size: number; side: "bid" | "ask" }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <div className={cn("tabular-nums", side === "bid" ? "text-primary" : "text-destructive")}>
        {price.toFixed(4)}
      </div>
      <div className="text-muted-foreground tabular-nums">{size.toFixed(2)}</div>
    </div>
  );
}

export function OrderBookView({ book }: { book: OrderBook | null }) {
  const bids = book?.bids ?? [];
  const asks = book?.asks ?? [];
  return (
    <div className="rounded-3xl border border-border bg-background/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold">Order book</div>
        <div className="text-[11px] text-muted-foreground">{book ? "Live" : "—"}</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <div className="text-[11px] text-muted-foreground">Bids</div>
          {bids.slice(0, 10).map((l, i) => <Row key={i} price={l.price} size={l.size} side="bid" />)}
        </div>
        <div className="space-y-2">
          <div className="text-[11px] text-muted-foreground">Asks</div>
          {asks.slice(0, 10).map((l, i) => <Row key={i} price={l.price} size={l.size} side="ask" />)}
        </div>
      </div>
    </div>
  );
}
