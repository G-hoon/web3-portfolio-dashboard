"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import {
  getUserSwaps,
  getUserPositions,
  getUniswapStats,
  type UniswapSwap,
  type UniswapPosition,
  type UniswapStats,
} from "@/lib/graphql";

interface UniswapActivity {
  swaps: UniswapSwap[];
  positions: UniswapPosition[];
  stats: UniswapStats;
}

export function useUniswapActivity() {
  const { address } = useAccount();

  return useSuspenseQuery<UniswapActivity>({
    queryKey: ["uniswapActivity", address],
    queryFn: async () => {
      const [swaps, positions, stats] = await Promise.all([
        address ? getUserSwaps(address) : Promise.resolve([]),
        address ? getUserPositions(address) : Promise.resolve([]),
        getUniswapStats(),
      ]);
      return { swaps, positions, stats };
    },
    staleTime: 60_000,
  });
}
