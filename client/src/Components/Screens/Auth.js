import React from "react";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import "../styles/Auth.scss";

function Auth() {
  const [authMode, setAuthMode] = useState("signup");

  const [fullName, setFullName] = useState({
	name: null
  });

const handleNameChange = (e) => {
	setFullName({
		...fullName,
		name: e.target.value
	})
  }

  const registerUser = async (e) => {
	e.preventDefault();
	
	window.toastProvider.addMessage("Processing your registration request.", {
	  variant: "processing",
	  colorTheme: "light"
	});

	try{
	  // await MainContract.createUser(fullName.name).send({from: account});

	window.toastProvider.addMessage("Success", {
		secondaryMessage: "Welcome to Agora Blockchain.",
		variant: "success",
	});
	} catch {
	window.toastProvider.addMessage("Failed", {
		secondaryMessage: "Please try again. Transaction failed.",
		variant: "failure",
		colorTheme: "light"
	});
	}
  }

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
				// isRegistered && isRegistered[0] != 0
				// ?
				// <Navigate to='/dashboard' />
				// :
								<Navigate to='/dashboard' />

				// <button onClick={registerUser} className="authButtons">SIGN UP</button>
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