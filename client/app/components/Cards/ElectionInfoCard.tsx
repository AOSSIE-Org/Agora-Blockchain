import React from "react";
import { useElectionStats } from "@/app/hooks/ElectionsStats";
import LoaderInline from "../Helper/LoaderInline";
import {
  TbCalendarMonth,
  TbCalendarDot,
  TbCalendarTime,
  TbCalendarOff,
} from "react-icons/tb";

const ElectionInfoCard = ({ counts, filterStatus, setFilterStatus }: any) => {
  if (counts.total == 0) return <LoaderInline />;
  const ElectionInfoImage = [
    { name: "All", image: TbCalendarMonth, count: counts.total },
    { name: "Pending", image: TbCalendarTime, count: counts.pending },
    { name: "Active", image: TbCalendarDot, count: counts.active },
    { name: "Ended", image: TbCalendarOff, count: counts.ended },
  ];
  return (
    <div className="relative flex border border-gray-300 w-full flex-col rounded-xl bg-white p-4 text-gray-700 bg-clip-border shadow-xl shadow-blue-gray-900/5">
      <div className="p-4">
        <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Election List
        </h5>
      </div>
      <nav className="flex flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
        {ElectionInfoImage.map((electionPart, key) => {
          return (
            <button
              key={key}
              onClick={() => setFilterStatus(key)}
              className={`flex relative items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900 ${
                key === filterStatus && " bg-slate-100"
              }`}
            >
              <div className="grid mr-4 place-items-center">
                <electionPart.image size={20} />
              </div>
              {electionPart.name}
              <div className="absolute right-2 px-2 font-sans text-sm font-semibold uppercase rounded-full whitespace-nowrap text-blue-gray-900">
                <span className="">{electionPart.count}</span>
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default ElectionInfoCard;
