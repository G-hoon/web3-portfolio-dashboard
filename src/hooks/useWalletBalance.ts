"use client";

import { useBalance, useAccount } from "wagmi";

export function useWalletBalance() {
  const { address } = useAccount();

  const { data, isLoading, isError, refetch } = useBalance({
    address,
  });

  return {
    balance: data,
    isLoading,
    isError,
    refetch,
  };
}
