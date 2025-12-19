import { ConvertUsd } from "@/components/convert/convert-usd";

export default function ConvertUsdPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Convert USD</h1>
        <p className="text-sm text-muted-foreground">
          Mock on-ramp flow (USD → USDC). Replace with MoonPay/Ramp later.
        </p>
      </div>
      <ConvertUsd />
    </div>
  );
}
