import React, { useState } from "react";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
import { useElectionModal } from "../../hooks/ElectionModal";
import toast from "react-hot-toast";
import AddCandidate from "../Modal/AddCandidate";
import { Election } from "../../../abi/artifacts/Election";
import { ErrorMessage } from "../../helpers/ErrorMessage";
import { sepolia } from "wagmi/chains";
import { useParams } from "next/navigation";
import { useElectionData } from "@/app/hooks/ElectionInfo";
const ButtonCard = ({ isOwner }: { isOwner: boolean }) => {
  const { electionData } = useElectionData();
  const electionInfo = electionData[2].result;
  const userVoted = electionData[5].result;
  const resultDeclared = electionData[6].result;
  const { id: electionAddress } = useParams<{ id: `0x${string}` }>();
  const { chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const { setelectionModal } = useElectionModal();
  const [openModal, setopenModal] = useState<boolean>(false);
  const pendingElection =
    Math.floor(Date.now() / 1000) < Number(electionInfo[0]);
  const electionEnded = Math.floor(Date.now() / 1000) > Number(electionInfo[1]);
  const getResult = async () => {
    try {
      if (chain?.id === 43113) switchChain({ chainId: sepolia.id });
      await writeContractAsync({
        address: electionAddress,
        abi: Election,
        functionName: "getResult",
      });
      toast.success("Result will update a few seconds !");
    } catch (error) {
      toast.error(ErrorMessage(error));
    }
  };
  return (
    <div className="flex flex-col items-center justify-around gap-y-8 w-[75%] sm:w-[50%] mt-4  border border-gray-200 rounded-lg shadow sm:p-8 ">
      <h5 className="text-xl font-bold my-2 leading-none text-gray-900 ">
        Quick Actions
      </h5>
      <div className="my-2 grid grid-cols-1 gay-y-4 sm:gap-y-8 gap-x-8 md:grid-cols-2 ">
        <button
          onClick={() => {
            setelectionModal(true);
          }}
          disabled={userVoted || pendingElection || electionEnded}
          className="disabled:bg-gray-100 disabled:cursor-not-allowed py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
        >
          Cast Vote
        </button>
        <button
          onClick={getResult}
          disabled={resultDeclared || !electionEnded}
          className="disabled:bg-gray-100 disabled:cursor-not-allowed py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
        >
          Get Result
        </button>

        <button
          disabled={!isOwner || !pendingElection}
          onClick={() => {
            setopenModal(true);
          }}
          className="disabled:bg-gray-100 disabled:cursor-not-allowed py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
        >
          Add Candidate
        </button>
        <button
          disabled={!isOwner || !pendingElection}
          onClick={() => {
            toast("Click on Candidate Setting to Edit", {
              icon: "ℹ️",
            });
            setelectionModal(true);
          }}
          className="disabled:bg-gray-100 disabled:cursor-not-allowed py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
        >
          Delete Candidate
        </button>
      </div>
      {openModal === true && (
        <AddCandidate
          electionAddress={electionAddress}
          openModal={openModal}
          setopenModal={setopenModal}
        />
      )}
    </div>
  );
};

export default ButtonCard;
