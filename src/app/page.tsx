"use client";

import { Suspense } from "react";
import { useAccount } from "wagmi";
import Header from "@/components/Header";
import ErrorBoundary from "@/components/ErrorBoundary";
import BalanceCard from "@/components/BalanceCard";
import TokenList from "@/components/TokenList";
import TransactionHistory from "@/components/TransactionHistory";
import PortfolioChart from "@/components/PortfolioChart";
import PortfolioValueChart from "@/components/PortfolioValueChart";
import RWADashboard from "@/components/RWADashboard";
import RealtimeTicker from "@/components/RealtimeTicker";
import EventNotification from "@/components/EventNotification";
import EventLog from "@/components/EventLog";
import DeFiActivity from "@/components/DeFiActivity";
import {
  BalanceCardSkeleton,
  PortfolioChartSkeleton,
  PortfolioValueChartSkeleton,
  RWADashboardSkeleton,
  TokenListSkeleton,
  DeFiActivitySkeleton,
  TransactionHistorySkeleton,
} from "@/components/skeletons";

export default function Home() {
  const { isConnected, address } = useAccount();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {isConnected && address ? (
          <div className="space-y-6">
            {/* 실시간 시세 */}
            <section>
              <RealtimeTicker />
            </section>

            {/* 상단: ETH 잔액 + 자산 분포 차트 */}
            <section className="grid gap-6 lg:grid-cols-2">
              <ErrorBoundary>
                <Suspense fallback={<BalanceCardSkeleton />}>
                  <BalanceCard />
                </Suspense>
              </ErrorBoundary>
              <ErrorBoundary>
                <Suspense fallback={<PortfolioChartSkeleton />}>
                  <PortfolioChart />
                </Suspense>
              </ErrorBoundary>
            </section>

            {/* 자산 가치 추이 차트 */}
            <section>
              <ErrorBoundary>
                <Suspense fallback={<PortfolioValueChartSkeleton />}>
                  <PortfolioValueChart />
                </Suspense>
              </ErrorBoundary>
            </section>

            {/* RWA 토큰 대시보드 */}
            <section>
              <ErrorBoundary>
                <Suspense fallback={<RWADashboardSkeleton />}>
                  <RWADashboard />
                </Suspense>
              </ErrorBoundary>
            </section>

            {/* 중단: ERC-20 토큰 목록 */}
            <section>
              <ErrorBoundary>
                <Suspense fallback={<TokenListSkeleton />}>
                  <TokenList />
                </Suspense>
              </ErrorBoundary>
            </section>

            {/* DeFi 활동 (Uniswap V3) */}
            <section>
              <ErrorBoundary>
                <Suspense fallback={<DeFiActivitySkeleton />}>
                  <DeFiActivity />
                </Suspense>
              </ErrorBoundary>
            </section>

            {/* 하단: 트랜잭션 히스토리 */}
            <section>
              <ErrorBoundary>
                <Suspense fallback={<TransactionHistorySkeleton />}>
                  <TransactionHistory />
                </Suspense>
              </ErrorBoundary>
            </section>

            {/* 온체인 이벤트 */}
            <EventNotification />
            <section>
              <ErrorBoundary>
                <EventLog />
              </ErrorBoundary>
            </section>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-6 pt-24 sm:pt-32">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-600/10">
              <svg
                className="h-10 w-10 text-indigo-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
                />
              </svg>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">
                포트폴리오 대시보드
              </h2>
              <p className="mt-2 text-zinc-400">
                지갑을 연결하여 온체인 자산을 확인하세요.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
