"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTokenBalances } from "./useTokenBalances";
import { getTokenPrices, type CoinPrice } from "@/lib/coingecko";

export function useTokenPrices() {
  const { data: tokens } = useTokenBalances();

  const contractAddresses = tokens?.map((t) => t.contractAddress) ?? [];

  return useSuspenseQuery<Record<string, CoinPrice>>({
    queryKey: ["tokenPrices", contractAddresses],
    queryFn: () => getTokenPrices(contractAddresses),
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
}
