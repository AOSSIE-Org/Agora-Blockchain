"use client";
import React, { Fragment, useEffect, useState } from "react";
import {
  Menu,
  Transition,
  MenuButton,
  MenuItems,
  MenuItem,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  DialogDescription,
} from "@headlessui/react";
import { AVATARS } from "../../../constants";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
import { Election } from "@/abi/artifacts/Election";
import { PencilIcon, TrashIcon } from "@heroicons/react/16/solid";
import toast from "react-hot-toast";
import { ErrorMessage } from "@/app/helpers/ErrorMessage";
import { useParams } from "next/navigation";
import { sepolia } from "viem/chains";
import { safeIPFSRemove } from "@/app/helpers/ipfsUtils";
import CandidateDescription from "../../Fragment/CandidateDescription";

// Type for the confirmation dialog props
interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

// Inline confirmation dialog component
const InlineConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black/30 duration-300 ease-out data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          transition
          className="max-w-lg rounded-2xl bg-white p-6 shadow-xl duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {title}
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm text-gray-500">
            {description}
          </DialogDescription>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              {confirmText}
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

const CandidateCard = ({
  candidate,
  isMini,
  isOwner,
}: {
  candidate: any;
  isMini: boolean;
  isOwner: boolean;
}) => {
  const { id: electionAddress } = useParams<{ id: `0x${string}` }>();
  const { switchChain } = useSwitchChain();
  const { chain } = useAccount();
  const [inside, setinside] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { writeContractAsync } = useWriteContract();
  const candidateId = Number(candidate.candidateID);
  
  const handleRemoveCandidate = async () => {
    try {
      setIsRemoving(true);
      
      // Switch chains if needed
      if (chain?.id === 43113) {
        await switchChain({ chainId: sepolia.id });
      }
      
      // Remove candidate from the blockchain
      await writeContractAsync({
        address: electionAddress as `0x${string}`,
        abi: Election,
        functionName: "removeCandidate",
        args: [candidate.candidateID],
      });
      
      // Safely remove IPFS data
      const ipfsRemoved = await safeIPFSRemove(candidate.description);
      
      if (!ipfsRemoved) {
        // Only show warning - candidate is already removed from blockchain
        console.warn("Failed to remove candidate data from IPFS storage");
      }
      
      toast.success(`Removed candidate ${candidate.name}`);
    } catch (error) {
      console.error("Error removing candidate:", error);
      toast.error(ErrorMessage(error));
    } finally {
      setIsRemoving(false);
      setShowConfirmDialog(false);
    }
  };

  return (
    <div className="p-2 select-none">
      <div
        onMouseEnter={() => {
          setinside(true);
        }}
        onMouseLeave={() => {
          setinside(false);
        }}
        className="flex relative items-center "
      >
        <div className="flex-shrink-0">
          <img
            className="w-9 h-9 rounded-full"
            src={AVATARS[candidateId % 4]}
            alt="pfp"
          />
        </div>
        <div className="flex-1 min-w-0 ms-4">
          <p className="text-sm font-medium text-gray-900 truncate ">
            {candidate.name}
          </p>
          <p
            className={`text-sm text-gray-500 truncate w-[80%] ${
              isMini ? "max-w-96" : ""
            }`}
          >
            <CandidateDescription IpfsHash={candidate.description} />
          </p>
        </div>
        <div className="inline-flex items-center text-base font-semibold text-blue-900 ">
          {candidateId}
        </div>
        {isOwner && (
          <Menu
            as="div"
            className={`inline-block text-left ${!inside && "hidden"}`}
          >
            <MenuButton className="flex items-center justify-center">
              <button className=" absolute rounded-xl right-0 text-gray-500  bg-gray-100  focus:ring-4 focus:outline-none focus:ring-gray-200 text-sm p-1.5">
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 16 3"
                >
                  <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                </svg>
              </button>
            </MenuButton>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute right-0 z-10 mt-2 max-w-60  w-[50%] border-white border-[1px] border-opacity-20 origin-top-right shadow-lg ring-1 bg-white ring-gray-600 ring-opacity-5 rounded-xl focus:outline-none ">
                <div className="flex flex-col items-center justify-center">
                  <MenuItem>
                    <button className="flex items-center gap-x-3 justify-center  w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ">
                      <PencilIcon className="w-6" />
                      Edit
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={() => setShowConfirmDialog(true)}
                      disabled={isRemoving}
                      className="flex items-center justify-center gap-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 disabled:opacity-50"
                    >
                      {isRemoving ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Removing...
                        </div>
                      ) : (
                        <>
                          <TrashIcon className="w-6" />
                          Delete
                        </>
                      )}
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </Transition>
          </Menu>
        )}
      </div>
      
      <InlineConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleRemoveCandidate}
        title="Remove Candidate"
        description={`Are you sure you want to remove ${candidate.name} from this election? This action cannot be undone.`}
        confirmText="Remove"
        cancelText="Cancel"
      />
    </div>
  );
};

export default CandidateCard;
