import { render } from "@testing-library/react";
import { WagmiConfig, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mainnet, sepolia } from "wagmi/chains";

const queryClient = new QueryClient();

const config = createConfig({
  // autoConnect: true,
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

export function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiConfig>
  );
}

// Use this in tests
export function customRender(ui: React.ReactElement) {
  return render(ui, { wrapper: TestWrapper });
}
