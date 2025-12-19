import { MARKETS } from "@/lib/markets";
import { MarketGrid } from "@/components/market-grid";

export default function MarketsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Markets</h1>
        <p className="text-sm text-muted-foreground">
          10 live spot pairs vs USDC (mock). Tap a card to open the trading screen.
        </p>
      </div>
      <MarketGrid initialMarkets={MARKETS} />
    </div>
  );
}
