import React from "react";
import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { ethers } from "ethers";
import Authentication from "../../build/Authentication.json";
import "../styles/Auth.scss";

function Auth() {
  const [authMode, setAuthMode] = useState("signup");
  const [registered, setRegistered] = useState("false");
  const [fullName, setFullName] = useState({
    name: "",
  });
  const contractAddress = "0xBB9AE7B6c49fC58B4eEe936b2cC5111abe481Fa2";

  const handleNameChange = (e) => {
    setFullName({
      ...fullName,
      name: e.target.value,
    });
  };

  const registerUser = async (e) => {
    e.preventDefault();
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        console.log(signer);
        const contract = new ethers.Contract(
          contractAddress,
          Authentication.abi,
          signer
        );
        console.log(contract);
        console.log(fullName.name);
        // const tx = await contract.createUser(fullName.name);
        const tx = await contract.createUser([1,fullName.name,"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"]);
        await tx.wait();
        console.log("suucce");
      }
    } catch (err) {
      console.log(err);
    }
  };
  const isRegistered = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const contract = new ethers.Contract(
          contractAddress,
          Authentication.abi,
          signer
        );
        const tx = await contract.getAuthStatus(
          "0xa221e2E48A4FB4461ed44e80F1ce1c598d3666A8"
        );
        console.log(tx);
        setRegistered(tx);
        // setRegistered(true);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    isRegistered();
  }, []);
  return (
    <div className="authDiv">
      <div className="description">
        <img src="/assets/aossie.png" alt="aossie" className="aossieLogo" />
      </div>

      <div className="authCardHolder">
        <div className="authCard">
          <center>
            <img src="/assets/agora.png" alt="agora" className="agoraLogo" />
            <font size="3" className="agoraTitle">
              <b>Agora Blockchain</b>
            </font>
          </center>

          <>
            <form onSubmit={registerUser} style={{ margin: "10px" }}>
              <label className="form-label">Name</label>
              <input
                className="form-control"
                placeholder="Enter your full name"
                onChange={handleNameChange}
                value={fullName.name}
                type="text"
              />
              <br />

              <label className="form-label">Wallet address</label>
              <input
                className="form-control"
                type="text"
                disabled
                // value={initialized ? account : "Loading..."}
              />
              <br />
              {
                registered==true
                ?
                <Navigate to='/dashboard' />
                :
                <button onClick={registerUser} className="authButtons">
                  SIGN UP
                </button>
              }
            </form>

            <br />

            {/* <font
			  className="text-muted centered signInOption"
			  size="2"
			  onClick={() => setAuthMode("signin")}
			>
			  Already a member? Sign in
			</font> */}
            <br />
          </>

          {/* <font className="centered" size="2">
			OR
		  </font>
		  <br />

		  <div className="socialLoginHolder">
			<img
			  src="/assets/facebook.png"
			  alt="facebook"
			  className="socialLoginButton"
			/>
			<img 
			  src="/assets/google.png" 
			  alt="google" 
			  className="socialLoginButton" 
			/>
			<img
			  src="/assets/twitter.png"
			  alt="twitter"
			  className="socialLoginButton"
			/>
		  </div>
		  <br /> */}
        </div>
      </div>
    </div>
  );
}

export default Auth;
