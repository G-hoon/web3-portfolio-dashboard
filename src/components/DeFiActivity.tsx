"use client";

import dayjs from "dayjs";
import { useUniswapActivity } from "@/hooks/useUniswapActivity";

function formatLargeNumber(value: string): string {
  const num = parseFloat(value);
  if (num >= 1_000_000_000_000) return `$${(num / 1_000_000_000_000).toFixed(2)}T`;
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`;
  return `$${num.toFixed(2)}`;
}

function formatFeeTier(feeTier: string): string {
  return `${(parseInt(feeTier) / 10_000).toFixed(2)}%`;
}

export default function DeFiActivity() {
  const { data } = useUniswapActivity();
  const { swaps, positions, stats } = data;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h3 className="mb-4 text-lg font-semibold">
        DeFi 활동 (Uniswap V3)
      </h3>

      {/* 글로벌 통계 */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="TVL" value={formatLargeNumber(stats.totalValueLockedUSD)} />
        <StatCard label="총 풀" value={parseInt(stats.poolCount).toLocaleString()} />
        <StatCard label="누적 거래량" value={formatLargeNumber(stats.totalVolumeUSD)} />
        <StatCard label="총 트랜잭션" value={parseInt(stats.txCount).toLocaleString()} />
      </div>

      {/* 유동성 포지션 */}
      <div className="mb-6">
        <h4 className="mb-3 text-sm font-medium text-zinc-400">
          내 유동성 포지션
        </h4>
        {positions.length === 0 ? (
          <p className="text-sm text-zinc-500">
            활성 유동성 포지션이 없습니다.
          </p>
        ) : (
          <div className="space-y-2">
            {positions.map((pos) => (
              <div
                key={pos.id}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-800/50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">
                    {pos.pool.token0.symbol}/{pos.pool.token1.symbol}
                  </span>
                  <span className="rounded bg-indigo-900/40 px-2 py-0.5 text-xs text-indigo-400">
                    {formatFeeTier(pos.pool.feeTier)}
                  </span>
                </div>
                <span className="text-sm text-zinc-400">
                  {parseFloat(pos.depositedToken0).toFixed(4)} {pos.pool.token0.symbol}
                  {" + "}
                  {parseFloat(pos.depositedToken1).toFixed(4)} {pos.pool.token1.symbol}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 스왑 히스토리 */}
      <div>
        <h4 className="mb-3 text-sm font-medium text-zinc-400">
          최근 스왑 히스토리
        </h4>
        {swaps.length === 0 ? (
          <p className="text-sm text-zinc-500">스왑 내역이 없습니다.</p>
        ) : (
          <div className="space-y-2">
            {swaps.map((swap) => {
              const isToken0Positive = parseFloat(swap.amount0) > 0;
              const tokenIn = isToken0Positive
                ? swap.pool.token1.symbol
                : swap.pool.token0.symbol;
              const tokenOut = isToken0Positive
                ? swap.pool.token0.symbol
                : swap.pool.token1.symbol;

              return (
                <div
                  key={swap.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-800/50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">
                      {tokenIn} → {tokenOut}
                    </span>
                    <span className="text-sm text-zinc-400">
                      ${parseFloat(swap.amountUSD).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500">
                      {dayjs.unix(parseInt(swap.timestamp)).format("YYYY-MM-DD HH:mm")}
                    </span>
                    <a
                      href={`https://etherscan.io/tx/${swap.transaction.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-400 hover:text-indigo-300"
                    >
                      Tx ↗
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-800/50 p-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
