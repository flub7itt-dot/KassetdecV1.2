"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const tabs = ["Depth", "Order Book", "Trades"] as const;
export type TradeTab = (typeof tabs)[number];

export function MobileTradeTabs({
  value,
  onChange
}: {
  value: TradeTab;
  onChange: (v: TradeTab) => void;
}) {
  const idx = tabs.indexOf(value);

  return (
    <div className="md:hidden">
      <div className="relative rounded-3xl border border-border bg-background/40 p-1">
        <motion.div
          className="absolute top-1 bottom-1 w-1/3 rounded-2xl bg-accent"
          animate={{ x: `${idx * 100}%` }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
        <div className="relative grid grid-cols-3">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => onChange(t)}
              className={cn(
                "h-10 rounded-2xl text-xs font-medium transition",
                t === value ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-2 text-[11px] text-muted-foreground">
        Tip: swipe left/right on the panel below.
      </div>
    </div>
  );
}
