import React from "react";
import ElectionDash from "../Cards/ElectionDash";
const Dashboard = () => {
  return (
    <div className="flex p-8 h-full  w-full items-start justify-center">
      <div className="mx-4 px-6 lg:px-8">
        <div className="flex mx-6  w-2xl items-center justify-center lg:mx-0">
          <div className="mt-2 text-lg leading-8 text-gray-600">
            Vote Securely, Transparently, and Decentrally with Web3 Technology
          </div>
        </div>
        <ElectionDash />
      </div>
    </div>
  );
};

export default Dashboard;
