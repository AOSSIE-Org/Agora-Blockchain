import React, { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { useElectionModal } from "../../hooks/ElectionModal";
import toast from "react-hot-toast";
import AddCandidate from "../Modal/AddCandidate";
import { Election } from "../../../abi/artifacts/Election";
import { ErrorMessage } from "../../helpers/ErrorMessage";
const ButtonCard = ({
  owner,
  winner,
  electionAddress,
}: {
  owner: `0x${string}`;
  winner: number;
  electionAddress: `0x${string}`;
}) => {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { setelectionModal } = useElectionModal();
  const [openModal, setopenModal] = useState<boolean>(false);
  const getResult = async () => {
    try {
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
    <div className="flex flex-col items-center justify-around gap-y-8 w-[50%] mt-4  border border-gray-200 rounded-lg shadow sm:p-8 ">
      <h5 className="text-xl font-bold leading-none text-gray-900 ">
        Quick Actions
      </h5>
      <div className=" grid grid-cols-1 gap-y-8 gap-x-8 md:grid-cols-2 ">
        <button
          onClick={() => {
            setelectionModal(true);
          }}
          className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
        >
          Cast Vote
        </button>
        <button
          onClick={getResult}
          disabled={winner !== 0}
          className="disabled:bg-gray-100 disabled:cursor-not-allowed  py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
        >
          Get Result
        </button>

        {owner === address && (
          <button
            onClick={() => {
              setopenModal(true);
            }}
            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
          >
            Add Candidate
          </button>
        )}
        {owner === address && (
          <button
            onClick={() => {
              toast("Click on Candidate Setting to Edit", {
                icon: "ℹ️",
              });
              setelectionModal(true);
            }}
            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
          >
            Delete Candidate
          </button>
        )}
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
