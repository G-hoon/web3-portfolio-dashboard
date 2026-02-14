"use client";

import { useCompletion } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatUnits } from "viem";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { useTokenPrices } from "@/hooks/useTokenPrices";
import { useTransactions } from "@/hooks/useTransactions";
import { useRealtimePrice } from "@/hooks/useRealtimePrice";

export default function AIAnalysis() {
  const { balance } = useWalletBalance();
  const { data: tokens } = useTokenBalances();
  const { data: prices } = useTokenPrices();
  const { data: transactions } = useTransactions();
  const realtimePrice = useRealtimePrice();

  const ethAmount = balance
    ? parseFloat(formatUnits(balance.value, balance.decimals))
    : 0;
  const ethPriceUsd = realtimePrice?.price ?? prices?.["eth"]?.usd ?? 0;
  const ethUsdValue = ethAmount * ethPriceUsd;

  const tokenList = (tokens ?? []).map((t) => {
    const price = prices?.[t.contractAddress.toLowerCase()];
    const bal = parseFloat(t.balance);
    const usdVal = price ? bal * price.usd : null;
    return {
      name: t.name,
      symbol: t.symbol,
      balance: t.balance,
      usdValue: usdVal ? `$${usdVal.toFixed(2)}` : null,
      change24h: price?.usd_24h_change ?? null,
    };
  });

  const totalUsdValue =
    ethUsdValue +
    tokenList.reduce((sum, t) => {
      const val = t.usdValue ? parseFloat(t.usdValue.replace("$", "")) : 0;
      return sum + val;
    }, 0);

  const recentTxs = (transactions ?? []).slice(0, 5).map((tx) => ({
    direction: tx.direction,
    asset: tx.asset ?? "ETH",
    value: tx.value?.toString() ?? "0",
  }));

  const { completion, complete, isLoading, error } = useCompletion({
    api: "/api/analyze",
    streamProtocol: "text",
  });

  const handleAnalyze = () => {
    complete("", {
      body: {
        ethBalance: `${ethAmount.toFixed(4)} ETH`,
        ethUsdValue: `$${ethUsdValue.toFixed(2)}`,
        tokens: tokenList,
        recentTransactions: recentTxs,
        totalUsdValue: `$${totalUsdValue.toFixed(2)}`,
      },
    });
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">AI 포트폴리오 분석</h3>
        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "분석 중..." : "분석하기"}
        </button>
      </div>

      {/* 결과 영역 */}
      {error && (
        <div className="rounded-lg border border-red-800 bg-red-900/20 p-4">
          <p className="text-sm text-red-400">
            분석 중 오류가 발생했습니다. 다시 시도해주세요.
          </p>
        </div>
      )}

      {!completion && !isLoading && !error && (
        <p className="text-sm text-zinc-500">
          &quot;분석하기&quot; 버튼을 눌러 AI 포트폴리오 분석을 시작하세요.
        </p>
      )}

      {(completion || isLoading) && (
        <div className="ai-markdown text-sm leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {completion}
          </ReactMarkdown>
          {isLoading && (
            <span className="inline-block h-4 w-1 animate-pulse bg-indigo-400" />
          )}
        </div>
      )}
    </div>
  );
}
