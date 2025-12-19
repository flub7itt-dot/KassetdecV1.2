"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";

const labels = [
  { label: "🔥 Trending", hint: "High social buzz" },
  { label: "⚡ Spiking", hint: "Momentum rising" },
  { label: "🌊 Steady", hint: "Stable interest" },
  { label: "🧊 Cooling", hint: "Momentum fading" }
];

export function PopularityPulse() {
  const pick = () => labels[Math.floor(Math.random() * labels.length)];
  const [state, setState] = useState(pick());

  useEffect(() => {
    const next = () => {
      setState(pick());
      const ms = 5000 + Math.floor(Math.random() * 5000);
      t = window.setTimeout(next, ms);
    };
    let t = window.setTimeout(next, 5000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <Badge className="bg-accent/60">
      <span>{state.label}</span>
      <span className="text-[10px] text-muted-foreground hidden sm:inline">• {state.hint}</span>
    </Badge>
  );
}
