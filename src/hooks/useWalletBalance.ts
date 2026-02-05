"use client";

import { useBalance, useConnection } from "wagmi";

export function useWalletBalance() {
  const { address } = useConnection();

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
