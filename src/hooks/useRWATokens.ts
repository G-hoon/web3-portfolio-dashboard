"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useAccount, useConfig } from "wagmi";
import { multicall } from "@wagmi/core";
import { formatUnits } from "viem";
import { mainnet } from "wagmi/chains";
import {
  rwaTokenList,
  erc20ABI,
  type RWATokenInfo,
} from "@/lib/rwa-tokens";

export interface RWATokenData extends RWATokenInfo {
  totalSupply: string;
  userBalance: string;
  hasBalance: boolean;
}

export function useRWATokens() {
  const { address } = useAccount();
  const config = useConfig();

  return useSuspenseQuery<RWATokenData[]>({
    queryKey: ["rwaTokens", address],
    queryFn: async () => {
      const contracts = rwaTokenList.flatMap((token) => [
        {
          address: token.address,
          abi: erc20ABI,
          functionName: "totalSupply" as const,
          chainId: mainnet.id,
        },
        {
          address: token.address,
          abi: erc20ABI,
          functionName: "balanceOf" as const,
          args: [address ?? "0x0000000000000000000000000000000000000000"] as const,
          chainId: mainnet.id,
        },
      ]);

      const results = await multicall(config, {
        contracts,
        chainId: mainnet.id,
      });

      return rwaTokenList.map((token, i) => {
        const totalSupplyResult = results[i * 2];
        const balanceResult = results[i * 2 + 1];

        const rawTotalSupply =
          totalSupplyResult.status === "success"
            ? (totalSupplyResult.result as bigint)
            : 0n;
        const rawBalance =
          balanceResult.status === "success"
            ? (balanceResult.result as bigint)
            : 0n;

        return {
          ...token,
          totalSupply: formatUnits(rawTotalSupply, token.decimals),
          userBalance: formatUnits(rawBalance, token.decimals),
          hasBalance: rawBalance > 0n,
        };
      });
    },
    staleTime: 60_000,
  });
}
