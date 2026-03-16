"use client";
import React, { FormEvent, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import toast from "react-hot-toast";

import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
import { Election } from "../../../abi/artifacts/Election";
import { ErrorMessage } from "../../helpers/ErrorMessage";
import { sepolia } from "viem/chains";
import { useElectionData } from "@/app/hooks/ElectionInfo";
import { safeIPFSStore } from "@/app/helpers/ipfsUtils";

const AddCandidate = ({
  openModal,
  setopenModal,
  electionAddress,
}: {
  openModal: boolean;
  setopenModal: any;
  electionAddress: `0x${string}`;
}) => {
  const { switchChain } = useSwitchChain();
  const { chain } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const { electionData } = useElectionData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const electionID = electionData[8].result;

  const validateInputs = (name: string, description: string): boolean => {
    if (!name.trim()) {
      toast.error("Candidate name cannot be empty");
      return false;
    }
    
    if (!description.trim()) {
      toast.error("Candidate description cannot be empty");
      return false;
    }
    
    if (name.length > 100) {
      toast.error("Candidate name must be under 100 characters");
      return false;
    }
    
    return true;
  };

  const addCandidate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(event.currentTarget);
      const name = formData.get("name") as string;
      const description = formData.get("description") as string;
      
      // Validate inputs before proceeding
      if (!validateInputs(name, description)) {
        setIsSubmitting(false);
        return;
      }
      
      const candidateData = {
        name,
        description,
      };
      
      // Use our safe IPFS storage with validation
      const ipfsHash = await safeIPFSStore(candidateData);
      
      if (!ipfsHash) {
        toast.error("Failed to store candidate data securely");
        return;
      }
      
      // Switch chain if needed
      if (chain?.id === 43113) {
        await switchChain({ chainId: sepolia.id });
      }
      
      // Add candidate to the blockchain
      await writeContractAsync({
        address: electionAddress,
        abi: Election,
        functionName: "addCandidate",
        args: [name, ipfsHash],
      });
      
      toast.success(`${name} successfully added to the election`);
      setopenModal(false);
    } catch (error) {
      console.error("Error adding candidate:", error);
      toast.error(ErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog
        open={openModal}
        onClose={() => !isSubmitting && setopenModal(false)}
        className="relative z-50"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/30 duration-300 ease-out data-[closed]:opacity-0"
        />
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel
            transition
            className="max-w-lg rounded-2xl max-h-[90%] w-[65%] md:w-[50%] space-y-4 bg-white p-12 duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            <DialogTitle className="text-lg font-bold">
              Enter Candidate Details
            </DialogTitle>

            <form onSubmit={addCandidate} className="text-black mx-auto">
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="name"
                  id="name"
                  disabled={isSubmitting}
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer disabled:opacity-70"
                  required
                  placeholder=" "
                />
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Name
                </label>
              </div>
              <div className="relative gap-y-1 z-0 w-full mb-5 group">
                <textarea
                  rows={4}
                  name="description"
                  placeholder=" "
                  id="description"
                  disabled={isSubmitting}
                  className="block lg:max-h-48 max-h-24 mt-4 h-12 min-h-12 py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer disabled:opacity-70"
                  required
                ></textarea>
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Description
                </label>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-3xl text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:bg-blue-400"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </div>
                ) : "Submit"}
              </button>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default AddCandidate;
