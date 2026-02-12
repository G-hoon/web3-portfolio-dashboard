"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useTransferEvents } from "@/hooks/useTransferEvents";

export default function EventNotification() {
  const { events } = useTransferEvents();
  const prevLengthRef = useRef(events.length);

  useEffect(() => {
    if (events.length > prevLengthRef.current) {
      const newEvent = events[0];
      const direction = newEvent.type === "received" ? "수신" : "발신";
      const shortAddr = `${newEvent.contractAddress.slice(0, 6)}...${newEvent.contractAddress.slice(-4)}`;

      toast(`토큰 ${direction} 감지`, {
        description: `${shortAddr}에서 Transfer 이벤트`,
        action: {
          label: "Etherscan",
          onClick: () =>
            window.open(
              `https://etherscan.io/tx/${newEvent.transactionHash}`,
              "_blank"
            ),
        },
      });
    }
    prevLengthRef.current = events.length;
  }, [events]);

  return null;
}
