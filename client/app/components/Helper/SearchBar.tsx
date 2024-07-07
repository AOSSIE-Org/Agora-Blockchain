import React, { Fragment, useState } from "react";
import {
  Menu,
  Transition,
  MenuButton,
  MenuItems,
  MenuItem,
} from "@headlessui/react";
import { TbCalendarDot, TbCalendarTime, TbCalendarOff } from "react-icons/tb";

const SearchBar = ({ elections }: any) => {
  const [inputText, setinputText] = useState("");
  return (
    <div className="flex w-full  items-center justify-center">
      <div className="flex w-[40%] mx-auto">
        <Menu as="div" className="inline-block text-left">
          <MenuButton className="flex items-center justify-center">
            <button className="flex-shrink-0 z-10  inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100">
              <p>Categories</p>
              <svg
                className="w-2.5 h-2.5 ms-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
          </MenuButton>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems className="z-10 absolute min-w-40 mt-1 border-white border-[1px] border-opacity-20 shadow-lg ring-1 bg-white ring-gray-600 ring-opacity-5 rounded-xl focus:outline-none ">
              <div className=" text-gray-700 text-sm flex flex-col items-center justify-center">
                <MenuItem>
                  <button className="flex items-center justify-around border-b-[1px] w-full px-5 py-2.5  group hover:bg-gray-100 hover:text-blue-500 ">
                    <TbCalendarTime size={20} />
                    Active
                  </button>
                </MenuItem>
                <MenuItem>
                  <button className="flex items-center justify-around border-b-[1px] w-full px-5 py-2.5 group hover:bg-gray-100 hover:text-blue-500 ">
                    <TbCalendarOff size={20} />
                    Ended
                  </button>
                </MenuItem>
                <MenuItem>
                  <button className="flex items-center justify-around w-full px-5 py-2.5  group hover:bg-gray-100 hover:text-blue-500">
                    <TbCalendarDot className=" ml-1" size={20} />
                    Starting
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </Transition>
        </Menu>
        <div className="flex flex-row w-full ">
          <div className="relative w-full ">
            <input
              className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 outline-none "
              placeholder="Search Elections ..."
              required
            />
            <button className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-blue-700 rounded-e-lg border border-blue-700 hover:bg-blue-800 focus:outline-none  ">
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </div>
          {/* {inputText === "" && (
            <div className="absolute px-4 z-20 ">
              <ul className="rounded-xl border border-black border-opacity-30 text-sm text-gray-700 mt-10 ">
                <li>
                  <button
                    type="button"
                    className="inline-flex w-full rounded-xl bg-white px-4 py-2 hover:bg-gray-100 "
                  >
                    Mockups
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="inline-flex w-full rounded-xl px-4 py-2 bg-white hover:bg-gray-100 "
                  >
                    Templates
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="inline-flex w-full rounded-xl px-4 py-2 bg-white hover:bg-gray-100 "
                  >
                    Design
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="inline-flex w-full rounded-xl px-4 py-2 bg-white hover:bg-gray-100 "
                  >
                    Logos
                  </button>
                </li>
              </ul>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
