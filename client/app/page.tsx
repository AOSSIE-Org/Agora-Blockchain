"use client";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import HomePage from "./components/HomePage";
import AossieImg from "../public/aossie.png";
const config = getDefaultConfig({
  appName: "Agora-Blockchain",
  projectId: "8501447cf73c4e68061f7ed912d6a8ee",
  chains: [sepolia],
});
const queryClient = new QueryClient();

export default function Home() {
  return (
    <div
      className="flex min-h-screen bg-black text-white flex-col items-center justify-between"
      style={{
        backgroundImage: `url(${AossieImg.src})`,
        backgroundSize: "20%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <main className="flex h-full w-screen flex-col items-center justify-between ">
              <HomePage />
            </main>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
}
