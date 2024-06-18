import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const HomePage = () => {
  return (
    <div className="flex p-8 h-screen w-full items-start justify-between">
      Hello
      <ConnectButton />
    </div>
  );
};

export default HomePage;
