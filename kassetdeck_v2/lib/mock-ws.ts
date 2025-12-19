export type MarketTick = {
  symbol: string;
  price: number;
  change24hPct: number;
  ts: number;
};

export type BookLevel = { price: number; size: number };
export type OrderBook = { bids: BookLevel[]; asks: BookLevel[]; ts: number; symbol: string };
export type TradePrint = { price: number; size: number; side: "buy" | "sell"; ts: number; symbol: string };

type Handler<T> = (msg: T) => void;

export class MockWebSocket {
  private handlers: Record<string, Array<Handler<any>>> = {};

  on<T>(event: "tick" | "book" | "trade", handler: Handler<T>) {
    this.handlers[event] = this.handlers[event] || [];
    this.handlers[event].push(handler);
    return () => {
      this.handlers[event] = (this.handlers[event] || []).filter(h => h !== handler);
    };
  }

  emit(event: string, payload: any) {
    for (const h of this.handlers[event] || []) h(payload);
  }
}
