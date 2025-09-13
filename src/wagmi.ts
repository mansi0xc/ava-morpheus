"use client";

import { http, createConfig, createStorage } from "wagmi";
import {
  sepolia,
  mainnet,
  baseSepolia,
  avalancheFuji,
} from "wagmi/chains";
import { connectors } from "./wallet";
import type { Chain } from "viem";

// Define readonly tuple
const chainsConst = [
  sepolia,
  mainnet,
  baseSepolia,
  avalancheFuji,
] as const satisfies readonly [Chain, ...Chain[]];

// Spread into mutable array when passing to createConfig
const chains: [Chain, ...Chain[]] = [...chainsConst];

const isClient = typeof window !== "undefined";

export const config = createConfig({
  chains,
  connectors: connectors,
  storage: createStorage({
    storage: isClient ? window.localStorage : undefined,
  }),
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
    [baseSepolia.id]: http(),
    [avalancheFuji.id]: http(),
  },
  ssr: false,
});
