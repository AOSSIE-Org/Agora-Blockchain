import React from "react";
import AossieImg from "../../../public/aossie.png";
const LoginPage = () => {
  return (
    <div
      className="flex p-8 h-full w-full items-start justify-between"
      style={{
        backgroundImage: `url(${AossieImg.src})`,
        backgroundSize: "20%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    ></div>
  );
};

export default LoginPage;
