"use client";

import { useAccount } from "wagmi";
import Header from "@/components/Header";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-8">
        {isConnected ? (
          <div className="text-center text-zinc-400">
            <p className="text-lg">지갑이 연결되었습니다. 대시보드를 불러오는 중...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 pt-32">
            <h2 className="text-3xl font-bold">포트폴리오 대시보드</h2>
            <p className="text-zinc-400">
              지갑을 연결하여 온체인 자산을 확인하세요.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
