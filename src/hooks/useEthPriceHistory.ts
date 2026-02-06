"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { getEthPriceHistory } from "@/lib/coingecko";

export function useEthPriceHistory(days: number = 7) {
  return useSuspenseQuery({
    queryKey: ["ethPriceHistory", days],
    queryFn: () => getEthPriceHistory(days),
    staleTime: 5 * 60_000,
  });
}
