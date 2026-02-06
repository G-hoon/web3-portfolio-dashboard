"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useAccount, useConfig } from "wagmi";
import { getBalanceQueryOptions } from "@wagmi/core/query";

export function useWalletBalance() {
  const { address } = useAccount();
  const config = useConfig();

  const { data, refetch } = useSuspenseQuery(
    getBalanceQueryOptions(config, { address })
  );

  return {
    balance: data,
    refetch,
  };
}
