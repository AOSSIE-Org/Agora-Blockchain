import React, { useState } from "react";
import { Reorder } from "framer-motion";
import { useParams } from "next/navigation";
import CandidateCard from "../VotingCards/CandidateCard";
import BallotInfo from "../../Helper/BallotInfo";
import Vote from "../../Modal/Vote";
const RankedBallot = ({
  candidateList,
  isVoted,
  isOwner,
}: {
  candidateList: any;
  isVoted: boolean;
  isOwner: boolean;
}) => {
  const { id: electionAddress } = useParams<{ id: `0x${string}` }>();
  const [preference, setpreference] = useState(candidateList);

  return (
    <>
      <Reorder.Group
        layoutScroll
        style={{ overflowY: "scroll" }}
        values={preference}
        onReorder={setpreference}
        className=" divide-gray-200 h-[90%] space-y-3 "
      >
        {preference?.map((candidate: any) => (
          <Reorder.Item
            key={candidate.candidateID}
            value={candidate}
            className=" border-b-[1px] rounded-t-xl py-2 border-gray-300 hover:bg-cyan-50"
          >
            <CandidateCard
              isOwner={isOwner}
              isMini={false}
              candidate={candidate}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>
      <div className="flex my-2 items-center justify-center gap-x-2">
        <Vote
          electionAddress={electionAddress}
          voteArray={preference.map((candidate: any) => candidate.candidateID)}
          disabled={isVoted}
        />
        <BallotInfo ballotID={1} />
      </div>
    </>
  );
};

export default RankedBallot;
