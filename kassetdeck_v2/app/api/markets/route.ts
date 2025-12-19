import { NextResponse } from "next/server";
import { MARKETS } from "@/lib/markets";

export async function GET() {
  return NextResponse.json({ markets: MARKETS });
}
