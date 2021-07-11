import { useState } from "react";
import { Link, Redirect } from "react-router-dom";

import "../styles/Auth.scss";

import { useDrizzleContext } from '../../drizzle/drizzleContext';
import { useUserContext } from '../../ReducerComponents/Context/UserContext';

function Auth() {
  const [authMode, setAuthMode] = useState("signup");
  const { drizzleVariables } = useDrizzleContext();
  const { initialized, accounts, MainContract } = drizzleVariables;
  const { userInfo } = useUserContext();

  const [fullName, setFullName] = useState("");

  const handleNameChange = (e) => {
    setFullName(e.target.value)
  }

  const registerUser = async (e) => {
    e.preventDefault();
    MainContract.createUser(fullName).send({from: accounts[0]});
  }

  const GetAuthMode = () => {
    return authMode === "signup" ? (
      <>
        <form onSubmit={registerUser} style={{ margin: "10px" }}>
          <label className="form-label">Name</label>
          <input 
            className="form-control" 
            placeholder="Enter your full name"
            onChange={handleNameChange}
            type="text"
          />
          <br />

          <label className="form-label">Wallet address</label>
          <input
            className="form-control"
            type="text"
            disabled
            value={initialized ? accounts[0] : "Loading..."}
          />
          <br />
          {
            userInfo.isRegistered
            ?
            <Redirect to='/dashboard' />
            :
            <button onClick={registerUser} className="authButtons">SIGN UP</button>
          }
        </form>

        <br />

        <font
          className="text-muted centered signInOption"
          size="2"
          onClick={() => setAuthMode("signin")}
        >
          Already a member? Sign in
        </font>
        <br />
      </>
    ) : (
      <>
        <form style={{ margin: "10px" }}>
          <label className="form-label">Email</label>
          <input 
            className="form-control" 
            placeholder="email@example.com" 
          />
          <br />

          <label className="form-label">Password</label>
          <input 
            className="form-control" 
            placeholder="Enter password" 
          />
          <br />

          <font size="2" className="text-muted">
            Forgot password?
          </font>

          <Link to="/dashboard" className="authButtons authButtonRight">SIGN IN</Link>
        </form>
        <br />
        <br />

        <font
          className="text-muted centered signInOption"
          size="2"
          onClick={() => setAuthMode("signup")}
        >
          Not yet registered? Sign up
        </font>
        <br />
      </>
    );
  };

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

          <GetAuthMode />

          <font className="centered" size="2">
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
          <br />
        </div>
      </div>
    </div>
  );
}

export default Auth;