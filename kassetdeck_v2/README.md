# KASSETDECK (Next.js 15 App Router) — mock trading terminal

A mobile-first, Robinhood-ish dark UI for a crypto trading app with:
- 10 artist spot pairs vs **USDC** (mock prices)
- Real-time **order book**, **depth chart**, **trades feed** (mock stream)
- Buy/Sell modal with **swipe-to-confirm**
- Portfolio page with mock holdings + PnL
- USD → USDC Convert flow (mock)
- Prisma schema for users, balances, orders, trades
- Neon Postgres compatible

> **Important:** There is **no coin creation UI**. Market listings are server-controlled (backend/admin only).

## One-click deploy

### Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOURNAME_OR_ORG/kassetdeck)

### Export to GitHub
- Create a new repo and push this code:
  ```bash
  git init
  git add .
  git commit -m "init kassetdeck"
  git branch -M main
  git remote add origin https://github.com/YOURNAME/kassetdeck.git
  git push -u origin main
  ```

## Local dev

### 1) Install
```bash
npm i
```

### 2) Configure env
Create **.env**:
```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require"
```

> Neon: create a database and copy the connection string into `DATABASE_URL`.

### 3) Migrate + generate
```bash
npx prisma migrate dev --name init
```

### 4) Run
```bash
npm run dev
```

Open http://localhost:3000

Pages:
- `/` Home
- `/markets` Markets
- `/markets/[symbol]` Market detail
- `/trade/[symbol]` Trade terminal
- `/convert/usd` Convert USD → USDC
- `/portfolio` Portfolio

## Where the “real-time WebSocket” is (mock)

This project uses a **MockWebSocket-like generator** (`lib/mock-feed.ts`) that pushes updates on intervals.  
In production, replace it with:
- A real WS server (Node `ws`, Socket.IO, etc.) running on a separate service, **or**
- A managed realtime service (Ably, Pusher, PubNub), **or**
- A streaming layer (Kafka -> websocket gateway)

Vercel serverless is not ideal for long-lived websocket connections.

## Adding Fireblocks later (high-level)

1) **Create vault accounts** per user or per platform policy  
2) **Deposit addresses**:
   - Generate addresses via Fireblocks API
   - Show deposit addresses in Wallet UI
3) **Withdrawals**:
   - Users request withdrawal in UI
   - Backend enforces policy (KYC/AML, limits, risk)
   - Backend calls Fireblocks to create a transaction
4) **Signing & approvals**:
   - Use Fireblocks policy engine for approval workflows
   - Keep hot balances low; use automated refills
5) **Trade settlement**:
   - For CEX: internal ledger + periodic chain settlement
   - For hybrid: on-chain settlement per trade/batch

## Notes

- This is a UI + mock backend skeleton.
- Replace the mock matching `/api/match` with a real engine (Rust/Go service) once ready.
