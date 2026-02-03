"use client";

import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { alchemy } from "@/lib/alchemy";

export interface TokenBalance {
  contractAddress: string;
  name: string;
  symbol: string;
  logo: string | null;
  balance: string;
  decimals: number;
}

export function useTokenBalances() {
  const { address } = useAccount();

  return useQuery<TokenBalance[]>({
    queryKey: ["tokenBalances", address],
    queryFn: async () => {
      if (!address) return [];

      const balances = await alchemy.core.getTokenBalances(address);

      const nonZeroBalances = balances.tokenBalances.filter(
        (token) =>
          token.tokenBalance &&
          BigInt(token.tokenBalance) > 0n
      );

      const tokenDetails = await Promise.all(
        nonZeroBalances.map(async (token) => {
          const metadata = await alchemy.core.getTokenMetadata(
            token.contractAddress
          );

          const rawBalance = BigInt(token.tokenBalance || "0");
          const decimals = metadata.decimals || 18;
          const divisor = BigInt(10 ** decimals);
          const integerPart = rawBalance / divisor;
          const fractionalPart = rawBalance % divisor;
          const fractionalStr = fractionalPart
            .toString()
            .padStart(decimals, "0")
            .slice(0, 4);
          const formattedBalance = `${integerPart}.${fractionalStr}`;

          return {
            contractAddress: token.contractAddress,
            name: metadata.name || "Unknown",
            symbol: metadata.symbol || "???",
            logo: metadata.logo || null,
            balance: formattedBalance,
            decimals,
          };
        })
      );

      return tokenDetails.filter(
        (token) => parseFloat(token.balance) > 0
      );
    },
    enabled: !!address,
    staleTime: 30_000,
  });
}
