"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-6 py-4">
      <h1 className="text-xl font-bold text-white">Web3 Portfolio Dashboard</h1>
      <ConnectButton />
    </header>
  );
}
