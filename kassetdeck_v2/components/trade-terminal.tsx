"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { startMockFeed } from "@/lib/mock-feed";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BuySellModal } from "@/components/trade/buy-sell-modal";
import { DepthChart } from "@/components/trade/depth-chart";
import { OrderBookView } from "@/components/trade/order-book";
import { TradesFeed } from "@/components/trade/trades-feed";
import { MobileTradeTabs, type TradeTab } from "@/components/trade/mobile-tabs";
import { motion } from "framer-motion";
import type { MarketTick, OrderBook, TradePrint } from "@/lib/mock-ws";
import { PopularityPulse } from "@/components/popularity-pulse";

export function TradeTerminal({ symbol, coverUrl }: { symbol: string; coverUrl: string }) {
  const [tick, setTick] = useState<MarketTick | null>(null);
  const [book, setBook] = useState<OrderBook | null>(null);
  const [prints, setPrints] = useState<TradePrint[]>([]);
  const [open, setOpen] = useState<null | "buy" | "sell">(null);
  const [tab, setTab] = useState<TradeTab>("Depth");

  useEffect(() => {
    const stop = startMockFeed({
      symbol,
      onTick: setTick,
      onBook: setBook,
      onTrade: (p) => setPrints((s) => [p, ...s].slice(0, 40))
    });
    return stop;
  }, [symbol]);

  return (
    <div className="grid gap-3 lg:grid-cols-[1.2fr_.8fr]">
      <Card className="overflow-hidden">
        <CardHeader className="relative">
          <div className="absolute inset-0">
            <Image src={coverUrl} alt="cover" fill className="object-cover opacity-35" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
          <div className="relative flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Live price</div>
              <div className="mt-1 text-2xl font-semibold">
                ${tick ? tick.price.toFixed(4) : "—"}
              </div>
              <div className="text-sm text-muted-foreground">
                24h: {tick ? `${tick.change24hPct >= 0 ? "+" : ""}${tick.change24hPct.toFixed(2)}%` : "—"}
              </div>
            </div>
            <PopularityPulse />
          </div>

          <div className="relative mt-4 flex gap-2">
            <Button className="flex-1" size="lg" onClick={() => setOpen("buy")}>
              Buy
            </Button>
            <Button className="flex-1" size="lg" variant="destructive" onClick={() => setOpen("sell")}>
              Sell
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-3"><MobileTradeTabs value={tab} onChange={setTab} />

{/* Desktop layout */}
<div className="hidden md:block space-y-3">
  <DepthChart book={book} />
  <div className="grid gap-3 lg:grid-cols-2">
    <OrderBookView book={book} />
    <TradesFeed prints={prints} />
  </div>
</div>

{/* Mobile swipe panels */}
<div className="md:hidden">
  <motion.div
    className="flex w-full"
    drag="x"
    dragConstraints={{ left: 0, right: 0 }}
    onDragEnd={(_, info) => {
      const dx = info.offset.x;
      const order = ["Depth","Order Book","Trades"] as const;
      const i = order.indexOf(tab);
      if (dx < -60 && i < order.length - 1) setTab(order[i + 1]);
      if (dx > 60 && i > 0) setTab(order[i - 1]);
    }}
  >
    <div className="w-full">
      {tab === "Depth" && <DepthChart book={book} />}
      {tab === "Order Book" && <OrderBookView book={book} />}
      {tab === "Trades" && <TradesFeed prints={prints} />}
    </div>
  </motion.div>
</div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold">Quick convert (mock)</div>
            <div className="text-xs text-muted-foreground">USD → USDC → Trade</div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-2xl border border-border bg-background/40 p-4 text-sm">
              Coming next: USD on-ramp flow (MoonPay/Ramp). For now, treat USDC as available.
            </div>
            <Button variant="secondary" className="w-full" onClick={() => alert("Mock convert. Wire a real onramp later.")}>
              Convert USD to Crypto
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="text-sm font-semibold">Notes</div>
            <div className="text-xs text-muted-foreground">Coin creation is not in the UI.</div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Kassetdeck markets are listed server-side. Only trading + portfolio + markets are exposed to users.
          </CardContent>
        </Card>
      </div>

      <BuySellModal
        open={open !== null}
        side={open ?? "buy"}
        symbol={symbol}
        lastPrice={tick?.price ?? 0}
        onClose={() => setOpen(null)}
      />
    </div>
  );
}
