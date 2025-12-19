import type { MarketTick, OrderBook, TradePrint } from "@/lib/mock-ws";
import { MARKETS } from "@/lib/markets";

function randAround(x: number, pct: number) {
  const m = 1 + (Math.random() * 2 - 1) * pct;
  return x * m;
}

const state: Record<string, { price: number; change: number }> = {};
for (const m of MARKETS) {
  state[m.symbol] = {
    price: 1 + Math.random() * 50,
    change: Math.random() * 10 - 5
  };
}

export function startMockFeed(opts: {
  onTick?: (t: MarketTick) => void;
  onBook?: (b: OrderBook) => void;
  onTrade?: (p: TradePrint) => void;
  symbol?: string;
}) {
  const { onTick, onBook, onTrade, symbol } = opts;

  const tickMs = 700;      // lively
  const bookMs = 450;      // order book updates
  const tradeMs = 500;     // prints

  const symbols = symbol ? [symbol] : MARKETS.map(m => m.symbol);

  const tickTimer = setInterval(() => {
    for (const s of symbols) {
      const st = state[s];
      st.price = Math.max(0.001, randAround(st.price, 0.008));
      st.change = Math.max(-20, Math.min(20, st.change + (Math.random() * 0.6 - 0.3)));
      onTick?.({ symbol: s, price: st.price, change24hPct: st.change, ts: Date.now() });
    }
  }, tickMs);

  const bookTimer = setInterval(() => {
    for (const s of symbols) {
      const mid = state[s].price;
      const mk = (dir: -1 | 1, i: number) => ({
        price: +(mid * (1 + dir * (0.0008 * (i + 1)))).toFixed(4),
        size: +(Math.random() * 1200 + 20).toFixed(2)
      });
      const bids = Array.from({ length: 12 }, (_, i) => mk(-1, i));
      const asks = Array.from({ length: 12 }, (_, i) => mk( 1, i));
      onBook?.({ symbol: s, bids, asks, ts: Date.now() });
    }
  }, bookMs);

  const tradeTimer = setInterval(() => {
    for (const s of symbols) {
      const mid = state[s].price;
      const side = Math.random() > 0.5 ? "buy" : "sell" as const;
      const price = side === "buy" ? randAround(mid, 0.0012) : randAround(mid, 0.0012);
      const size = Math.random() * 300 + 5;
      onTrade?.({ symbol: s, side, price: +price.toFixed(4), size: +size.toFixed(2), ts: Date.now() });
    }
  }, tradeMs);

  return () => {
    clearInterval(tickTimer);
    clearInterval(bookTimer);
    clearInterval(tradeTimer);
  };
}
