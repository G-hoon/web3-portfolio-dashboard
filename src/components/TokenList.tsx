"use client";

import { useTokenBalances } from "@/hooks/useTokenBalances";
import { useTokenPrices } from "@/hooks/useTokenPrices";

export default function TokenList() {
  const { data: tokens } = useTokenBalances();
  const { data: prices } = useTokenPrices();

  if (!tokens || tokens.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h3 className="mb-4 text-lg font-semibold">ERC-20 토큰</h3>
        <p className="text-sm text-zinc-500">보유한 ERC-20 토큰이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h3 className="mb-4 text-lg font-semibold">ERC-20 토큰</h3>
      <div className="space-y-3">
        {tokens.map((token) => {
          const priceData = prices?.[token.contractAddress.toLowerCase()];
          const tokenBalance = parseFloat(token.balance);
          const usdValue = priceData ? tokenBalance * priceData.usd : null;
          const change24h = priceData?.usd_24h_change ?? null;

          return (
            <div
              key={token.contractAddress}
              className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-4 py-3"
            >
              <div className="flex items-center gap-3">
                {token.logo ? (
                  <img
                    src={token.logo}
                    alt={token.symbol}
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700 text-xs font-bold">
                    {token.symbol.slice(0, 2)}
                  </div>
                )}
                <div>
                  <p className="font-medium">{token.name}</p>
                  <p className="text-sm text-zinc-500">{token.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm">{token.balance}</p>
                {usdValue !== null && (
                  <div className="flex items-center justify-end gap-1.5">
                    <p className="text-xs text-zinc-400">
                      ≈ ${usdValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    {change24h !== null && (
                      <span
                        className={`text-xs font-medium ${
                          change24h >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {change24h >= 0 ? "+" : ""}
                        {change24h.toFixed(2)}%
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
