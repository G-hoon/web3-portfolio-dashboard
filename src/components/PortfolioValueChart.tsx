"use client";

import { useState, Suspense } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import dayjs from "dayjs";
import { useEthPriceHistory } from "@/hooks/useEthPriceHistory";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { formatUnits } from "viem";
type Period = 7 | 30;

function PortfolioValueChartInner({ period }: { period: Period }) {
  const { data: priceHistory } = useEthPriceHistory(period);
  const { balance } = useWalletBalance();

  const ethAmount = balance
    ? parseFloat(formatUnits(balance.value, balance.decimals))
    : 0;

  const chartData = priceHistory?.map((point) => ({
    date: dayjs(point.timestamp).format("M월 D일"),
    value: parseFloat((ethAmount * point.price).toFixed(2)),
    price: point.price,
  }));

  if (!chartData || chartData.length === 0) {
    return (
      <p className="text-sm text-zinc-500">가격 데이터를 불러올 수 없습니다.</p>
    );
  }

  const sampledData =
    chartData.length > 50
      ? chartData.filter(
          (_, i) =>
            i === 0 ||
            i === chartData.length - 1 ||
            i % Math.ceil(chartData.length / 50) === 0
        )
      : chartData;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={sampledData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis
          dataKey="date"
          tick={{ fill: "#a1a1aa", fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#3f3f46" }}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: "#a1a1aa", fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#3f3f46" }}
          tickFormatter={(v) => `$${v.toLocaleString()}`}
          width={80}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#18181b",
            border: "1px solid #3f3f46",
            borderRadius: "8px",
            color: "#fff",
          }}
          formatter={(value) => [
            `$${Number(value).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            "자산 가치",
          ]}
          labelFormatter={(label) => `${label}`}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#6366f1"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: "#6366f1" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function PortfolioValueChart() {
  const [period, setPeriod] = useState<Period>(7);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">총 자산 가치 추이</h3>
        <div className="flex gap-1 rounded-lg bg-zinc-800 p-1">
          {([7, 30] as Period[]).map((d) => (
            <button
              key={d}
              onClick={() => setPeriod(d)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                period === d
                  ? "bg-indigo-600 text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {d}일
            </button>
          ))}
        </div>
      </div>
      <Suspense fallback={<div className="h-64 animate-pulse rounded bg-zinc-800" />}>
        <PortfolioValueChartInner period={period} />
      </Suspense>
    </div>
  );
}
