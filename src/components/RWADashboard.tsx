"use client";

import { useRWATokens, type RWATokenData } from "@/hooks/useRWATokens";

const categoryLabels: Record<string, string> = {
  treasury: "Treasury",
  "real-estate": "Real Estate",
  credit: "Credit",
  commodity: "Commodity",
};

function formatLargeNumber(value: string): string {
  const num = parseFloat(value);
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
}

function RWATokenRow({ token }: { token: RWATokenData }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600/20 text-xs font-bold text-indigo-400">
          {token.symbol.slice(0, 2)}
        </div>
        <div>
          <p className="font-medium">{token.symbol}</p>
          <p className="text-xs text-zinc-500">{token.issuer}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-mono text-sm">
          {parseFloat(token.userBalance).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
          })}
        </p>
        <p className="text-xs text-zinc-500">{token.underlyingAsset}</p>
      </div>
    </div>
  );
}

function RWATokenCard({ token }: { token: RWATokenData }) {
  return (
    <a
      href={token.website}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-4 py-3 transition-colors hover:bg-zinc-800"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600/20 text-xs font-bold text-indigo-400">
          {token.symbol.slice(0, 2)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{token.name}</p>
            <span className="rounded bg-zinc-700 px-1.5 py-0.5 text-[10px] font-medium text-zinc-300">
              {categoryLabels[token.category] ?? token.category}
            </span>
          </div>
          <p className="text-xs text-zinc-500">
            {token.issuer} &middot; {token.underlyingAsset}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium">
          {formatLargeNumber(token.totalSupply)}
        </p>
        <div className="flex items-center justify-end gap-1.5">
          {token.yield && (
            <span className="text-xs font-medium text-green-400">
              {token.yield}
            </span>
          )}
          <span className="text-xs text-zinc-500">총 발행</span>
        </div>
      </div>
    </a>
  );
}

export default function RWADashboard() {
  const { data: tokens } = useRWATokens();

  const holdings = tokens.filter((t) => t.hasBalance);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h3 className="mb-4 text-lg font-semibold">
        RWA 토큰 (Real World Assets)
      </h3>

      {/* 내 RWA 보유 현황 */}
      {holdings.length > 0 && (
        <div className="mb-6">
          <p className="mb-2 text-sm font-medium text-zinc-400">
            내 RWA 보유 현황
          </p>
          <div className="space-y-2">
            {holdings.map((token) => (
              <RWATokenRow key={token.address} token={token} />
            ))}
          </div>
        </div>
      )}

      {holdings.length === 0 && (
        <div className="mb-6 rounded-lg bg-zinc-800/30 px-4 py-3">
          <p className="text-sm text-zinc-500">
            보유 중인 RWA 토큰이 없습니다.
          </p>
        </div>
      )}

      {/* RWA 시장 개요 */}
      <p className="mb-2 text-sm font-medium text-zinc-400">RWA 시장 개요</p>
      <div className="space-y-2">
        {tokens.map((token) => (
          <RWATokenCard key={token.address} token={token} />
        ))}
      </div>
    </div>
  );
}
