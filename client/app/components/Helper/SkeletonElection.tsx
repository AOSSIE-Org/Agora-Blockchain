import React from "react";

const SkeletonElection = () => {
  return (
    <div role="status" className="animate-pulse w-screen">
      <div className="flex w-[90%] md:w-[45%] lg:w-[30%] h-xl px-3 py-1 rounded-lg border-[1.8px] border-black border-opacity-20 flex-col items-start justify-between">
        <div className="group w-full relative ">
          <div className="mt-3">
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-full mx-auto"></div>
          </div>
          <div className="mt-3 h-20">
            <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-full mx-auto"></div>
          </div>
        </div>
        <div className=" my-2 flex items-center justify-between w-full">
          <div className=" flex  items-center">
            <svg
              className="w-8 h-8 text-gray-200 dark:text-gray-700 me-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
            </svg>
            <div className="mx-1 leading-5 space-y-1">
              <div>
                <span className="absolute " />
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-full mx-auto"></div>
              </div>
              <div className="w-[100px]">
                <div className="h-2.5 bg-gray-300 rounded-full dark:bg-gray-700 w-full mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonElection;
