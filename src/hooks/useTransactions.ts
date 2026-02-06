"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { alchemy } from "@/lib/alchemy";
import { AssetTransfersCategory, SortingOrder } from "alchemy-sdk";

export interface Transaction {
  hash: string;
  from: string;
  to: string | null;
  value: number | null;
  asset: string | null;
  category: string;
  direction: "sent" | "received";
  blockNum: string;
}

export function useTransactions() {
  const { address } = useAccount();

  return useSuspenseQuery<Transaction[]>({
    queryKey: ["transactions", address],
    queryFn: async () => {
      if (!address) return [];

      const [sent, received] = await Promise.all([
        alchemy.core.getAssetTransfers({
          fromAddress: address,
          category: [
            AssetTransfersCategory.EXTERNAL,
            AssetTransfersCategory.ERC20,
          ],
          maxCount: 10,
          order: SortingOrder.DESCENDING,
        }),
        alchemy.core.getAssetTransfers({
          toAddress: address,
          category: [
            AssetTransfersCategory.EXTERNAL,
            AssetTransfersCategory.ERC20,
          ],
          maxCount: 10,
          order: SortingOrder.DESCENDING,
        }),
      ]);

      const sentTxs: Transaction[] = sent.transfers.map((tx) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        asset: tx.asset,
        category: tx.category,
        direction: "sent" as const,
        blockNum: tx.blockNum,
      }));

      const receivedTxs: Transaction[] = received.transfers.map((tx) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        asset: tx.asset,
        category: tx.category,
        direction: "received" as const,
        blockNum: tx.blockNum,
      }));

      return [...sentTxs, ...receivedTxs]
        .sort((a, b) => parseInt(b.blockNum, 16) - parseInt(a.blockNum, 16))
        .slice(0, 15);
    },
    staleTime: 30_000,
  });
}
