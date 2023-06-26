import { useDispatch } from 'react-redux'
import { setHasRegistered } from '../store/home.slice';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';

import {ethers} from 'ethers';
import { initLocalStorage, generateIdentityCommitment } from '../web3/semaphore';
import { getOneVoteContract } from '../web3/contracts';
import "./styles/Auth.scss";

import styles from './Register.module.css';

import votingImage from '../assets/voting.svg';

const Register = () => {
    const dispatch = useDispatch()
    const [identityCommitment, setIdentityCommitment] = useState(null);
    const [connectWallet, setConnectWallet] = useState('');
    const [pending, setPending] = useState(false);

    const handleRegisterClick = async () => {
        const {ethereum} = window;
        if(!ethereum){
            console.log("Install metamask");
            return;
        }
        const accounts = await ethereum.request({method: 'eth_accounts'});
        if (accounts.length == 0) {
            setConnectWallet('You need to connect wallet');
        }

        const oneVote = await getOneVoteContract();
        console.log("Commitment: ", identityCommitment);
        try{
            setPending(true);
            console.log('big no',ethers.BigNumber.from(identityCommitment))
            const tx = await oneVote.insertIdentityAsClient(ethers.BigNumber.from(identityCommitment))
            const receipt = await tx.wait();
            setPending(false);
            console.log(receipt);
    
            if (receipt.status === 1) {
                dispatch(setHasRegistered(true));
            }
        }catch(e){
            setPending(false);
        }
    }


    useEffect(() => {
        initLocalStorage();
        setIdentityCommitment(generateIdentityCommitment());
        console.log("Identity commitment: ", identityCommitment);
    }, []);
    
    return ( 
        <div className='authDiv'>

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
            <div  style={{ margin: "10px" }}>

             
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
              <div >
                    <button onClick={handleRegisterClick} className="authButtons">Register</button>
                    <h2 style={{color: "red", marginTop: "1em"}}>{connectWallet}</h2>
                </div>
                {pending && <div style={{marginTop: "2em", marginBottom: "2em"}}>
                    <Spinner animation="border" />
                </div>}
            
            </div>

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

 
        </div>
      </div>
            {/* <div style={{margin: "0 auto", justifyContent: "center", textAlign:"center"}}>
             
                <div className={styles.subtitle}>
                    decentralized anonymous voting app
                </div>
                <div>
                </div>

                <div style={{marginBottom: "2em"}}>
                    <h2 style={{fontStyle:"italic", color: "gray", marginBottom: "0.5em"}}>Start Voting</h2>
                    <button onClick={handleRegisterClick} className="baseButton">Register</button>
                    <h2 style={{color: "red", marginTop: "1em"}}>{connectWallet}</h2>
                </div>
                {pending && <div style={{marginTop: "2em", marginBottom: "2em"}}>
                    <Spinner animation="border" />
                </div>}
            </div> */}
        </div>
    );
}
 
export default Register