import { MARKETS } from "@/lib/markets";
import { TradeTerminal } from "@/components/trade-terminal";
import { notFound } from "next/navigation";

export default function TradePage({ params }: { params: { symbol: string } }) {
  const sym = decodeURIComponent(params.symbol);
  const market = MARKETS.find(m => m.symbol.replace("/", "-") === sym);
  if (!market) return notFound();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">{market.symbol}</h1>
        <p className="text-sm text-muted-foreground">{market.name} • Spot (mock matching)</p>
      </div>
      <TradeTerminal symbol={market.symbol} coverUrl={market.coverUrl} />
    </div>
  );
}
