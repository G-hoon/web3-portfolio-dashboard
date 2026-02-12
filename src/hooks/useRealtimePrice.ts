"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const WS_URL = "wss://stream.binance.com:9443/ws/ethusdt@ticker";
const MAX_RETRIES = 5;
const RETRY_DELAY = 3000;

export interface RealtimePrice {
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  quoteVolume24h: number;
  isConnected: boolean;
  prevPrice: number | null;
}

export function useRealtimePrice(): RealtimePrice | null {
  const [data, setData] = useState<RealtimePrice | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const retryCountRef = useRef(0);
  const prevPriceRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    if (!mountedRef.current) return;

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      retryCountRef.current = 0;
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const currentPrice = parseFloat(msg.c);
      const prev = prevPriceRef.current;
      prevPriceRef.current = currentPrice;

      setData({
        price: currentPrice,
        change24h: parseFloat(msg.P),
        high24h: parseFloat(msg.h),
        low24h: parseFloat(msg.l),
        volume24h: parseFloat(msg.v),
        quoteVolume24h: parseFloat(msg.q),
        isConnected: true,
        prevPrice: prev,
      });
    };

    ws.onclose = () => {
      if (mountedRef.current && retryCountRef.current < MAX_RETRIES) {
        retryCountRef.current++;
        retryTimerRef.current = setTimeout(connect, RETRY_DELAY);
      } else if (mountedRef.current) {
        setData((prev) => (prev ? { ...prev, isConnected: false } : null));
      }
    };

    ws.onerror = () => {
      ws.close();
    };

    wsRef.current = ws;
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      mountedRef.current = false;
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
      }
      wsRef.current?.close();
    };
  }, [connect]);

  return data;
}
