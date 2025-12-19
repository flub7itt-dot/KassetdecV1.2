"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { startMockFeed } from "@/lib/mock-feed";
import type { MarketTick } from "@/lib/mock-ws";

type Market = {
  symbol: string;
  name: string;
  coverUrl: string;
};

function fmt(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

export function MarketGrid({ initialMarkets }: { initialMarkets: readonly Market[] }) {
  const [ticks, setTicks] = useState<Record<string, MarketTick>>({});

  useEffect(() => {
    const stop = startMockFeed({
      onTick: (t) => setTicks((s) => ({ ...s, [t.symbol]: t }))
    });
    return stop;
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {initialMarkets.map((m) => {
        const t = ticks[m.symbol];
        const price = t?.price ?? 1 + Math.random() * 10;
        const chg = t?.change24hPct ?? (Math.random() * 6 - 3);
        const up = chg >= 0;
        return (
          <motion.div key={m.symbol} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
            <Link href={`/trade/${m.symbol.replace("/", "-")}`}>
              <Card className="overflow-hidden">
                <div className="relative h-28">
                  <Image src={m.coverUrl} alt={m.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="text-xs font-semibold">{m.name}</div>
                    <div className="text-[11px] text-white/80">{m.symbol}</div>
                  </div>
                </div>
                <CardContent className="pt-3">
                  <div className="flex items-baseline justify-between">
                    <div className="text-sm font-semibold">${fmt(price)}</div>
                    <div className={cn("text-xs font-medium", up ? "text-primary" : "text-destructive")}>
                      {up ? "+" : ""}{chg.toFixed(2)}%
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Tap to trade • Mock live</span>
                    <span className="underline opacity-80">Details</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
