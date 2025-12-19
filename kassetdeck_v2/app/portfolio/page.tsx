import { Portfolio } from "@/components/portfolio";

export default function PortfolioPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Portfolio</h1>
        <p className="text-sm text-muted-foreground">Mock holdings, PnL, and recent activity.</p>
      </div>
      <Portfolio />
    </div>
  );
}
