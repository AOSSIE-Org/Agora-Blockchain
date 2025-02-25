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
import { ArrowPathIcon , PlusIcon, TrashIcon} from "@heroicons/react/24/solid";
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
  const [candidates,setCandidates] = useState<Candidate[]>([])
  const changeChain = () => {
    switchChain({ chainId: sepolia.id });
  }
  interface Candidate {
    name: string;
    description: string;
  }
  const addCandidate = () => {
    setCandidates([...candidates, { name: "", description: "" }]);
  };
  
  const removeCandidate = (index: number) => {
    const newCandidates = candidates.filter((_, i) => i !== index);
    setCandidates(newCandidates);
  };
  
  const updateCandidate = (index: number, field: keyof Candidate, value: string) => {
    const newCandidates = candidates.map((candidate, i) => {
      if (i === index) {
        return { ...candidate, [field]: value };
      }
      return candidate;
    });
    setCandidates(newCandidates);
  };
  const createElection = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const ballotType = BigInt(selectedBallot);

    if (candidates.length<2){
      toast.error("At least 2 candidates are required!");
      return;
    
    }

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
    if(candidates.length>0  && candidates.some(candidate=>!candidate.name || !candidate.description)){
      toast.error("please enter all candidate information or remove empty candidates.")
      return 
    }
  // passed candidates to the create election function 
    try {
      await writeContractAsync({
        address: ELECTION_FACTORY_ADDRESS,
        abi: ElectionFactory,
        functionName: "createElection",
        args: [
          { startTime: start, endTime: end, name, description }, // ElectionInfo object
          candidates.map((c, index) => ({ candidateID: BigInt(index), name: c.name, description: c.description })), 
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
    className="h-screen w-full bg-gradient-to-br pt-[50px] from-gray-100 to-gray-200 flex flex-col items-center justify-start p-4 overflow-y-auto"
  >
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 space-y-8 my-12"
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
          {/* candidate section  shows placeholder if empty candidate and allows to add cnadidates*/ }
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Candidates</h3>
              <motion.button
                type="button"
                onClick={addCandidate}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <PlusIcon className="h-4 w-4 mr-1" />
                Add Candidate
              </motion.button>
            </div>
            
            {candidates.length === 0 ? (
              <p className="text-gray-500 text-sm italic text-center py-4">
                No candidates added yet. Click "Add Candidate" to begin adding candidates.
              </p>
            ) : (
              candidates.map((candidate, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 border border-gray-200 rounded-lg space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-md font-medium text-gray-700">
                      Candidate {index + 1}
                    </h4>
                    <motion.button
                      type="button"
                      onClick={() => removeCandidate(index)}
                      className="text-red-600 hover:text-red-700"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </motion.button>
                  </div>
                  <input
                    type="text"
                    value={candidate.name}
                    onChange={(e) => updateCandidate(index, "name", e.target.value)}
                    placeholder="Candidate Name"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                  <textarea
                    value={candidate.description}
                    onChange={(e) => updateCandidate(index, "description", e.target.value)}
                    placeholder="Candidate Description"
                    rows={2}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </motion.div>
              ))
            )}
          </div>

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