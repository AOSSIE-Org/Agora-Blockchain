import React from "react";
import { useAccount } from "wagmi";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";
const HomePage = () => {
  const { isConnected } = useAccount();
  return (
    <main className="h-screen pt-20 w-full bg-[#f7f7f7] ">
      {isConnected ? <Dashboard /> : <LoginPage />}
    </main>
  );
};

export default HomePage;
