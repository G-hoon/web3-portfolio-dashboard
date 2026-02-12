"use client";

import { useState, useEffect } from "react";
import { useRealtimePrice } from "@/hooks/useRealtimePrice";

export default function RealtimeTicker() {
  const realtimePrice = useRealtimePrice();
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (
      realtimePrice?.prevPrice != null &&
      realtimePrice.price !== realtimePrice.prevPrice
    ) {
      setFlash(
        realtimePrice.price > realtimePrice.prevPrice ? "up" : "down"
      );
      const timer = setTimeout(() => setFlash(null), 300);
      return () => clearTimeout(timer);
    }
  }, [realtimePrice?.price, realtimePrice?.prevPrice]);

  if (!realtimePrice) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-zinc-600" />
          <span className="text-sm text-zinc-500">
            ETH/USDT 실시간 연결 중...
          </span>
        </div>
      </div>
    );
  }

  const formatPrice = (value: number) =>
    value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const isPositive = realtimePrice.change24h >= 0;

  return (
    <div
      className={`rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-colors duration-300 ${
        flash === "up"
          ? "bg-green-900/20"
          : flash === "down"
            ? "bg-red-900/20"
            : ""
      }`}
    >
      {/* 헤더 */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-400">
          ETH/USDT 실시간
        </span>
        <div className="flex items-center gap-1.5">
          <span
            className={`h-2 w-2 rounded-full ${
              realtimePrice.isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-xs text-zinc-500">
            {realtimePrice.isConnected ? "Live" : "Disconnected"}
          </span>
        </div>
      </div>

      {/* 현재가 + 변동률 */}
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-bold">
          ${formatPrice(realtimePrice.price)}
        </span>
        <span
          className={`text-sm font-medium ${
            isPositive ? "text-green-400" : "text-red-400"
          }`}
        >
          {isPositive ? "+" : ""}
          {realtimePrice.change24h.toFixed(2)}% 24h
        </span>
      </div>

      {/* 고가 / 저가 */}
      <div className="mt-2 flex gap-4 text-xs text-zinc-500">
        <span>H ${formatPrice(realtimePrice.high24h)}</span>
        <span>L ${formatPrice(realtimePrice.low24h)}</span>
      </div>
    </div>
  );
}
