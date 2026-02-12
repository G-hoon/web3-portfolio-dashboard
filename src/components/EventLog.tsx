"use client";

import dayjs from "dayjs";
import { useTransferEvents } from "@/hooks/useTransferEvents";

export default function EventLog() {
  const { events, isWatching } = useTransferEvents();

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">온체인 이벤트 로그</h3>
        <div className="flex items-center gap-1.5">
          <span
            className={`h-2 w-2 rounded-full ${
              isWatching ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-xs text-zinc-500">
            {isWatching ? "이벤트 구독 중" : "미연결"}
          </span>
        </div>
      </div>

      {/* 이벤트 목록 */}
      {events.length === 0 ? (
        <p className="text-sm text-zinc-500">
          새로운 Transfer 이벤트를 대기 중입니다...
        </p>
      ) : (
        <div className="space-y-2">
          {events.map((event, i) => {
            const shortContract = `${event.contractAddress.slice(0, 6)}...${event.contractAddress.slice(-4)}`;
            const isReceived = event.type === "received";

            return (
              <div
                key={`${event.transactionHash}-${i}`}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-800/50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  {/* 방향 뱃지 */}
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${
                      isReceived
                        ? "bg-green-900/40 text-green-400"
                        : "bg-red-900/40 text-red-400"
                    }`}
                  >
                    {isReceived ? "수신" : "발신"}
                  </span>

                  {/* 컨트랙트 주소 */}
                  <span className="font-mono text-sm text-zinc-300">
                    {shortContract}
                  </span>

                  {/* 이벤트 타입 */}
                  <span className="text-xs text-zinc-500">Transfer</span>
                </div>

                <div className="flex items-center gap-3">
                  {/* 타임스탬프 */}
                  <span className="text-xs text-zinc-500">
                    {dayjs(event.timestamp).format("HH:mm:ss")}
                  </span>

                  {/* Etherscan 링크 */}
                  <a
                    href={`https://etherscan.io/tx/${event.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    Tx ↗
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
