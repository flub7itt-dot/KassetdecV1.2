"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MARKETS } from "@/lib/markets";

type Holding = { symbol: string; qty: number; avg: number; last: number };

function rand(n: number) { return Math.random() * n; }

export function Portfolio() {
  const holdings = useMemo(() => {
    const pick = MARKETS.slice(0, 6);
    return pick.map((m) => {
      const avg = 1 + rand(30);
      const last = avg * (1 + (Math.random() * 0.12 - 0.06));
      const qty = 5 + rand(200);
      return { symbol: m.symbol, qty, avg, last } as Holding;
    });
  }, []);

  const totals = useMemo(() => {
    const cost = holdings.reduce((s, h) => s + h.qty * h.avg, 0);
    const value = holdings.reduce((s, h) => s + h.qty * h.last, 0);
    const pnl = value - cost;
    const pnlPct = cost ? (pnl / cost) * 100 : 0;
    return { cost, value, pnl, pnlPct };
  }, [holdings]);

  return (
    <div className="space-y-3">
      <Card>
        <CardHeader>
          <div className="text-xs text-muted-foreground">Total equity (mock)</div>
          <div className="mt-1 flex items-end justify-between">
            <div className="text-3xl font-semibold tabular-nums">${totals.value.toFixed(2)}</div>
            <div className={totals.pnl >= 0 ? "text-primary" : "text-destructive"}>
              {totals.pnl >= 0 ? "+" : ""}${totals.pnl.toFixed(2)} ({totals.pnlPct >= 0 ? "+" : ""}{totals.pnlPct.toFixed(2)}%)
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href="/markets">Find markets</Link>
          </Button>
          <Button variant="secondary" className="flex-1" onClick={() => alert("Mock deposit. Add real custody later.")}>
            Deposit USDC
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-sm font-semibold">Holdings</div>
          <div className="text-xs text-muted-foreground">Tap to trade</div>
        </CardHeader>
        <CardContent className="space-y-3">
          {holdings.map((h) => {
            const pnl = (h.last - h.avg) * h.qty;
            const pnlPct = ((h.last - h.avg) / h.avg) * 100;
            return (
              <Link key={h.symbol} href={`/trade/${h.symbol.replace("/", "-")}`}>
                <div className="rounded-2xl border border-border bg-background/40 p-4 hover:bg-accent transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">{h.symbol}</div>
                      <div className="text-xs text-muted-foreground tabular-nums">
                        {h.qty.toFixed(2)} • Avg ${h.avg.toFixed(4)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold tabular-nums">${(h.qty * h.last).toFixed(2)}</div>
                      <div className={pnl >= 0 ? "text-xs text-primary" : "text-xs text-destructive"}>
                        {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)} ({pnlPct >= 0 ? "+" : ""}{pnlPct.toFixed(2)}%)
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
