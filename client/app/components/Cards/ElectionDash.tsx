"use client";
import React, { useState, useEffect } from "react";
import Loader from "../Helper/Loader";
import ElectionMini from "../Cards/ElectionMini";
import ElectionInfoCard from "./ElectionInfoCard";
import { useOpenElection } from "../Hooks/GetOpenElections";
import ErrorPage from "../Error-pages/ErrorPage";

const ElectionDash = () => {
  const { elections, isLoading } = useOpenElection();
  const [electionStatuses, setElectionStatuses] = useState<{
    [key: string]: number;
  }>({});
  const [filterStatus, setFilterStatus] = useState<number>(0); // 0: All, 1: Pending, 2: Active, 3: Ended
  const [loading, setLoading] = useState<boolean>(true);

  // Set the timer for 4 seconds to switch from loader to error or elections
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000); // 4 seconds

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, []);

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
    <div>
      {loading ? (
        <div className="w-screen flex mt-6 h-screen object-center justify-center text-center">
        <Loader />

        </div>
      ) : elections ? (
        <div className="flex flex-col items-center justify-center">
          <div className="flex lg:flex-row flex-col w-[80%] overflow-auto lg:space-x-4">
            <div className="flex-col w-[90%] lg:w-[24%] mt-3 h-full inline-block items-center justify-center">
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
      ) : (
        <ErrorPage
  errorCode={403} // Forbidden error, often due to access restrictions
  errorMessage="Oops! Something went wrong."
  details="We couldn't load the page you're trying to access. This may be due to a temporary issue with our servers. Please try again later."
  redirectPath="#"
  redirectLabel="Go to Homepage"
  onRetry={() => window.location.reload()}
  current_route="/"
/>
      )}
    </div>
  );
};

export default ElectionDash;
