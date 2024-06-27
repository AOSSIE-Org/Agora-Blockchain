"use client";
import React, { FormEvent, useState } from "react";
import { useWriteContract } from "wagmi";
import { ELECTION_FACTORY_ADDRESS } from "../constants";
import { ElectionFactory } from "../../abi/artifacts/ElectionFactory";
import { ballotTypeMap } from "../helpers/votingInfo";
import { DatePicker } from "rsuite";
import toast from "react-hot-toast";
import { ErrorMessage } from "../helpers/ErrorMessage";
const page = () => {
  const { writeContractAsync } = useWriteContract();
  const [startTime, setstartTime] = React.useState(new Date());
  const [endTime, setendTime] = React.useState(new Date());

  const createElection = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const ballotType = BigInt(formData.get("ballot") as string);
    const start = BigInt(Math.floor(new Date(startTime).getTime() / 1000));
    const end = BigInt(Math.floor(new Date(endTime).getTime() / 1000));
    console.log(name, description, ballotType);
    try {
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
      toast.success("Election Added");
    } catch (error) {
      toast.error(ErrorMessage(error));
    }
  };
  const handleChange = (value: any, event: any, type: number) => {
    type === 0 ? setstartTime(value) : setendTime(value);
  };
  return (
    <div className="min-h-screen w-full mx-4 px-6 lg:px-8 overflow-auto rounded-2xl bg-white flex items-center  justify-center">
      <div className="w-[50%] flex my-8 flex-col">
        <div className="w-full">
          <p className="my-4 text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
            Create Election
          </p>
        </div>
        <form onSubmit={createElection} className="text-black w-full">
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
            <label className="block mb-2 text-sm font-medium text-gray-900 ">
              Select Voting Type
            </label>
            <select
              id="ballot"
              name="ballot"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              {Object.entries(ballotTypeMap).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className=" relative  gap-y-1  z-0 w-full mb-5 group">
            <div className="flex justify-around w-full items-center flex-row gap-4">
              <DatePicker
                onChange={(value, event) => {
                  handleChange(value, event, 0);
                }}
                className="w-[50%]"
                format="dd/MM/yyyy HH:mm"
                placeholder="Select Start Date"
              />
              <DatePicker
                className="w-[50%]"
                onChange={(value, event) => {
                  handleChange(value, event, 1);
                }}
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
    </div>
  );
};

export default page;
