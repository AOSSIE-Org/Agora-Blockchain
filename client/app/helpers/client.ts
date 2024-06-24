"use client"
import {
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import {  QueryClient } from "@tanstack/react-query";
import { sepolia, polygonMumbai } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Agora-Blockchain",
  projectId: "8501447cf73c4e68061f7ed912d6a8ee",
  chains: [sepolia, polygonMumbai],
  ssr: true
});

export const queryClient = new QueryClient();