"use client";
import React, { useState } from "react";
import Loader from "../Helper/Loader";
import ElectionMini from "../Cards/ElectionMini";
import ElectionInfoCard from "./ElectionInfoCard";
import { useOpenElection } from "../Hooks/GetOpenElections";

const ElectionDash = () => {
  const { elections, isLoading } = useOpenElection();
  const [electionStatuses, setElectionStatuses] = useState<{
    [key: string]: number;
  }>({});
  const [filterStatus, setFilterStatus] = useState<number>(0); //0: All, 1: Pending, 2: Active, 3: Ended

  const update = (electionAddress: `0x${string}`, status: number) => {
    if (electionStatuses[electionAddress] !== status) {
      setElectionStatuses((prevStatuses) => {
        return {
          ...prevStatuses,
          [electionAddress]: status,
        };
      });
    }
  };

  const counts = { total: 0, pending: 0, active: 0, ended: 0 };

  if (elections) {
    counts.total = elections.length;
    for (let address of elections) {
      const status = electionStatuses[address];
      if (status === 1) counts.pending++;
      else if (status === 2) counts.active++;
      else if (status === 3) counts.ended++;
    }
  }

  const filteredElections =
    filterStatus !== 0
      ? elections?.filter(
          (election) => electionStatuses[election] === filterStatus
        )
      : elections;

      return (
        <div className="w-full max-w-[1800px] mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Election Dashboard</h1>
            <p className="text-gray-600 mt-2">View and manage all elections</p>
          </div>
    
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 w-full">
              {[...Array(3)].map((_,i) => <SkeletonElection key={i}/>)}
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6 w-full">
              {/* Filter Panel */}
              <div className="w-full lg:w-[25%]">
                <ElectionInfoCard {...{counts, filterStatus, setFilterStatus}} />
              </div>
              
              {/* Election List */}
              <div className="w-full lg:w-[72%]">
                {filteredElections?.length ? (
                  <div className="grid grid-cols-1 gap-6 max-h-[75vh] overflow-y-auto">
                    {filteredElections.slice().reverse().map((election) => (
                      <ElectionMini key={election} electionAddress={election} update={update} />
                    ))}
                  </div>
                ) : (
                  <div className="w-full p-8 bg-white rounded-xl border border-gray-200 text-center">
                    {/* Empty state content */}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    };

export default ElectionDash;
