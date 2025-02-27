"use client";
import React, { FormEvent, useState, useRef } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import toast from "react-hot-toast";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { pinata } from "@/utils/config";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
import { Election } from "../../../abi/artifacts/Election";
import { ErrorMessage } from "../../helpers/ErrorMessage";
import { sepolia } from "viem/chains";
import { useElectionData } from "@/app/hooks/ElectionInfo";
import { pinJSONFile } from "@/app/helpers/pinToIPFS";

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
  
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setPhotoUrl(""); // Reset URL when a new file is selected
    }
  };

  const uploadFile = async () => {
    if (!file) {
      toast.error("No file selected");
      return "";
    }

    try {
      setUploading(true);
      const keyRequest = await fetch("/api/key");
      const keyData = await keyRequest.json();
      const upload = await pinata.upload.file(file).key(keyData.JWT);
      const url = `https://ipfs.io/ipfs/${upload.IpfsHash}`;
      setPhotoUrl(url);
      setUploading(false);
      toast.success("Photo uploaded successfully!");
      alert('URL: ' + url);
      return upload.IpfsHash;
    } catch (e) {
      console.log(e);
      setUploading(false);
      toast.error("Trouble uploading photo");
      return "";
    }
  };

  const addCandidate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    let photoHash = "";
    if (file && !photoUrl) {
      toast.loading("Uploading candidate photo...");
      photoHash = await uploadFile();
      if (!photoHash) {
        toast.error("Failed to upload candidate photo.");
        return;
      }
    } else if (photoUrl) {
      photoHash = photoUrl.split('/').pop() || "";
    }

    const jsonBody = {
      pinataContent: {
        name: name,
        description: description,
        photoHash: photoHash 
      },
    };

    try {
      const res = await pinJSONFile(jsonBody);
      if (chain?.id === 43113) switchChain({ chainId: sepolia.id });
      await writeContractAsync({
        address: electionAddress,
        abi: Election,
        functionName: "addCandidate",
        args: [name, res.IpfsHash],
      });
      toast.success(`${name} Added to Election`);
    } catch (error) {
      console.log("Error ", error);
      toast.error(ErrorMessage(error));
    }
    setopenModal(false);
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
                  placeholder=" "
                />
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Name
                </label>
              </div>
              
              <div className="relative z-0 w-full mb-5 group">
                <textarea
                  rows={4}
                  name="description"
                  placeholder=" "
                  id="description"
                  className="block lg:max-h-48 max-h-24 mt-4 h-12 min-h-12 py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                ></textarea>
                <label className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Description
                </label>
              </div>
              
              {/* Photo Upload Section */}
              <div className="relative z-0 w-full mb-5 group">
                <label className="block text-sm text-gray-500 mb-2">
                  Candidate Photo
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                    disabled={uploading}
                  >
                    <PhotoIcon className="h-5 w-5 mr-2 text-gray-500" />
                    Select Photo
                  </button>
                  {file && !photoUrl && (
                    <button
                      type="button"
                      onClick={uploadFile}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                      disabled={uploading}
                    >
                      {uploading ? "Uploading..." : "Upload Photo"}
                    </button>
                  )}
                </div>
                
                {file && (
                  <div className="mt-2 text-sm text-gray-500">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </div>
                )}
                
                {photoUrl && (
                  <div className="mt-3 flex flex-col space-y-2">
                    <div className="text-sm text-gray-500">Photo uploaded:</div>
                    <div className="flex items-center space-x-3">
                      <div className="h-16 w-16 border border-gray-200 rounded-md overflow-hidden">
                        <img 
                          src={photoUrl} 
                          alt="Candidate photo preview" 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <a 
                        href={photoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs text-blue-600 hover:text-blue-800 underline truncate max-w-xs"
                      >
                        {photoUrl}
                      </a>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-3xl text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                disabled={uploading}
              >
                Submit
              </button>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default AddCandidate;