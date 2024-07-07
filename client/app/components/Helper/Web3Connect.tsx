import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
const Web3Connect = () => {
  return (
    <div className="fixed z-50 right-3 top-3 p-4">
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

export default Web3Connect;
