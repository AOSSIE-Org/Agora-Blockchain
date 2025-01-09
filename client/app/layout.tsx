import { ThemeProvider } from "./components/Helper/ThemeProvider"; // Import ThemeProvider
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClientProvider } from "@tanstack/react-query";
import { config, queryClient } from "./helpers/client";
import Header from "./components/Header/Header";
import ChatBot from "./components/ChatBot/ChatBot";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agora Blockchain",
  description: "A Web3 Voting Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/aossie.png" sizes="any" />
      <body className={`${inter.className}`}>
        <ThemeProvider>
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider initialChain={sepolia}>
                <Header />
                <ChatBot />
                {children}
              </RainbowKitProvider>
            </QueryClientProvider>
          </WagmiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
