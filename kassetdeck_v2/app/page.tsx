import Image from "next/image";
import Link from "next/link";
import { MARKETS } from "@/lib/markets";
import { PopularityPulse } from "@/components/popularity-pulse";
import { MarketGrid } from "@/components/market-grid";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1600&q=80"
            alt="Hero"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="relative p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground">KASSETDECK • Spot (Mock)</div>
            <PopularityPulse />
          </div>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            Trade artists vs USDC with a Robinhood‑style experience.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Wallet-based trading UI with real-time order book, depth chart, and prints — mock feeds for now.
            Coin creation is backend/admin-only (not in this app).
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/markets">View Markets</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
              <Link href="/portfolio">Open Portfolio</Link>
            </Button>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3 text-xs text-muted-foreground sm:max-w-md">
            <div className="rounded-2xl border border-border bg-background/40 p-3">
              <div className="text-foreground font-semibold">10</div>
              <div>Spot pairs</div>
            </div>
            <div className="rounded-2xl border border-border bg-background/40 p-3">
              <div className="text-foreground font-semibold">USDC</div>
              <div>Quote asset</div>
            </div>
            <div className="rounded-2xl border border-border bg-background/40 p-3">
              <div className="text-foreground font-semibold">Mock</div>
              <div>Live feeds</div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Featured markets</h2>
          <Link href="/markets" className="text-sm text-muted-foreground hover:text-foreground">
            See all
          </Link>
        </div>
        <MarketGrid initialMarkets={MARKETS} />
      </section>
    </div>
  );
}
