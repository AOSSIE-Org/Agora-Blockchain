"use client";
import React from "react";
import ElectionMini from "../components/Cards/ElectionMini";
import { useOpenElection } from "../components/Hooks/GetOpenElections";
import Loader from "../components/Helper/Loader";

const ProfilePage = () => {
  const { elections, isLoading } = useOpenElection();
  if (isLoading) return <Loader />;
  return (
    <div className="min-h-screen overflow-auto bg-white pt-20 w-full flex items-start justify-center">
      <div className="my-2 rounded-2xl">
        <div className=" p-2 rounded-lg md:p-4 ">
          <div className="flex flex-col mx-6 my-1 w-full items-start justify-around lg:mx-0">
            <p className="mt-2 text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
              Profile
            </p>
          </div>
          <div
            className="w-[90%] lg:w-[75%] flex-col space-y-6 my-3 inline-block overflow-auto items-center justify-center"
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
