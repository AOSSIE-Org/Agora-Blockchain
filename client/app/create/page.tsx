"use client";
import React, { FormEvent, useState } from "react";
import { useAccount, useSwitchChain, useWriteContract } from "wagmi";
import { motion } from "framer-motion";
import { ELECTION_FACTORY_ADDRESS } from "../constants";
import { ElectionFactory } from "../../abi/artifacts/ElectionFactory";
import { ballotTypeMap } from "../helpers/votingInfo";
import { DatePicker } from "rsuite";
import toast, { Toaster } from "react-hot-toast";
import { ErrorMessage } from "../helpers/ErrorMessage";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { sepolia } from "viem/chains";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import ElectionInfoPopup from "../components/Modal/ElectionInfoPopup";

const CreatePage: React.FC = () => {
  const router = useRouter();
  const [selectedBallot, setSelectedBallot] = useState<number>(1);
  const { switchChain } = useSwitchChain();
  const { chain } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(new Date());

  const changeChain = () => {
    switchChain({ chainId: sepolia.id });
  };

  const createElection = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const ballotType = BigInt(selectedBallot);

    if (!startTime || !endTime) {
      toast.error("Please select both start and end times.");
      return;
    }

    const start = BigInt(Math.floor(startTime.getTime() / 1000));
    const end = BigInt(Math.floor(endTime.getTime() / 1000));

    if (start >= end) {
      toast.error("Invalid timing. End time must be after start time.");
      return;
    }

    try {
      await writeContractAsync({
        address: ELECTION_FACTORY_ADDRESS,
        abi: ElectionFactory,
        functionName: "createElection",
        args: [
          { startTime: start, endTime: end, name, description },
          ballotType,
          ballotType,
        ],
      });
      toast.success("Election created successfully!");
      router.push("/");
    } catch (error) {
      console.error("Error creating election:", error);
      toast.error(ErrorMessage(error));
    }
  };

  const handleBallotChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBallot(Number(event.target.value));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 space-y-8 mt-12"
      >
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Create New Election
        </h2>
        <form onSubmit={createElection} className="space-y-6">
          <InputField
            name="name"
            label="Election Name"
            placeholder="Enter election name"
          />
          <TextareaField
            name="description"
            label="Description"
            placeholder="Describe the election"
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Voting Type
            </label>
            <div className="flex items-center space-x-2">
              <select
                value={selectedBallot}
                onChange={handleBallotChange}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {Object.entries(ballotTypeMap).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.name} Voting
                  </option>
                ))}
              </select>
              <ElectionInfoPopup id={selectedBallot} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <DatePickerField
              value={startTime}
              onChange={(value) => setStartTime(value)}
              label="Start Date"
            />
            <DatePickerField
              value={endTime}
              onChange={(value) => setEndTime(value)}
              label="End Date"
            />
          </div>
          <motion.button
            type="submit"
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Create Election
          </motion.button>
        </form>
      </motion.div>
      {chain?.id !== sepolia.id && <ChainSwitchModal onSwitch={changeChain} />}
      <Toaster />
    </motion.div>
  );
};

interface InputFieldProps {
  name: string;
  label: string;
  placeholder: string;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  placeholder,
}) => (
  <motion.div
    className="space-y-1"
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.3, duration: 0.5 }}
  >
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type="text"
      name={name}
      id={name}
      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      placeholder={placeholder}
      required
    />
  </motion.div>
);

const TextareaField: React.FC<InputFieldProps> = ({
  name,
  label,
  placeholder,
}) => (
  <motion.div
    className="space-y-1"
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.4, duration: 0.5 }}
  >
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <textarea
      name={name}
      id={name}
      rows={4}
      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      placeholder={placeholder}
      required
    ></textarea>
  </motion.div>
);

interface DatePickerFieldProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label: string;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  value,
  onChange,
  label,
}) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <DatePicker
      value={value}
      placement="topStart"
      onChange={onChange}
      format="yyyy-MM-dd HH:mm"
      className="block w-full"
      caretAs={CalendarIcon}
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "0.375rem",
        padding: "0.5rem",
      }}
    />
  </div>
);

interface ChainSwitchModalProps {
  onSwitch: () => void;
}

const ChainSwitchModal: React.FC<ChainSwitchModalProps> = ({ onSwitch }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed z-20 inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="bg-white rounded-lg p-8 shadow-xl text-center"
    >
      <p className="text-xl mb-4 text-gray-800">
        Creating Elections is supported only on Sepolia
      </p>
      <motion.button
        onClick={onSwitch}
        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowPathIcon className="w-5 h-5 mr-2" />
        Switch Chain
      </motion.button>
    </motion.div>
  </motion.div>
);

export default CreatePage;