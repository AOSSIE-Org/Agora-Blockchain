import React, { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import CandidateCard from "../Cards/VotingCards/CandidateCard";
import { useElectionModal } from "@/app/hooks/ElectionModal";

const ViewCandidates = ({ isOwner, candidateList }: any) => {
  const [inside, setinside] = useState(false);
  const { electionModal, setelectionModal } = useElectionModal();
  const checkCloseModal = () => {
    if (!inside) setelectionModal(false);
  };
  return (
    <Dialog
      className="relative z-50"
      open={electionModal}
      onClose={setelectionModal}
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black backdrop-blur-sm bg-opacity-10 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div
        onMouseEnter={() => {
          setinside(true);
        }}
        onMouseLeave={() => {
          setinside(false);
        }}
        className="fixed inset-0 flex w-screen items-center justify-center p-4"
      >
        <DialogPanel
          transition
          className=" rounded-2xl md:w-[80%] md:h-[82%] border-gray-200 shadow sm:p-8 w-[87%] h-[88%] p-12 space-y-4 bg-white duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <div onClick={checkCloseModal} className="">
            <div className="divide-gray-200 h-[90%] space-y-3 ">
              {candidateList?.map((candidate: any, key: number) => {
                return (
                  <div
                    key={key}
                    className=" select-none border-b-[1px] rounded-xl py-2 border-gray-300 hover:bg-cyan-50"
                  >
                    <CandidateCard
                      isMini={false}
                      isOwner={isOwner}
                      candidate={candidate}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ViewCandidates;
