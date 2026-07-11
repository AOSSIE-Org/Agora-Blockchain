"use client";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient } from "@tanstack/react-query";
import { http } from "wagmi";
// 1. We added 'hardhat' to the imports here
import { sepolia, polygonAmoy, avalancheFuji, hardhat } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Agora-Blockchain",
  projectId: "8501447cf73c4e68061f7ed912d6a8ee",
  // 2. We added 'hardhat' to the available chains
  chains: [hardhat, sepolia, avalancheFuji],
  ssr: true,
  transports: {
    // 3. We explicitly routed hardhat directly to your running terminal
    [hardhat.id]: http('http://127.0.0.1:8545'),
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL),
    [polygonAmoy.id]: http(process.env.NEXT_PUBLIC_AMOY_RPC_URL),
    [avalancheFuji.id]: http(process.env.NEXT_PUBLIC_FUJI_RPC_URL),
  },
});

export const queryClient = new QueryClient();