"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { startMockFeed } from "@/lib/mock-feed";
import type { MarketTick } from "@/lib/mock-ws";
import { PopularityPulse } from "@/components/popularity-pulse";

type Pt = { t: number; p: number };

export function MarketDetail({ symbol, name, coverUrl }: { symbol: string; name: string; coverUrl: string }) {
  const [tick, setTick] = useState<MarketTick | null>(null);
  const [series, setSeries] = useState<Pt[]>([]);

  useEffect(() => {
    const stop = startMockFeed({
      symbol,
      onTick: (t) => {
        setTick(t);
        setSeries((s) => [...s.slice(-59), { t: t.ts, p: t.price }]);
      }
    });
    return stop;
  }, [symbol]);

  const chg = tick?.change24hPct ?? 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="relative">
        <div className="absolute inset-0">
          <Image src={coverUrl} alt={name} fill className="object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <div className="text-xs text-muted-foreground">Live price</div>
            <div className="mt-1 text-3xl font-semibold tabular-nums">
              ${tick ? tick.price.toFixed(4) : "—"}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              24h: {chg >= 0 ? "+" : ""}{chg.toFixed(2)}%
            </div>
          </div>
          <PopularityPulse />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-3xl border border-border bg-background/40 p-4">
          <div className="mb-2 text-sm font-semibold">Price (last ~60 ticks)</div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series.map((x) => ({ t: x.t, p: x.p }))}>
                <XAxis dataKey="t" hide />
                <YAxis width={40} tick={{ fontSize: 10 }} domain={["auto", "auto"]} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(18,20,24,0.9)",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.08)"
                  }}
                  labelFormatter={() => ""}
                  formatter={(v: any) => [`$${Number(v).toFixed(4)}`, "Price"]}
                />
                <Line type="monotone" dataKey="p" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button asChild size="lg" className="w-full">
            <Link href={`/trade/${symbol.replace("/", "-")}`}>Trade {symbol}</Link>
          </Button>
          <Button asChild size="lg" variant="secondary" className="w-full">
            <Link href="/convert/usd">Convert USD → USDC</Link>
          </Button>
        </div>

        <div className="text-[11px] text-muted-foreground">
          Product rule: users can only trade listed markets. No coin/token creation appears in the UI.
        </div>
      </CardContent>
    </Card>
  );
}
