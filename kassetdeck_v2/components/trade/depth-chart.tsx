"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { OrderBook } from "@/lib/mock-ws";

type Pt = { price: number; bidCum?: number; askCum?: number };

export function DepthChart({ book }: { book: OrderBook | null }) {
  const data = useMemo(() => {
    if (!book) return [] as Pt[];
    const bids = [...book.bids].sort((a, b) => a.price - b.price);
    const asks = [...book.asks].sort((a, b) => a.price - b.price);

    let cum = 0;
    const bidPts = bids.map((b) => (cum += b.size, { price: b.price, bidCum: cum } as Pt));

    cum = 0;
    const askPts = asks.map((a) => (cum += a.size, { price: a.price, askCum: cum } as Pt));

    // merge by price
    const map = new Map<number, Pt>();
    for (const p of bidPts) map.set(p.price, { ...(map.get(p.price) ?? { price: p.price }), ...p });
    for (const p of askPts) map.set(p.price, { ...(map.get(p.price) ?? { price: p.price }), ...p });

    return [...map.values()].sort((a, b) => a.price - b.price);
  }, [book]);

  return (
    <div className="rounded-3xl border border-border bg-background/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold">Depth</div>
        <div className="text-[11px] text-muted-foreground">Mock chart</div>
      </div>

      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="price" tick={{ fontSize: 10 }} tickFormatter={(v) => Number(v).toFixed(2)} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{ background: "rgba(18,20,24,0.9)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)" }}
              labelFormatter={(v) => `Price: ${Number(v).toFixed(4)}`}
            />
            <Area type="monotone" dataKey="bidCum" strokeWidth={0} fillOpacity={0.35} />
            <Area type="monotone" dataKey="askCum" strokeWidth={0} fillOpacity={0.35} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
