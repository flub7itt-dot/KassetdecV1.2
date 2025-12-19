"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function ConvertUsd() {
  const [usd, setUsd] = useState("100");
  const [stage, setStage] = useState<"amount" | "review" | "done">("amount");

  const feePct = 1.25; // mock fee
  const fx = 1.0; // USD->USDC
  const parsed = Number(usd || 0);
  const fee = (parsed * feePct) / 100;
  const receive = Math.max(0, parsed - fee) * fx;

  const copy = useMemo(() => {
    if (stage === "amount") return { title: "Enter amount", cta: "Continue" };
    if (stage === "review") return { title: "Review", cta: "Swipe to confirm" };
    return { title: "Complete", cta: "Done" };
  }, [stage]);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="text-sm font-semibold">{copy.title}</div>
        <div className="text-xs text-muted-foreground">This is a UI mock for the on-ramp flow.</div>
      </CardHeader>
      <CardContent className="space-y-4">
        {stage !== "done" && (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background/40 p-4">
              <div className="text-[11px] text-muted-foreground">Pay (USD)</div>
              <input
                value={usd}
                onChange={(e) => setUsd(e.target.value)}
                inputMode="decimal"
                className="mt-2 w-full bg-transparent text-2xl font-semibold tabular-nums outline-none"
              />
            </div>
            <div className="rounded-2xl border border-border bg-background/40 p-4">
              <div className="text-[11px] text-muted-foreground">Receive (USDC)</div>
              <div className="mt-2 text-2xl font-semibold tabular-nums">{receive.toFixed(2)}</div>
              <div className="mt-1 text-xs text-muted-foreground">Fee: ${fee.toFixed(2)} ({feePct.toFixed(2)}%)</div>
            </div>
          </div>
        )}

        {stage === "review" && (
          <div className="rounded-2xl border border-border bg-background/40 p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">You pay</span>
              <span className="tabular-nums font-semibold">${parsed.toFixed(2)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-muted-foreground">Fee</span>
              <span className="tabular-nums">${fee.toFixed(2)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-muted-foreground">You receive</span>
              <span className="tabular-nums font-semibold">{receive.toFixed(2)} USDC</span>
            </div>
          </div>
        )}

        {stage === "done" && (
          <div className="rounded-3xl border border-border bg-background/40 p-6 text-center">
            <div className="text-2xl font-semibold">USDC added ✓</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Mock completion. Wire a real on-ramp provider to fund balances.
            </div>
          </div>
        )}

        {stage === "amount" && (
          <Button size="lg" className="w-full" onClick={() => setStage("review")}>
            Continue
          </Button>
        )}

        {stage === "review" && <SwipeConfirm onConfirm={() => setStage("done")} />}

        {stage === "done" && (
          <Button size="lg" className="w-full" variant="secondary" onClick={() => setStage("amount")}>
            Convert again
          </Button>
        )}

        <div className="text-[11px] text-muted-foreground">
          Production note: this flow typically requires KYC/AML checks depending on jurisdiction and provider.
        </div>
      </CardContent>
    </Card>
  );
}

function SwipeConfirm({ onConfirm }: { onConfirm: () => void }) {
  const trackW = 320;
  const knob = 54;

  const [x, setX] = useState(0);
  const pct = clamp(x / (trackW - knob), 0, 1);

  return (
    <div>
      <div className="mb-2 text-[11px] text-muted-foreground">Swipe to confirm</div>
      <div className="relative h-14 w-full overflow-hidden rounded-3xl border border-border bg-background/40">
        <div className="absolute inset-y-0 left-0 bg-primary/20" style={{ width: `${pct * 100}%` }} />
        <div className="absolute inset-0 grid place-items-center text-sm text-muted-foreground pointer-events-none">
          Swipe →
        </div>

        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: trackW - knob }}
          onDrag={(e, info) => setX(info.point.x)}  // rough visual; ok for mock
          onDragEnd={(_, info) => {
            const right = trackW - knob;
            if (info.point.x > right * 0.75) onConfirm();
            setX(0);
          }}
          className="absolute left-1 top-1 grid h-12 w-12 place-items-center rounded-2xl border border-border bg-card shadow-soft"
        >
          ✓
        </motion.div>
      </div>
    </div>
  );
}
