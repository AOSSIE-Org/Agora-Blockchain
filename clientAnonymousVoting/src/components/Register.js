import { useDispatch } from 'react-redux'
import { setHasRegistered } from '../store/home.slice';
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import { Identity } from "@semaphore-protocol/identity"
import { ethers } from 'ethers';
import { addVoter, getUserAuthStatus } from '../web3/contracts';
import "./styles/Auth.scss";
import { redirect } from "react-router-dom";


import styles from './Register.module.css';
import votingImage from '../assets/voting.svg';
import { useWeb3Modal } from '@web3modal/ethers5/react';

const Register = () => {
    const dispatch = useDispatch()
    const [identityCommitment, setIdentityCommitment] = useState(null);
    const [connectWallet, setConnectWallet] = useState('');
    const [pending, setPending] = useState(false);
    const [registered, setRegistered] = useState(false);
    const { open } = useWeb3Modal()
    

    const handleRegisterClick = async () => {
        open()
        return
        const { ethereum } = window;
        if (!ethereum) {
            setConnectWallet("Please install a web3 wallet first.");
            return;
        }
        const provider = new ethers.providers.Web3Provider(ethereum);

        provider.send("eth_requestAccounts", []).then(async () => {
            const signer = provider.getSigner();
            const address = await signer.getAddress();

            const message = `I am signing this message to confirm my identity: ${address}`;
            
            if (address) {
                const signature = await signer.signMessage(message);
                const identity = new Identity(signature);
                const authStatus = await getUserAuthStatus(identity.commitment);
                setIdentityCommitment(identity.commitment);
                console.log("Commitment: ", identityCommitment);
                try {
                    if(authStatus){
                        return;
                    }
                    setPending(true);
                    const receipt=await addVoter(identity.commitment,true);
                    setPending(false);
                    console.log(receipt);
                    if (receipt.status === 1) {
                        setRegistered(true);
                        dispatch(setHasRegistered(true));
                    }
                } catch (e) {
                    setPending(false);
                }
            }

        })
    }


    const isRegistered = async () => {
        try {
            if (identityCommitment != null) {
                const status = await getUserAuthStatus(identityCommitment);
                setRegistered(status);
                return redirect('/dashboard')
            }else{
                setRegistered(false);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        isRegistered();
    }, [identityCommitment]);

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
                        <div style={{ margin: "10px" }}>
                            <br />
                            <label className="form-label">Wallet address</label>
                            <input
                                className="form-control"
                                type="text"
                                value={window?.ethereum?.selectedAddress}
                                disabled
                            />
                            <br />
                            <div >
                                {
                                    registered === true
                                        ?
                                        <Navigate to='/dashboard' />
                                        :
                                        <button onClick={handleRegisterClick} className="authButtons">
                                            Register
                                        </button>
                                }
                                <h2 style={{ color: "red", marginTop: "1em" }}>{connectWallet}</h2>
                            </div>
                            {
                                pending && (
                                    <div
                                        style={{ marginTop: "2em", marginBottom: "2em" }}
                                    >
                                        <Spinner animation="border" />
                                    </div>
                                )
                            }
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
            {/* <div style={{ margin: "0 auto", justifyContent: "center", textAlign: "center" }}>
                <div className={styles.subtitle}>
                    decentralized anonymous voting app
                </div>
                <div>
                </div>

                <div style={{ marginBottom: "2em" }}>
                    <h2 style={{ fontStyle: "italic", color: "gray", marginBottom: "0.5em" }}>Start Voting</h2>
                    <button onClick={handleRegisterClick} className="baseButton">Register</button>
                    <h2 style={{ color: "red", marginTop: "1em" }}>{connectWallet}</h2>
                </div>
                {pending && <div style={{ marginTop: "2em", marginBottom: "2em" }}>
                    <Spinner animation="border" />
                </div>}
            </div> */}
        </div>
    );
}

export default Register