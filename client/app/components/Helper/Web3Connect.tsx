import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import "@rainbow-me/rainbowkit/styles.css";

const Web3Connect = () => {
  const { isConnected, address } = useAccount();

  return (
    <div className="p-4">
      {/* If connected, show the wallet address, else show the Connect button */}
      {isConnected ? (
        <div>
          <span>Connected to: {address}</span>
        </div>
      ) : (
        <ConnectButton
          accountStatus={{
            smallScreen: "avatar",
            largeScreen: "full",
          }}
          showBalance={false}
        />
      )}
    </div>
  );
};

export default Web3Connect;