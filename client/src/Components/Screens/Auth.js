import React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Authentication from "../../build/Authentication.json";
import "../styles/Auth.scss";
import { CONTRACTADDRESS } from '../constants'
import { Navigate } from "react-router-dom";
import CryptoJS from 'crypto-js';

function Auth() {
  const [authMode, setAuthMode] = useState("signup");
  const [registered, setRegistered] = useState(false);
  const [fullName, setFullName] = useState({
    name: "",
    password : ""
  });
  const [newRegistered, setNewRegistered] = useState(false);
  const [loggedInStatus, setLoggedInStatus] = useState(false);
  const contractAddress = CONTRACTADDRESS

  const handleNameChange = (e) => {
    setFullName({
      ...fullName,
      name: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setFullName({
      ...fullName,
      password: e.target.value,
    });
  };



  const registerUser = async (e) => {
    e.preventDefault();
    if((registered == false && loggedInStatus == false)){
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
          console.log(fullName.name);
          let name = fullName.name;
          let hashedPassword = CryptoJS.SHA256(fullName.password).toString();
          const add  = await signer.getAddress();
        
          
          
          //changed hardcoded address to signer address
          const tx = await contract.createUser([1,fullName.name,add], hashedPassword, {gasLimit:800000});
          await tx.wait();
          localStorage.setItem(add, hashedPassword);
          console.log("Successfully new User registered");
          setNewRegistered(true);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const SignInUser = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const add  = await signer.getAddress();
        const contract = new ethers.Contract(
          contractAddress,
          Authentication.abi,
          signer
        );

        console.log(fullName);
        let myPass = CryptoJS.SHA256(fullName.password).toString();
        const loggedStatus = await contract.getLoggedInStatus(add, myPass);   
        console.log(loggedStatus);   
        if(loggedStatus == true){
          localStorage.setItem(add, myPass)
          setLoggedInStatus(loggedStatus);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

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
          
        //await contract.init(contractAddress)    //This step you have to do  one time
          
        //changed hardcoded address to signer address
        const add  = await signer.getAddress();
        const authStatus = await contract.getAuthStatus(add);
        setRegistered(authStatus);
        console.log('Register Status - ',authStatus);

        const myPass = localStorage.getItem(add);
        if(myPass == null) throw 'SignUp/SignIn to proceed'
        const loggedStatus = await contract.getLoggedInStatus(add, myPass);
        setLoggedInStatus(loggedStatus)
        console.log("Auth Status - ",loggedStatus);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    isRegistered();
  }, [newRegistered]);

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
              {
                ((loggedInStatus == false && registered == false)) && 
                  <>
                    <label className="form-label">Name</label>
                    <input
                      className="form-control"
                      placeholder="Enter your full name"
                      onChange={handleNameChange}
                      value={fullName.name}
                      type="text"
                      />
                  </>
               }
              <br />

              <label className="form-label">Wallet address</label>
              <input
                className="form-control"
                type="text"
                value={window?.ethereum?.selectedAddress}
                disabled
                // value={initialized ? account : "Loading..."}
              />
              <br />

              <label className="form-label">Password</label>
              <input
                className="form-control"
                placeholder="Enter your password"
                onChange={handlePasswordChange}
                value={fullName.password}
                type="text"
              />

              <br />
              {
                (registered==true && loggedInStatus == true)
                ?
                <Navigate to='/dashboard' />
                :
                <div>
                  {
                    (registered == true && loggedInStatus == false) && 
                      <button onClick={SignInUser} className="authButtons">
                        SIGN IN
                      </button>
                  }

                  {
                    (registered == false && loggedInStatus == false) &&
                      <button onClick={registerUser} className="authButtons">
                        SIGN UP
                      </button>
                  }
                </div>
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
