"use client";

import { formatUnits } from "viem";
import { useWalletBalance } from "@/hooks/useWalletBalance";

export default function BalanceCard() {
  const { balance, isLoading, isError } = useWalletBalance();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <p className="text-sm text-zinc-500">ETH 잔액</p>
        <div className="mt-2 h-8 w-32 animate-pulse rounded bg-zinc-800" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <p className="text-sm text-red-400">잔액 조회 실패</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <p className="text-sm text-zinc-500">ETH 잔액</p>
      <p className="mt-2 text-3xl font-bold">
        {balance
          ? `${parseFloat(formatUnits(balance.value, balance.decimals)).toFixed(4)} ${balance.symbol}`
          : "0 ETH"}
      </p>
    </div>
  );
}
