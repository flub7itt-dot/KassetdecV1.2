import { MARKETS } from "@/lib/markets";
import { notFound } from "next/navigation";
import { MarketDetail } from "@/components/market-detail";

export default function MarketDetailPage({ params }: { params: { symbol: string } }) {
  const sym = decodeURIComponent(params.symbol);
  const market = MARKETS.find((m) => m.symbol.replace("/", "-") === sym);
  if (!market) return notFound();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">{market.name}</h1>
        <p className="text-sm text-muted-foreground">{market.symbol} • Snapshot (mock)</p>
      </div>
      <MarketDetail symbol={market.symbol} name={market.name} coverUrl={market.coverUrl} />
    </div>
  );
}
