import { CCIPSender } from "@/abi/artifacts/CCIPSender";
import { Election } from "@/abi/artifacts/Election";
import { CCIP_FUJI_ADDRESS, SEPOLIA_CHAIN_SELECTOR } from "@/app/constants";
import { ErrorMessage } from "@/app/helpers/ErrorMessage";
import { useElectionModal } from "@/app/hooks/ElectionModal";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useAccount, useWriteContract } from "wagmi";

const Vote = ({
  disabled,
  electionAddress,
  voteArray,
}: {
  disabled: boolean;
  electionAddress: any;
  voteArray: any;
}) => {
  const { setelectionModal } = useElectionModal();
  const { writeContractAsync } = useWriteContract();
  const { chain } = useAccount();
  const vote = async () => {
    console.log("Vote array", voteArray);
    try {
      if (chain?.id === 43113) {
        await writeContractAsync({
          address: CCIP_FUJI_ADDRESS,
          abi: CCIPSender,
          functionName: "sendMessage",
          args: [SEPOLIA_CHAIN_SELECTOR, electionAddress, voteArray],
        });
      } else {
        await writeContractAsync({
          address: electionAddress,
          abi: Election,
          functionName: "userVote",
          args: [voteArray],
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
    <button
      disabled={disabled}
      onClick={vote}
      className="inline-flex items-center px-4 py-2 text-sm font-medium disabled:bg-gray-400 text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
    >
      Vote
    </button>
  );
};

export default Vote;
