import React from "react";
import CandidateGrid from "../VotingCards/CandidateGrid";

const GeneralBallot = ({
  candidateList,
  isVoted,
  isOwner,
}: {
  candidateList: any;
  isVoted: boolean;
  isOwner: boolean;
}) => {
  return (
    <div className=" divide-gray-200 grid grid-cols-1 mt-3 gap-x-8 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
      {candidateList?.map((candidate: any, key: number) => {
        return (
          <div key={key} className="hover:bg-blue-50 select-none">
            <CandidateGrid
              isVoted={isVoted!}
              isOwner={isOwner}
              candidate={candidate}
            />
          </div>
        );
      })}
    </div>
  );
};

export default GeneralBallot;
