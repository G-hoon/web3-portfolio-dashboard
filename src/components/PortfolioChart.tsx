"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { formatUnits } from "viem";

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#a78bfa",
  "#c4b5fd",
  "#818cf8",
  "#7c3aed",
  "#4f46e5",
  "#5b21b6",
];

interface ChartData {
  name: string;
  value: number;
}

export default function PortfolioChart() {
  const { balance: ethBalance } = useWalletBalance();
  const { data: tokens } = useTokenBalances();

  const chartData: ChartData[] = [];

  if (ethBalance && ethBalance.value > 0n) {
    chartData.push({
      name: "ETH",
      value: parseFloat(formatUnits(ethBalance.value, ethBalance.decimals)),
    });
  }

  if (tokens) {
    tokens.forEach((token) => {
      const val = parseFloat(token.balance);
      if (val > 0) {
        chartData.push({
          name: token.symbol,
          value: val,
        });
      }
    });
  }

  if (chartData.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h3 className="mb-4 text-lg font-semibold">자산 분포</h3>
        <p className="text-sm text-zinc-500">표시할 자산이 없습니다.</p>
      </div>
    );
  }

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h3 className="mb-4 text-lg font-semibold">자산 분포</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            dataKey="value"
            nameKey="name"
            paddingAngle={2}
            label={({ name, value }) =>
              `${name} (${((value / total) * 100).toFixed(1)}%)`
            }
          >
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#18181b",
              border: "1px solid #3f3f46",
              borderRadius: "8px",
              color: "#fff",
            }}
            formatter={(value, name) => [
              `${Number(value).toFixed(4)}`,
              String(name),
            ]}
          />
          <Legend
            wrapperStyle={{ color: "#a1a1aa", fontSize: "14px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
