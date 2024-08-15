"use client";
import React from "react";
import ElectionDash from "../Cards/ElectionDash";
const Dashboard = () => {
  return (
    <div className="flex p-8 h-full  w-full items-start justify-center">
      <div className="">
        <div className="flex mx-6  items-center justify-center lg:mx-0">
          <div className="mt-2 text-lg leading-8 text-gray-600 ">
            Vote Securely, Transparently, and Decentrally with Web3 Technology
          </div>
        </div>
        <hr className="my-3 h-[2px] border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
        <ElectionDash />
      </div>
    </div>
  );
};

export default Dashboard;
