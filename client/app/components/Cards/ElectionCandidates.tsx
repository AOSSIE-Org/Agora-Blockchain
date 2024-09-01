"use client";
import React from "react";
import LoaderInline from "../Helper/LoaderInline";
import CandidateCard from "./VotingCards/CandidateCard";
import Ballot from "../Modal/Ballot";
import { useElectionModal } from "../../hooks/ElectionModal";

import { MdOutlineNotInterested } from "react-icons/md";
import { useElectionData } from "@/app/hooks/ElectionInfo";
import ViewCandidates from "../Modal/ViewCandidates";
const ElectionCandidates = ({
  isOwner,
  resultType,
  electionStat,
}: {
  isOwner: boolean;
  electionStat: number;
  resultType: bigint | undefined;
}) => {
  const { electionData } = useElectionData();
  const candidateList = electionData[7].result;
  const { electionModal, setelectionModal } = useElectionModal();
  if (!electionData) return <LoaderInline />;
  return (
    <div className=" w-[50%] flex flex-col p-4 mt-4  border border-gray-200 rounded-lg shadow sm:p-8 ">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-xl font-bold leading-none text-gray-900 ">
          Candidate List
        </h5>
        <div className="text-sm font-medium "># ID</div>
      </div>
      <div className="flow-root">
        {candidateList?.length === 0 ? (
          <div className="font-medium text-gray-900 items-center justify-center mt-4 space-y-4">
            <MdOutlineNotInterested size={40} />
            <p>No Candidates Added</p>
          </div>
        ) : (
          <ul role="list" className="divide-y divide-gray-200 ">
            {candidateList?.map((candidate: any, key: number) => {
              if (key > 2) return null;
              return (
                <CandidateCard
                  isOwner={isOwner}
                  key={key}
                  candidate={candidate}
                  isMini={true}
                />
              );
            })}
            {candidateList!.length > 2 && (
              <li className=" -mb-3 pt-2">
                <div className="flex items-center justify-center ">
                  <button
                    onClick={() => {
                      setelectionModal(true);
                    }}
                    className="text-sm font-medium text-blue-600 disabled:text-gray-700 disabled:cursor-not-allowed disabled:hover:no-underline hover:underline "
                  >
                    View All
                  </button>
                </div>
              </li>
            )}
          </ul>
        )}
      </div>
      {electionModal &&
        (electionStat === 2 ? (
          <Ballot
            isOwner={isOwner}
            candidateList={candidateList}
            resultType={Number(resultType)}
          />
        ) : (
          <ViewCandidates isOwner={isOwner} candidateList={candidateList} />
        ))}
    </div>
  );
};

export default ElectionCandidates;
