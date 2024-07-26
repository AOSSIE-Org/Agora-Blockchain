import React, { useState } from "react";
import CreditsVoting from "../VotingCards/CreditsVoting";
import { useParams } from "next/navigation";
import { useAccount, useWriteContract } from "wagmi";
import {
  CCIP_FUJI_ADDRESS,
  ELECTION_FACTORY_ADDRESS,
  SEPOLIA_CHAIN_SELECTOR,
} from "@/app/constants";
import { CCIPSender } from "@/abi/artifacts/CCIPSender";
import { Election } from "@/abi/artifacts/Election";
import toast from "react-hot-toast";
import { ErrorMessage } from "@/app/helpers/ErrorMessage";
import { useElectionModal } from "@/app/hooks/ElectionModal";
import { SumOfArray } from "../../Functions/UnixTimeConvertor";
import BallotInfo from "../../Helper/BallotInfo";
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
  const { setelectionModal } = useElectionModal();
  const { id: electionAddress } = useParams<{ id: `0x${string}` }>();
  const { writeContractAsync } = useWriteContract();
  const [creditScores, setCreditScores] = useState(
    new Array(candidateList.length).fill(0)
  );

  const { chain } = useAccount();
  let creditsLeft = 100;
  const vote = async () => {
    const preferenceIDs = creditScores.map(BigInt);
    try {
      if (chain?.id === 43113) {
        await writeContractAsync({
          address: CCIP_FUJI_ADDRESS,
          abi: CCIPSender,
          functionName: "sendMessage",
          args: [
            SEPOLIA_CHAIN_SELECTOR,
            ELECTION_FACTORY_ADDRESS,
            electionAddress,
            preferenceIDs,
          ],
        });
      } else {
        await writeContractAsync({
          address: electionAddress,
          abi: Election,
          functionName: "userVote",
          args: [preferenceIDs],
        });
      }
      toast.success(`Voted Casted `);
      setelectionModal(false);
    } catch (error) {
      console.log("Error", error);
      toast.error(ErrorMessage(error));
    }
  };
  const handleChange = (id: number, credits: number) => {
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
          <div className=" border-b-[1px] relative rounded-t-xl py-2 border-gray-300 hover:bg-cyan-50">
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
        <button
          disabled={isVoted || electionCredits !== 0}
          onClick={vote}
          className="inline-flex items-center px-4 py-2 text-sm font-medium disabled:bg-gray-400 text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
        >
          Vote
        </button>
        <BallotInfo ballotID={2} />
      </div>
    </>
  );
};

export default ScoreBallot;
