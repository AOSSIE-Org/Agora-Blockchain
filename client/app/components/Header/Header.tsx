"use client";
import React from "react";
import Link from "next/link";
import { PlusCircleIcon, UserIcon } from "@heroicons/react/24/outline";
const Header = () => {
  return (
    <div className="bg-white border-b-[0.5px] z-30 border-gray-300 fixed flex w-full">
      <div className="w-[70%] px-10 py-8 flex items-center justify-between">
        <Link href={"/"}>
          <div className="flex gap-x-4 items-center">
            <img className=" flex w-10" src="/aossie.png" alt="pfp" />
            <h1 className="text-2xl sm:flex hidden  text-gray-800 font-bold">
              Agora Blockchain
            </h1>
          </div>
        </Link>
        <nav className="flex w-[50%] justify-start items-center  ">
          <div className="flex text-lg w-full items-center justify-around">
            <Link href={"/create"}>
              <button className="font-semibold gap-x-1 items-center flex text-gray-700">
                <PlusCircleIcon className="w-6" />
                <p> Create</p>
              </button>
            </Link>
            <button className="font-semibold gap-x-1 items-center flex text-gray-700">
              <UserIcon className="w-6" />
              <p>Profile</p>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Header;
