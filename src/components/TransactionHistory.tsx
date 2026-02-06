"use client";

import { useTransactions } from "@/hooks/useTransactions";

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function TransactionHistory() {
  const { data: transactions } = useTransactions();

  if (!transactions || transactions.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h3 className="mb-4 text-lg font-semibold">트랜잭션 히스토리</h3>
        <p className="text-sm text-zinc-500">트랜잭션 내역이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h3 className="mb-4 text-lg font-semibold">트랜잭션 히스토리</h3>
      <div className="space-y-2">
        {transactions.map((tx, idx) => (
          <a
            key={`${tx.hash}-${idx}`}
            href={`https://etherscan.io/tx/${tx.hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-4 py-3 transition-colors hover:bg-zinc-800"
          >
            <div className="flex items-center gap-3">
              <span
                className={`rounded-md px-2 py-1 text-xs font-semibold ${
                  tx.direction === "sent"
                    ? "bg-red-900/50 text-red-400"
                    : "bg-green-900/50 text-green-400"
                }`}
              >
                {tx.direction === "sent" ? "송금" : "수신"}
              </span>
              <div>
                <p className="text-sm font-medium">
                  {tx.direction === "sent"
                    ? `To: ${shortenAddress(tx.to || "")}`
                    : `From: ${shortenAddress(tx.from)}`}
                </p>
                <p className="text-xs text-zinc-500">
                  {shortenAddress(tx.hash)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm">
                {tx.value !== null ? tx.value.toFixed(4) : "0"}{" "}
                {tx.asset || "ETH"}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
