import React, { useState } from "react";
const ClipBoard = ({ inputValue }) => {
  const [isCopied, setisCopied] = useState(false);
  const copyText = () => {
    setisCopied(true);
    navigator.clipboard.writeText(inputValue);
  };
  return (
    // <div className="flex">
    //   <input
    //     type="text"
    //     id="myInput"
    //     className="col-span-6 mx-1 w-full bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 "
    //     value={inputValue}
    //     disabled
    //   />
    //   <div className="  text-gray-500 rounded-lg p-2 inline-flex items-center justify-center">
    //     {!isCopied ? (
    //       <button onClick={copyText}>
    //         <svg
    //           className="w-3.5 h-3.5"
    //           aria-hidden="true"
    //           xmlns="http://www.w3.org/2000/svg"
    //           fill="currentColor"
    //           viewBox="0 0 18 20"
    //         >
    //           <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
    //         </svg>
    //       </button>
    //     ) : (
    //       <button onClick={copyText} className=" items-center">
    //         <svg
    //           className="w-3.5 h-3.5 text-blue-700 dark:text-blue-500"
    //           aria-hidden="true"
    //           xmlns="http://www.w3.org/2000/svg"
    //           fill="none"
    //           viewBox="0 0 16 12"
    //         >
    //           <path
    //             stroke="currentColor"
    //             strokeLinecap="round"
    //             strokeLinejoin="round"
    //             strokeWidth="2"
    //             d="M1 5.917 5.724 10.5 15 1.5"
    //           />
    //         </svg>
    //       </button>
    //     )}
    //   </div>
    // </div>
    <div className="flex items-center">
      <span className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg ">
        URL
      </span>
      <div className="relative w-full">
        <input
          type="text"
          aria-describedby="helper-text-explanation"
          className="bg-gray-50 border border-e-0 border-gray-300 text-gray-500 dark:text-gray-400 text-sm border-s-0 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
          value={inputValue}
          disabled
        />
      </div>
      <button
        onClick={copyText}
        className="flex-shrink-0 z-10 inline-flex items-center py-3 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-e-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 "
      >
        {isCopied ? (
          <span className=" inline-flex items-center">
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 16 12"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 5.917 5.724 10.5 15 1.5"
              />
            </svg>
          </span>
        ) : (
          <span id="default-icon">
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 20"
            >
              <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
            </svg>
          </span>
        )}
      </button>
    </div>
  );
};

export default ClipBoard;
