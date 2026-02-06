export function BalanceCardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <p className="text-sm text-zinc-500">ETH 잔액</p>
      <div className="mt-2 h-8 w-32 animate-pulse rounded bg-zinc-800" />
    </div>
  );
}

export function PortfolioChartSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h3 className="mb-4 text-lg font-semibold">자산 분포</h3>
      <div className="flex h-64 items-center justify-center">
        <div className="h-48 w-48 animate-pulse rounded-full bg-zinc-800" />
      </div>
    </div>
  );
}

export function PortfolioValueChartSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h3 className="mb-4 text-lg font-semibold">총 자산 가치 추이</h3>
      <div className="h-64 animate-pulse rounded bg-zinc-800" />
    </div>
  );
}

export function TokenListSkeleton() {
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

export function RWADashboardSkeleton() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h3 className="mb-4 text-lg font-semibold">RWA 토큰 (Real World Assets)</h3>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-lg bg-zinc-800"
          />
        ))}
      </div>
    </div>
  );
}

export function TransactionHistorySkeleton() {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h3 className="mb-4 text-lg font-semibold">트랜잭션 히스토리</h3>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-14 animate-pulse rounded-lg bg-zinc-800"
          />
        ))}
      </div>
    </div>
  );
}
