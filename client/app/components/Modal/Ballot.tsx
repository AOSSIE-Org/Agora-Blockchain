"use client";
import React, { useState } from "react";
import { Dialog, DialogBackdrop } from "@headlessui/react";
import CandidateGrid from "../Cards/VotingCards/CandidateGrid";
import CandidateCard from "../Cards/VotingCards/CandidateCard";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { useElectionModal } from "../../hooks/ElectionModal";
import { Election } from "../../../abi/artifacts/Election";
import Loader from "../Helper/Loader";
import { Reorder } from "framer-motion";
import toast from "react-hot-toast";
import { ErrorMessage } from "@/app/helpers/ErrorMessage";
const Ballot = ({
  candidateList,
  electionAddress,
  resultType,
}: {
  candidateList: any;
  electionAddress: `0x${string}`;
  resultType: number;
}) => {
  const { electionModal, setelectionModal } = useElectionModal();
  const [inside, setinside] = useState(false);
  const { writeContractAsync } = useWriteContract();
  const checkCloseModal = () => {
    if (!inside) setelectionModal(false);
  };
  const { address } = useAccount();
  const { data: isVoted, isLoading } = useReadContract({
    abi: Election,
    address: electionAddress,
    functionName: "userVoted",
    args: [address!],
  });
  const [preference, setpreference] = useState(candidateList);
  const vote = async () => {
    const preferenceIDs = preference.map(
      (candidate: any) => candidate.candidateID
    );
    try {
      await writeContractAsync({
        address: electionAddress,
        abi: Election,
        functionName: "userVote",
        args: [preferenceIDs],
      });
      toast.success(`Voted Casted `);
      setelectionModal(false);
    } catch (error) {
      toast.error(ErrorMessage(error));
    }
  };
  if (isLoading) return <Loader />;
  return (
    <Dialog
      className="relative z-30"
      open={electionModal}
      onClose={setelectionModal}
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-10 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div
        onClick={checkCloseModal}
        className="overflow-y-auto overflow-x-hidden flex fixed z-40 justify-center items-center w-full inset-0 h-screen"
      >
        <div
          onMouseEnter={() => {
            setinside(true);
          }}
          onMouseLeave={() => {
            setinside(false);
          }}
          className="md:w-[80%] md:h-[82%] w-[87%] h-[88%]  p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 "
        >
          <div className="flex items-center h-[10%] justify-between mb-4">
            <h5 className="text-xl font-bold leading-none text-gray-900 ">
              Candidate List
            </h5>
            <div className="text-sm font-medium "># ID</div>
          </div>
          <div className="flow-root h-[90%] overflow-auto">
            {resultType <= 1 && (
              <div className=" divide-gray-200 grid grid-cols-1 mt-3 gap-x-8 gap-y-8 md:grid-cols-2 lg:grid-cols-3 ">
                {candidateList?.map((candidate: any, key: number) => {
                  return (
                    <div className="hover:bg-blue-50 select-none">
                      <CandidateGrid
                        isVoted={isVoted!}
                        electionAddress={electionAddress}
                        key={key}
                        candidate={candidate}
                      />
                    </div>
                  );
                })}
              </div>
            )}
            {resultType === 2 && (
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
                      className=" border border-gray-200 rounded-xl hover:bg-blue-50"
                    >
                      <CandidateCard isMini={false} candidate={candidate} />
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
                <div className="flex my-2 items-center justify-center">
                  <button
                    disabled={isVoted}
                    onClick={vote}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium disabled:bg-gray-400 text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
                  >
                    Vote
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};
export default Ballot;
