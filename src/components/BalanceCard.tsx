"use client";

import { formatUnits } from "viem";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { useTokenPrices } from "@/hooks/useTokenPrices";

export default function BalanceCard() {
  const { balance } = useWalletBalance();
  const { data: prices } = useTokenPrices();

  const ethAmount = balance
    ? parseFloat(formatUnits(balance.value, balance.decimals))
    : 0;
  const ethPrice = prices?.["eth"];
  const usdValue = ethPrice ? ethAmount * ethPrice.usd : null;
  const change24h = ethPrice?.usd_24h_change ?? null;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <p className="text-sm text-zinc-500">ETH 잔액</p>
      <p className="mt-2 text-3xl font-bold">
        {balance
          ? `${ethAmount.toFixed(4)} ${balance.symbol}`
          : "0 ETH"}
      </p>
      {usdValue !== null && (
        <div className="mt-1 flex items-center gap-2">
          <p className="text-sm text-zinc-400">
            ≈ ${usdValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          {change24h !== null && (
            <span
              className={`text-xs font-medium ${
                change24h >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {change24h >= 0 ? "+" : ""}
              {change24h.toFixed(2)}% 24h
            </span>
          )}
        </div>
      )}
    </div>
  );
}
