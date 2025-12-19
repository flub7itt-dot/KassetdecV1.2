"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, LineChart, PieChart, ArrowLeftRight } from "lucide-react";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/markets", label: "Markets", icon: LineChart },
  { href: "/convert/usd", label: "Convert", icon: ArrowLeftRight },
  { href: "/portfolio", label: "Portfolio", icon: PieChart }
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/80 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-4 px-2 py-2">
        {items.map((it) => {
          const active = pathname === it.href || (it.href !== "/" && pathname.startsWith(it.href));
          const Icon = it.icon;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] transition active:scale-[0.98]",
                active ? "text-foreground bg-accent" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {it.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
