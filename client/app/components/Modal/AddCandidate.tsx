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
import { pinJSONFile, pinFileToIPFS } from "@/app/helpers/pinToIPFS";

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
  const electionID = electionData[8].result;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const addCandidate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);
    
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    let mediaURI = "";
    
    try {
      // If there's a file selected, upload it to IPFS first
      if (selectedFile) {
        const loadingToast = toast.loading("Uploading media to IPFS...");
        try {
          const result = await pinFileToIPFS(selectedFile);
          mediaURI = result.IpfsHash;
          toast.dismiss(loadingToast);
          toast.success("Media uploaded successfully!");
        } catch (error) {
          toast.dismiss(loadingToast);
          toast.error("Failed to upload media. Continuing with candidate creation.");
          console.error("Error uploading to IPFS:", error);
        }
      }
      
      // Create the candidate description JSON
      const jsonBody = {
        pinataContent: {
          name: name,
          description: description,
        },
      };
      
      // Pin the description to IPFS
      const res = await pinJSONFile(jsonBody);
      
      // Change chain if needed
      if (chain?.id === 43113) switchChain({ chainId: sepolia.id });
      
      // Add the candidate to the election contract
      await writeContractAsync({
        address: electionAddress,
        abi: Election,
        functionName: "addCandidate",
        args: [name, res.IpfsHash, mediaURI],
      });
      
      toast.success(`${name} Added to Election`);
    } catch (error) {
      console.log("Error ", error);
      toast.error(ErrorMessage(error));
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
      setopenModal(false);
    }
  };
  
  return (
    <>
      <Dialog
        open={openModal}
        onClose={() => setopenModal(false)}
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
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  required
                />
                <label
                  htmlFor="name"
                  className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Candidate Name
                </label>
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <textarea
                  name="description"
                  id="description"
                  rows={4}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Write candidate description here..."
                  required
                ></textarea>
              </div>
              
              <div className="relative z-0 w-full mb-5 group">
                <label
                  htmlFor="media"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Candidate Media (Optional)
                </label>
                <input
                  type="file"
                  name="media"
                  id="media"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Upload an image or video for the candidate (Max 10MB)
                </p>
                {selectedFile && (
                  <p className="mt-2 text-sm text-green-600">
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setopenModal(false)}
                  className="text-gray-500 bg-white hover:bg-gray-100 border border-gray-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {isUploading ? "Adding..." : "Add Candidate"}
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default AddCandidate;
