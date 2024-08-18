import React, { useState } from "react";

const SearchBar = () => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-500"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke-width="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
      </div>
      <input
        type="search"
        placeholder="Search Elections ..."
        className="block w-full px-4 py-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-opacity-10 bg-gray-50 "
      />
    </div>
  );
};

export default SearchBar;
