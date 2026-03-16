'use client';

import { CCIPSender } from "@/abi/artifacts/CCIPSender";
import { Election } from "@/abi/artifacts/Election";
import { CCIP_FUJI_ADDRESS, SEPOLIA_CHAIN_SELECTOR } from "@/app/constants";
import { ErrorMessage } from "@/app/helpers/ErrorMessage";
import { useElectionModal } from "@/app/hooks/ElectionModal";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import { useAccount, useWriteContract } from "wagmi";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  DialogDescription,
} from '@headlessui/react';

// Inline loading component
const InlineLoading = ({ message = '' }: { message?: string }) => (
  <div className="flex items-center justify-center">
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    {message && <span>{message}</span>}
  </div>
);

// Inline confirmation dialog component
interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

const InlineConfirmationDialog: FC<ConfirmationDialogProps> = ({
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

interface VoteProps {
  disabled: boolean;
  electionAddress: `0x${string}`;
  voteArray: bigint[];
}

const Vote: FC<VoteProps> = ({
  disabled,
  electionAddress,
  voteArray,
}) => {
  const { setelectionModal } = useElectionModal();
  const { writeContractAsync } = useWriteContract();
  const { chain } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleVote = async () => {
    setIsLoading(true);
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
      toast.success(`Vote Cast Successfully`);
      setelectionModal(false);
    } catch (error) {
      console.error("Error casting vote:", error);
      toast.error(ErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        disabled={disabled || isLoading}
        onClick={() => setShowConfirmation(true)}
        className="inline-flex items-center px-4 py-2 text-sm font-medium disabled:bg-gray-400 text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
      >
        {isLoading ? <InlineLoading message="Casting Vote..." /> : "Vote"}
      </button>

      <InlineConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleVote}
        title="Confirm Vote"
        description="Are you sure you want to cast your vote? This action cannot be undone."
        confirmText="Cast Vote"
        cancelText="Cancel"
      />
    </>
  );
};

export default Vote;
