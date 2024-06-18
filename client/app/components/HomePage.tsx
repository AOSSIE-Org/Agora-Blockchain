import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const HomePage = () => {
  const { address, isConnected } = useAccount();
  return (
    <div className="flex p-8 h-screen w-full items-start justify-between">
      Hello
      {isConnected && <p>{address}</p>}
      <ConnectButton
        accountStatus={{
          smallScreen: "avatar",
          largeScreen: "full",
        }}
        showBalance={false}
      />
    </div>
  );
};

export default HomePage;
