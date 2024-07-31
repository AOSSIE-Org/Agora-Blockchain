"use client";
import React from "react";
import { useReadContract } from "wagmi";
import { Election } from "../../../abi/artifacts/Election";
import LoaderInline from "../Helper/LoaderInline";
import CandidateCard from "./VotingCards/CandidateCard";
import Ballot from "../Modal/Ballot";
import { useElectionModal } from "../../hooks/ElectionModal";
import { sepolia } from "viem/chains";
import { useParams } from "next/navigation";
const ElectionCandidates = ({
  isOwner,
  resultType,
}: {
  isOwner: boolean;
  resultType: bigint | undefined;
}) => {
  const { id: electionAddress } = useParams<{ id: `0x${string}` }>();

  const { data: candidateList, isLoading } = useReadContract({
    chainId: sepolia.id,
    abi: Election,
    address: electionAddress,
    functionName: "getCandidateList",
  });
  const { electionModal, setelectionModal } = useElectionModal();
  if (isLoading) return <LoaderInline />;
  return (
    <div className=" w-[50%] flex flex-col p-4 mt-4  border border-gray-200 rounded-lg shadow sm:p-8 ">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-xl font-bold leading-none text-gray-900 ">
          Candidate List
        </h5>
        <div className="text-sm font-medium "># ID</div>
      </div>
      <div className="flow-root">
        <ul role="list" className="divide-y divide-gray-200 ">
          {candidateList?.map((candidate, key) => {
            if (key > 3) return null;
            return (
              <CandidateCard
                isOwner={isOwner}
                key={key}
                candidate={candidate}
                isMini={true}
              />
            );
          })}
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
        </ul>
      </div>
      {electionModal && (
        <Ballot
          isOwner={isOwner}
          candidateList={candidateList}
          resultType={Number(resultType)}
        />
      )}
    </div>
  );
};

export default ElectionCandidates;
