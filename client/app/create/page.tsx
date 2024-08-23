"use client";
import React, { FormEvent, useState } from "react";
import {
  useAccount,
  useReadContract,
  useSwitchChain,
  useWriteContract,
} from "wagmi";
import { ELECTION_FACTORY_ADDRESS } from "../constants";
import { ElectionFactory } from "../../abi/artifacts/ElectionFactory";
import { ballotTypeMap } from "../helpers/votingInfo";
import { DatePicker } from "rsuite";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { ErrorMessage } from "../helpers/ErrorMessage";
import { BsCalendarPlus, BsCalendarMinus } from "react-icons/bs";
import { sepolia } from "viem/chains";
import { ArrowsRightLeftIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";
import ElectionInfoPopup from "../components/Modal/ElectionInfoPopup";
import { createGroupIPFS } from "../helpers/pinToIPFS";

const page = () => {
  const router = useRouter();
  const [SelectedBallot, setSelectedBallot] = useState(1);
  const { switchChain } = useSwitchChain();
  const { chain } = useAccount();
  const changeChain = () => {
    switchChain({ chainId: sepolia.id });
  };

  const { writeContractAsync } = useWriteContract();
  const [startTime, setstartTime] = useState(new Date());
  const [endTime, setendTime] = useState(new Date());

  const { data: electionCount } = useReadContract({
    chainId: sepolia.id,
    abi: ElectionFactory,
    address: ELECTION_FACTORY_ADDRESS,
    functionName: "electionCount",
  });

  const createElection = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const ballotType = BigInt(SelectedBallot);
    const start = BigInt(Math.floor(new Date(startTime).getTime() / 1000));
    const end = BigInt(Math.floor(new Date(endTime).getTime() / 1000));
    if (start >= end) {
      toast.error("Invalid Timing");
      return;
    }
    try {
      await createGroupIPFS(Number(electionCount!));
      await writeContractAsync({
        address: ELECTION_FACTORY_ADDRESS,
        abi: ElectionFactory,
        functionName: "createElection",
        args: [
          {
            startTime: start,
            endTime: end,
            name: name,
            description: description,
          },
          ballotType,
          ballotType,
        ],
      });
      setTimeout(toast.success("Election Added"), 100);
      router.push("/");
    } catch (error) {
      console.log("Error", error);
      toast.error(ErrorMessage(error));
    }
  };
  const handleBallotChange = (event: any) => {
    const selectedValue = event.target.value;
    setSelectedBallot(Number(selectedValue));
  };
  const handleChange = (value: any, event: any, type: number) => {
    type === 0 ? setstartTime(value) : setendTime(value);
  };
  return (
    <div className="min-h-screen w-full overflow-auto rounded-2xl bg-white flex items-center justify-center">
      <div className="w-[50%] mx-4 px-6 lg:px-8 flex my-8 flex-col">
        <div className="w-full">
          <p className="my-4 text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
            Create Election
          </p>
        </div>
        <form onSubmit={createElection} className="text-black w-full">
          <div className="relative gap-y-1 z-0 w-full mb-5 group">
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
          <div className="relative gap-y-1 z-0 w-full mb-5 group">
            <textarea
              rows={4}
              name="description"
              placeholder=" "
              id="description"
              className="block lg:max-h-48 max-h-24 h-12 min-h-12 py-2.5 my-4 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none    focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            ></textarea>
            <label className="peer-focus:font-medium absolute my-1 text-sm text-gray-500  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
              Descriptions
            </label>
          </div>
          <div className="relative gap-y-1 z-0 w-full mb-5 group">
            <label className="block mb-2 text-sm font-medium text-gray-900 ">
              Select Voting Type
            </label>
            <div className="flex">
              <select
                value={SelectedBallot}
                onChange={handleBallotChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[95%] p-2.5"
              >
                {Object.entries(ballotTypeMap).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.name} Voting
                  </option>
                ))}
              </select>
              <ElectionInfoPopup id={SelectedBallot} />
            </div>
          </div>
          <div className="relative gap-y-1 z-0 w-full mb-5 group"></div>
          <div className="relative gap-y-1 z-0 w-full mb-5 group">
            <div className="flex justify-around w-full items-center flex-row gap-4">
              <DatePicker
                onChange={(value, event) => {
                  handleChange(value, event, 0);
                }}
                caretAs={BsCalendarPlus}
                placement="topStart"
                className="w-[50%]"
                format="dd/MM/yyyy HH:mm"
                placeholder="Select Start Date"
              />
              <DatePicker
                className="w-[50%]"
                caretAs={BsCalendarMinus}
                onChange={(value, event) => {
                  handleChange(value, event, 1);
                }}
                placement="topEnd"
                format="dd/MM/yyyy HH:mm"
                placeholder="Select End Date"
              />
            </div>
          </div>
          <div className="flex w-full justify-center">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-3xl text-sm w-full sm:w-auto px-5 py-2.5 text-center "
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      {chain?.id === 43113 && (
        <div className="fixed z-20 h-full w-full bg-white bg-opacity-20 backdrop-blur-sm">
          <div className="inline-flex flex-col gap-y-4 w-full h-full items-center justify-center">
            <p className="text-lg">
              Creating Elections is Supported only on Sepolia
            </p>
            <button
              onClick={changeChain}
              className="align-middle bg-white select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-sm py-2.5 px-5 rounded-lg text-blue-gray-900 shadow-md shadow-blue-gray-500/10 hover:shadow-lg hover:shadow-blue-gray-500/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none flex items-center gap-3"
              type="button"
            >
              <ArrowsRightLeftIcon className="w-5 h-5" />
              Switch Chain
            </button>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  );
};

export default page;
