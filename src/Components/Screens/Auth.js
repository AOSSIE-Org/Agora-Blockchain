import { useState } from "react";
import "../styles/Auth.scss";

function Auth() {
  const [authMode, setAuthMode] = useState("signup");

  const GetAuthMode = () => {
    return authMode === "signup" ? (
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
            placeholder="Choose a strong password"
          />
          <br />

          <label className="form-label">Confirm Password</label>
          <input 
            className="form-control" 
            placeholder="Retype your password" 
          />
          <br />

          <div className="authButtons">SIGN UP</div>
        </form>
        <br />
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

          <div className="authButtons">SIGN IN</div>
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