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
    <div className="w-screen">
      {isLoading || !elections ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-center justify-center">
          <div className="flex lg:flex-row flex-col w-[80%] overflow-auto lg:space-x-4">
            <div className=" flex-col w-[90%] lg:w-[24%] mt-3 h-full inline-block items-center justify-center ">
              <ElectionInfoCard
                counts={counts}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
              />
            </div>
            <div
              className="w-[90%] lg:w-[75%] flex-col space-y-6 my-3 inline-block overflow-auto items-center justify-center"
              style={{ height: "75vh" }}
            >
              {filteredElections!
                .slice()
                .reverse()
                .map((election, key) => {
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
