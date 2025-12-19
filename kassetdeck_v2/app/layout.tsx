import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { BottomNav } from "@/components/bottom-nav";

export const metadata: Metadata = {
  title: "KASSETDECK",
  description: "Mobile-first crypto trading UI (mock) — artist pairs vs USDC."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans">
        <ThemeProvider>
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 pb-28 pt-4">{children}</main>
          <BottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
