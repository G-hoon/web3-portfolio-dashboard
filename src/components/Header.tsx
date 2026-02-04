"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function Header() {
  const { chain } = useAccount();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-white sm:text-xl">
            Web3 Portfolio
          </h1>
          {chain && (
            <span className="hidden rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400 sm:inline-block">
              {chain.name}
            </span>
          )}
        </div>
        <ConnectButton
          showBalance={false}
          chainStatus="icon"
          accountStatus={{
            smallScreen: "avatar",
            largeScreen: "full",
          }}
        />
      </div>
    </header>
  );
}
