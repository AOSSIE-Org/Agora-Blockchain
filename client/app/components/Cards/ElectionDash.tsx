"use client";
import React from "react";
import Loader from "../Helper/Loader";
import ElectionMini from "../Cards/ElectionMini";
import { useReadContract } from "wagmi";
import { ELECTION_FACTORY_ADDRESS } from "../../constants";
import { ElectionFactory } from "../../../abi/artifacts/ElectionFactory";
import SearchBar from "../Helper/SearchBar";
import { useElectionStats } from "@/app/hooks/ElectionsStats";
import ElectionInfoCard from "./ElectionInfoCard";
import { IoReturnDownBack } from "react-icons/io5";
import { sepolia } from "viem/chains";
const ElectionDash = () => {
  const { electionStats, setelectionStats } = useElectionStats();
  const { data: elections, isLoading } = useReadContract({
    chainId: sepolia.id,
    abi: ElectionFactory,
    address: ELECTION_FACTORY_ADDRESS,
    functionName: "getOpenElections",
  });

  let electionsByStatus = [0, 0, 0, 0];
  const update = (value: number) => {
    electionsByStatus[value]++;
    electionsByStatus[0]++;
    if (electionsByStatus[0] === elections?.length) {
      if (electionStats == null) {
        setelectionStats(electionsByStatus);
      }
    }
  };

  return (
    <div className="w-screen">
      {isLoading || !elections ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-center justify-center">
          {/* <SearchBar elections={elections} /> */}
          <div className="flex lg:flex-row flex-col w-[80%] overflow-auto lg:space-x-4">
            <div className=" flex-col w-[90%] lg:w-[24%] mt-3 h-full inline-block items-center justify-center ">
              <ElectionInfoCard />
            </div>
            <div
              className="w-[90%] lg:w-[75%] flex-col space-y-6 my-3 inline-block overflow-auto items-center justify-center"
              style={{ height: "75vh" }}
            >
              {elections!.map((election, key) => {
                return (
                  <ElectionMini
                    electionAddress={election}
                    key={key}
                    update={update}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectionDash;
