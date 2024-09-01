"use client";
import React from "react";
import ElectionMini from "../components/Cards/ElectionMini";
import { useOpenElection } from "../components/Hooks/GetOpenElections";
import Loader from "../components/Helper/Loader";

const ProfilePage = () => {
  const { elections, isLoading } = useOpenElection();
  if (isLoading) return <Loader />;
  return (
    <div className="min-h-screen bg-white pt-20 w-full flex items-start justify-center">
      <div className="my-4 rounded-2xl p-2 md:p-4 flex flex-col items-center">
        <div className="w-[90%] lg:w-[55%]">
          <p className="mt-2 text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
            Profile
          </p>
          <div
            className="flex-col space-y-6 my-3 inline-block items-center justify-center"
            style={{ height: "75vh" }}
          >
            {elections!.map((election, key) => {
              return <ElectionMini electionAddress={election} key={key} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
