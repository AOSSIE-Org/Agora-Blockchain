import React from "react";
import AossieImg from "../../../public/aossie.png";
import Web3Connect from "../Helper/Web3Connect";

const LoginPage = () => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen w-full"
      style={{
        background: "linear-gradient(to right, #e3f2fd, #bbdefb)",
      }}
    >
      {/* Content Container */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-96 text-center">
        {/* Logo */}
        <img
          src={AossieImg.src}
          alt="Aossie Logo"
          className="h-20 mx-auto mb-6"
          style={{ objectFit: "contain" }}
        />

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Election Dashboard
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 mb-8">
          Please connect your wallet to access the election dashboard.
        </p>

        <div className="flex justify-center">
        <Web3Connect/>

        </div>
      </div>

      
    </div>
  );
};

export default LoginPage;
