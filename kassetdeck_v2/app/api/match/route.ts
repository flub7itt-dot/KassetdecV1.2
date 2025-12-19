import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const Body = z.object({
  symbol: z.string(),
  side: z.enum(["BUY", "SELL"]),
  price: z.number().positive(),
  quantity: z.number().positive()
});

// This is a MOCK matching endpoint.
// - In production: validate auth, balance checks, risk, matching engine, custody.
export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", issues: parsed.error.issues }, { status: 400 });
  }

  const { symbol, side, price, quantity } = parsed.data;

  // Create a demo user on first run (so Prisma schema is exercised).
  const email = "demo@kassetdeck.local";
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "Demo" }
  });

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      symbol,
      side,
      price: price.toString(),
      quantity: quantity.toString(),
      status: "FILLED",
      filledQty: quantity.toString()
    }
  });

  // Create a mock trade print (one fill)
  const trade = await prisma.trade.create({
    data: {
      symbol,
      price: price.toString(),
      quantity: quantity.toString(),
      makerSide: side === "BUY" ? "SELL" : "BUY",
      orderId: order.id
    }
  });

  return NextResponse.json({ ok: true, orderId: order.id, tradeId: trade.id });
}
