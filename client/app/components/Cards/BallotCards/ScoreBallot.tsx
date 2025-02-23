import React, { useState } from "react";
import CreditsVoting from "../VotingCards/CreditsVoting";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { SumOfArray } from "../../Functions/UnixTimeConvertor";
import BallotInfo from "../../Helper/BallotInfo";
import Vote from "../../Modal/Vote";
const ScoreBallot = ({
  candidateList,
  isVoted,
  isOwner,
  setelectionCredits,
  electionCredits,
  isScore,
}: {
  candidateList: any;
  isVoted: boolean;
  isOwner: boolean;
  isScore: boolean;
  setelectionCredits: any;
  electionCredits: number;
}) => {
  const { id: electionAddress } = useParams<{ id: `0x${string}` }>();
  const [creditScores, setCreditScores] = useState(
    new Array(candidateList.length).fill(0)
  );

  let creditsLeft = 100;

  const handleChange = (id: number, credits: number) => {
    if (credits < 0) {
      toast.error("Credits cannot be Negative!!");
      return;
    }
    const newCreditScores = [...creditScores];

    const sumWithoutCurrent = creditScores.reduce(
      (acc, val, idx) => (idx === id ? acc : acc + val),
      0
    );
    const newSum = sumWithoutCurrent + credits;

    if (newSum > 100) {
      toast.error("Credit Limit Exceeded !!");
      console.log("Error credits");
      return;
    }
    newCreditScores[id] = credits;
    const sum = SumOfArray(newCreditScores);
    creditsLeft = 100 - sum;

    setelectionCredits(creditsLeft);
    setCreditScores(newCreditScores);
  };
  const handleChangeScore = (id: number, credits: number) => {
    if (credits < 0) {
      toast.error("Credits cannot be Negative!!");
      return;
    }
    if (credits > 10) {
      toast.error("Max Credit is 10");
      return;
    }
    const newCreditScores = [...creditScores];
    newCreditScores[id] = credits;
    setCreditScores(newCreditScores);
  };
  return (
    <>
      <div className=" divide-gray-200 h-[90%] flex flex-col overflow-auto">
        {candidateList?.map((candidate: any, key: number) => (
          <div
            key={key}
            className=" border-b-[1px] relative rounded-t-xl py-2 border-gray-300 hover:bg-cyan-50"
          >
            <CreditsVoting
              isOwner={isOwner}
              candidate={candidate}
              id={key}
              score={creditScores[key]}
              handleChange={isScore ? handleChangeScore : handleChange}
            />
          </div>
        ))}
      </div>
      <div className="flex my-2 items-center gap-x-2 justify-center">
        <Vote
          disabled={isVoted || electionCredits !== 0}
          electionAddress={electionAddress}
          voteArray={creditScores.map(BigInt)}
        />
        <BallotInfo ballotID={2} />
      </div>
    </>
  );
};

export default ScoreBallot;
