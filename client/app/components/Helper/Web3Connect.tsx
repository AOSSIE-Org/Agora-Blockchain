import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import ActionToolTip from "../ActionToolTip/ActionToolTip";
const Web3Connect = () => {
  return (
    <ActionToolTip label="Switch networks & Credentials" responsive={false}>
      <div className="p-4">
        <ConnectButton
          accountStatus={{
            smallScreen: "avatar",
            largeScreen: "full",
          }}
          showBalance={false}
        />
      </div>
    </ActionToolTip>
  );
};

export default Web3Connect;
