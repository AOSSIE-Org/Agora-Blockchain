"use client";
import React, { FormEvent,useState } from "react";
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
import { pinJSONFile } from "@/app/helpers/pinToIPFS";
import {create} from "kubo-rpc-client";
import {env} from "node:process"
import { url } from "inspector";

const projectId = process.env.PROJECT_ID; // Replace with your Project ID
const projectSecret = process.env.PROJECT_SECRET;; // Replace with your Project Secret
const auth = 'Basic ' + Buffer.from(`${projectId}:${projectSecret}`).toString('base64');

// Connect to Infura IPFS
const client = create({
  url: 'https://ipfs.infura.io:5001',
  headers: {
      authorization: auth,
  },
});

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
  const [cid,setCid] = useState<string>("");
  const electionID = electionData[8].result;
  const addCandidate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const file = formData.get("file") as File;
    try{
      const result = await client.add(file);
      const url = `https://ipfs.io/ipfs/${result.cid}`;
      toast.success('Image uploaded to IPFS: ' + url);
      setCid(url.replace("https://ipfs.io/ipfs/", ""));
    }
    catch(error){
      console.log(error);
      toast.error(ErrorMessage(error));
    }
    const jsonBody = {
      pinataContent: {
        name: name,
        description: description,
        filehash: cid,
      },
    };
    try {
      const res = await pinJSONFile(jsonBody);
      console.log(`The res is ${res}`);
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
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (isImage || isVideo) {
        setFileType(isImage ? "image" : "video");

        const previewURL = URL.createObjectURL(file);
        setPreview(previewURL);
      } else {
        alert("Please upload an image or a video file.");
        setPreview(null);
        setFileType(null);
      }
    }
  };
  const clearPreview = () => {
    setPreview(null);
    setFileType(null);
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
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none    focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  required
                  placeholder=" "
                />
                <label className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Name
                </label>
              </div>
              <div className=" relative  gap-y-1  z-0 w-full mb-5 group">
                <textarea
                  rows={4}
                  name="description"
                  placeholder=" "
                  id="description"
                  className="block lg:max-h-48 max-h-24 mt-4 h-12 min-h-12 py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none    focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                ></textarea>
                <label className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Description
                </label>
              </div>
              <div className=" relative  gap-y-1  z-0 w-full mb-5 group">
                <input
                  name="file"
                  type="file"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  required
                />
                {preview && (
                <div 
                  className="flex-col flex items-center justify-center w-full py-3"
                >
                  {fileType === "image" && (
                    <img src={preview} alt="Preview" className="w-3/5 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                  )}
                  {fileType === "video" && (
                    <video controls>
                      <source src={preview} type="video/mp4" className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                      Your browser does not support the video tag.
                    </video>
                  )}
                  <button onClick={clearPreview} className=" border border-gray-300 px-2 py-1 rounded-md mt-2">
                    Clear Preview
                  </button>
                </div>
              )}
              </div>
              {/* <div className="relative z-0 w-full mb-5 group">
                <label className="peer-focus:font-medium absolute text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  Upload file
                </label>
                <input
                  className="block w-full mt-4 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                  aria-describedby="file_input_help"
                  id="file_input"
                  type="file"
                />
              </div> */}
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-3xl text-sm w-full sm:w-auto px-5 py-2.5 text-center "
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
