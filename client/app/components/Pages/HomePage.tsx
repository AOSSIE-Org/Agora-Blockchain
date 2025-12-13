import React from "react";
import { useAccount } from "wagmi";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";
const HomePage = () => {
  const { isConnected } = useAccount();
  return (
    <main className="w-full bg-white">
      {isConnected ? <Dashboard /> : <LoginPage />}
    </main>
  );
};

export default HomePage;
