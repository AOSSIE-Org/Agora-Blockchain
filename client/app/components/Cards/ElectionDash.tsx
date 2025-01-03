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
              {filteredElections && filteredElections.length > 0 ? (
                filteredElections
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
                  })
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4 p-6 bg-gray-50 rounded-lg shadow-lg max-w-md mx-auto">
                  <div className="text-gray-700">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-gray-400 mx-auto"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.75 9.75L12 12m0 0l2.25 2.25m-2.25-2.25L9.75 14.25m2.25-2.25l2.25-2.25M12 9v6m4.5-3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">No Elections Found</h2>
                  <p className="text-center text-gray-500">
                    It seems there are no elections available at the moment. Please check back
                    later.
                  </p>
                  <button
                    className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                    onClick={() => window.location.reload()}
                  >
                    Refresh
                  </button>
</div>


              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElectionDash;
