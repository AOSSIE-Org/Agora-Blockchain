"use client";
import React from "react";
import Web3Connect from "../Helper/Web3Connect";
import Link from "next/link";

const Header = () => {
  return (
    <div className="bg-white border-b-[0.5px] border-gray-300 fixed flex w-full">
      <div className="w-[70%] px-10 py-8 flex items-start">
        <Link href={"/"}>
          <h1 className="text-2xl relative top-0 left-0 text-gray-800 font-bold">
            Agora Blockchain
          </h1>
        </Link>
        {/* <nav className="flex   w-full justify-around items-center bg-white">
          <div className="flex text-lg items-center">
            <form className="w-[70%] lg:w-[100%] mx-4">
              <label className=" text-sm font-medium text-gray-900 sr-only dark:text-white">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  id="default-search"
                  className="block w-full px-5 py-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search Elections.."
                  required
                />
              </div>
            </form>
            <ul className="flex items-center ">
              <li className="font-semibold text-gray-700">Profile</li>
            </ul>
          </div>
        </nav> */}
      </div>
    </div>
  );
};

export default Header;
