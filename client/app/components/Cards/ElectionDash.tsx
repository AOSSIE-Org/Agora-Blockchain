"use client";
import React from "react";
import Loader from "../Helper/Loader";
import ElectionMini from "../Cards/ElectionMini";
import { useReadContract } from "wagmi";
import { ELECTION_FACTORY_ADDRESS } from "../../constants";
import { ElectionFactory } from "../../../abi/artifacts/ElectionFactory";

const ElectionDash = () => {
  const { data: elections, isLoading } = useReadContract({
    abi: ElectionFactory,
    address: ELECTION_FACTORY_ADDRESS,
    functionName: "getOpenElections",
  });
  return (
    <div className="mx-6 mt-4  max-w-2xl  pt-2 sm:mt-4 border-t border-gray-300  sm:pt-4 lg:mx-0 lg:max-w-none ">
      {isLoading || !elections ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 mt-3 gap-x-8 gap-y-8 lg:grid-cols-3">
          {elections!.map((election, key) => (
            <ElectionMini electionAddress={election} key={key} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ElectionDash;
