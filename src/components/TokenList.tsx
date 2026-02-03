"use client";

import { useTokenBalances } from "@/hooks/useTokenBalances";

export default function TokenList() {
  const { data: tokens, isLoading, isError } = useTokenBalances();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h3 className="mb-4 text-lg font-semibold">ERC-20 토큰</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-lg bg-zinc-800"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <p className="text-sm text-red-400">토큰 조회 실패</p>
      </div>
    );
  }

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
        {tokens.map((token) => (
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
            <p className="font-mono text-sm">{token.balance}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
