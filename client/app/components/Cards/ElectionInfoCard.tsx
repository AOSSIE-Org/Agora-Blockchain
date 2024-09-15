import React from "react";
import {
  TbCalendarMonth,
  TbCalendarDot,
  TbCalendarTime,
  TbCalendarOff,
} from "react-icons/tb";

const ElectionInfoCard = ({ counts, filterStatus, setFilterStatus }) => {
  const ElectionInfoImage = [
    { name: "All", image: TbCalendarMonth, count: counts.total },
    { name: "Pending", image: TbCalendarTime, count: counts.pending },
    { name: "Active", image: TbCalendarDot, count: counts.active },
    { name: "Ended", image: TbCalendarOff, count: counts.ended },
  ];

  const noElectionsMessage = {
    1: "No pending elections found",
    2: "No active elections found",
    3: "No ended elections found",
  };

  const currentCount = ElectionInfoImage[filterStatus].count;

  return (
    <div className="relative flex border border-gray-300 w-full flex-col rounded-xl bg-white p-4 text-gray-700 bg-clip-border shadow-xl shadow-blue-gray-900/5">
      <div className="p-4">
        <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
          Election List
        </h5>
      </div>
      <nav className="flex flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
        {currentCount === 0 ? (
          <div className="text-center text-lg font-bold text-red-500">
            {noElectionsMessage[filterStatus]}
          </div>
        ) : (
          ElectionInfoImage.map((electionPart, key) => (
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
          ))
        )}
      </nav>
    </div>
  );
};

export default ElectionInfoCard;
