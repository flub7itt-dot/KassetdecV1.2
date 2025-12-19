"use client";

import { useMemo, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function BuySellModal({
  open,
  side,
  symbol,
  lastPrice,
  onClose
}: {
  open: boolean;
  side: "buy" | "sell";
  symbol: string;
  lastPrice: number;
  onClose: () => void;
}) {
  const [qty, setQty] = useState("10");
  const [price, setPrice] = useState(lastPrice ? lastPrice.toFixed(4) : "0");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");

  const total = useMemo(() => {
    const q = Number(qty || 0);
    const p = Number(price || 0);
    return q * p;
  }, [qty, price]);

  const trackW = 280;
  const x = useMotionValue(0);
  const progress = useTransform(x, [0, trackW - 56], [0, 1]);
  const fillW = useTransform(progress, (v) => `${clamp(v * 100, 0, 100)}%`);

  async function submit() {
    setStatus("submitting");
    // Mock matching engine route
    await fetch("/api/match", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        symbol,
        side: side.toUpperCase(),
        price: Number(price),
        quantity: Number(qty)
      })
    });
    setStatus("done");
    setTimeout(() => {
      setStatus("idle");
      onClose();
      x.set(0);
    }, 700);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="p-0 overflow-hidden">
        <div className="p-5">
          <div className="text-xs text-muted-foreground">Order</div>
          <div className="mt-1 flex items-center justify-between">
            <div className="text-lg font-semibold">{side === "buy" ? "Buy" : "Sell"} {symbol}</div>
            <div className={cn("text-xs font-medium", side === "buy" ? "text-primary" : "text-destructive")}>
              {side.toUpperCase()}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border bg-background/40 p-3">
              <div className="text-[11px] text-muted-foreground">Quantity</div>
              <input
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                inputMode="decimal"
                className="mt-1 w-full bg-transparent text-base outline-none tabular-nums"
              />
            </div>
            <div className="rounded-2xl border border-border bg-background/40 p-3">
              <div className="text-[11px] text-muted-foreground">Limit Price</div>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                inputMode="decimal"
                className="mt-1 w-full bg-transparent text-base outline-none tabular-nums"
              />
            </div>
          </div>

          <div className="mt-3 rounded-2xl border border-border bg-background/40 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Estimated total</span>
              <span className="tabular-nums font-semibold">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-5">
            <div className="text-[11px] text-muted-foreground mb-2">Swipe to confirm</div>

            <div className="relative h-14 w-full rounded-3xl border border-border bg-background/40 overflow-hidden">
              <motion.div className={cn("absolute inset-y-0 left-0", side === "buy" ? "bg-primary/20" : "bg-destructive/20")}
                style={{ width: fillW }}
              />

              <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground pointer-events-none">
                {status === "idle" && "Swipe →"}
                {status === "submitting" && "Submitting…"}
                {status === "done" && "Filled (mock) ✓"}
              </div>

              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: trackW - 56 }}
                style={{ x }}
                onDragEnd={(_, info) => {
                  const right = trackW - 56;
                  if (info.point.x > right * 0.75 && status === "idle") {
                    x.set(right);
                    submit();
                  } else {
                    x.set(0);
                  }
                }}
                className={cn(
                  "absolute left-1 top-1 grid h-12 w-12 place-items-center rounded-2xl border border-border bg-card shadow-soft",
                  status !== "idle" && "opacity-60 pointer-events-none"
                )}
              >
                <span className="text-xs font-semibold">✓</span>
              </motion.div>
            </div>

            <div className="mt-3 flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant={side === "buy" ? "default" : "destructive"}
                className="flex-1"
                onClick={() => alert("Use swipe to confirm (Robinhood-style).")}
              >
                {side === "buy" ? "Buy" : "Sell"}
              </Button>
            </div>

            <div className="mt-3 text-[11px] text-muted-foreground">
              Note: This is a mock order flow. Wire a real matching engine / custody later.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
