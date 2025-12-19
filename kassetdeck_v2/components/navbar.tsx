"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export function Navbar() {
  return (
    <div className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-2xl bg-primary/20 border border-border grid place-items-center">
            <span className="text-sm font-bold text-primary">K</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide">KASSETDECK</div>
            <div className="text-xs text-muted-foreground">Trade artists vs USDC</div>
          </div>
        </Link>

        <div className="hidden items-center gap-6 text-sm md:flex">
          <Link className="text-muted-foreground hover:text-foreground" href="/markets">Markets</Link>
          <Link className="text-muted-foreground hover:text-foreground" href="/convert/usd">Convert</Link>
          <Link className="text-muted-foreground hover:text-foreground" href="/portfolio">Portfolio</Link>
        </div>

        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            variant="secondary"
            className="rounded-2xl"
            onClick={() => alert("Mock wallet connect — wire a real connector later.")}
          >
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
