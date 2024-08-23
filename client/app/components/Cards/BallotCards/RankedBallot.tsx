import React, { useState } from "react";
import { Reorder } from "framer-motion";
import { useAccount, useWriteContract } from "wagmi";
import {
  CCIP_FUJI_ADDRESS,
  ELECTION_FACTORY_ADDRESS,
  SEPOLIA_CHAIN_SELECTOR,
} from "@/app/constants";
import { CCIPSender } from "@/abi/artifacts/CCIPSender";
import { useParams } from "next/navigation";
import { Election } from "@/abi/artifacts/Election";
import toast from "react-hot-toast";
import { ErrorMessage } from "@/app/helpers/ErrorMessage";
import CandidateCard from "../VotingCards/CandidateCard";
import { useElectionModal } from "@/app/hooks/ElectionModal";
import BallotInfo from "../../Helper/BallotInfo";
const RankedBallot = ({
  candidateList,
  isVoted,
  isOwner,
}: {
  candidateList: any;
  isVoted: boolean;
  isOwner: boolean;
}) => {
  const { setelectionModal } = useElectionModal();
  const { id: electionAddress } = useParams<{ id: `0x${string}` }>();
  const { writeContractAsync } = useWriteContract();
  const { chain } = useAccount();
  const [preference, setpreference] = useState(candidateList);
  const vote = async () => {
    const preferenceIDs = preference.map(
      (candidate: any) => candidate.candidateID
    );
    try {
      if (chain?.id === 43113) {
        await writeContractAsync({
          address: CCIP_FUJI_ADDRESS,
          abi: CCIPSender,
          functionName: "sendMessage",
          args: [SEPOLIA_CHAIN_SELECTOR, electionAddress, preferenceIDs],
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
        <button
          disabled={isVoted}
          onClick={vote}
          className="inline-flex items-center px-4 py-2 text-sm font-medium disabled:bg-gray-400 text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
        >
          Vote
        </button>
        <BallotInfo ballotID={1} />
      </div>
    </>
  );
};

export default RankedBallot;
