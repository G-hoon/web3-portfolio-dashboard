"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePublicClient, useAccount } from "wagmi";
import { parseAbiItem } from "viem";

const MAX_EVENTS = 20;

const transferEvent = parseAbiItem(
  "event Transfer(address indexed from, address indexed to, uint256 value)"
);

export interface TransferEvent {
  type: "sent" | "received";
  from: string;
  to: string;
  value: bigint;
  contractAddress: string;
  transactionHash: string;
  blockNumber: bigint;
  timestamp: number;
}

export function useTransferEvents() {
  const publicClient = usePublicClient();
  const { address } = useAccount();
  const [events, setEvents] = useState<TransferEvent[]>([]);
  const [isWatching, setIsWatching] = useState(false);
  const mountedRef = useRef(true);

  const addEvent = useCallback((event: TransferEvent) => {
    if (!mountedRef.current) return;
    setEvents((prev) => [event, ...prev].slice(0, MAX_EVENTS));
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    if (!publicClient || !address) {
      setIsWatching(false);
      return;
    }

    // 수신 이벤트 (to === userAddress)
    const unwatchIncoming = publicClient.watchEvent({
      event: transferEvent,
      args: { to: address },
      onLogs: (logs) => {
        logs.forEach((log) => {
          addEvent({
            type: "received",
            from: log.args.from!,
            to: log.args.to!,
            value: log.args.value!,
            contractAddress: log.address,
            transactionHash: log.transactionHash!,
            blockNumber: log.blockNumber!,
            timestamp: Date.now(),
          });
        });
      },
    });

    // 발신 이벤트 (from === userAddress)
    const unwatchOutgoing = publicClient.watchEvent({
      event: transferEvent,
      args: { from: address },
      onLogs: (logs) => {
        logs.forEach((log) => {
          addEvent({
            type: "sent",
            from: log.args.from!,
            to: log.args.to!,
            value: log.args.value!,
            contractAddress: log.address,
            transactionHash: log.transactionHash!,
            blockNumber: log.blockNumber!,
            timestamp: Date.now(),
          });
        });
      },
    });

    setIsWatching(true);

    return () => {
      mountedRef.current = false;
      unwatchIncoming();
      unwatchOutgoing();
      setIsWatching(false);
    };
  }, [publicClient, address, addEvent]);

  return { events, isWatching, clearEvents };
}
