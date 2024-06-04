import Button from 'react-bootstrap/Button';
import { useEffect } from 'react';
import { useState } from 'react';
import { ethers } from 'ethers';

import { useDispatch, useSelector } from 'react-redux'
import { selectNetwork, selectCorrectNetwork, setNetwork, setCorrectNetwork } from '../store/home.slice';

import Modal from 'react-bootstrap/Modal';


const ConnectWallet = () => {
    const dispatch = useDispatch();
    const correctNetwork = useSelector(selectCorrectNetwork);
    const networkId = useSelector(selectNetwork);

    const [currentAccount, setCurrentAccount] = useState(null);

    const [networkChangeStatus, setNetworkChangeStatus] = useState('');

    // const [correctNetwork2, setCorrectNetwork2] = useState(true);

    const checkWalletIsConnected = async () => {
        const {ethereum} = window;

        if (!ethereum) {
            console.log("Install metamask");
            return;
        } else {
            console.log("All good to go!");
        }

        const accounts = await ethereum.request({method: 'eth_accounts'});
        if (accounts.length !== 0) {
            setCurrentAccount(accounts[0]);
        } else {
            console.log("No account connected!");
        }
    }

    const connectWalletHandler = async () => {
        const { ethereum } = window;

        if (!ethereum) {
            alert("Install metamask!");
        }

        try {
            const accounts = await ethereum.request({method: 'eth_requestAccounts'});
            console.log("account[0]: ", accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (err) {
            console.log(err);
        }
    }

    const checkNetwork = async () => {
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(ethereum);
        const { chainId } = await provider.getNetwork();
        dispatch(setNetwork(chainId));
        console.log("Connected to chain with id: ", chainId);
        
    }

    const handleNetworkChange = async () => {
        if(window.ethereum){
            window.ethereum.on('chainChanged', () => {
                checkNetwork();
            })
            console.log("Handler on change set");
        }
    }

    useEffect(() => {
        checkWalletIsConnected();
    },[])

    const connectWalletButton = () => {
        return (
            <button className="baseButton" onClick={connectWalletHandler}>Connect Wallet</button>
        )
    }

    const showAccount = () => {
        const firstPart = currentAccount.substring(0,4);
        const lastPart = currentAccount.substring(currentAccount.length - 4);
        const string = firstPart + "..." + lastPart;
        return (
            <label onClick={() => navigator.clipboard.writeText(currentAccount)} style={{userSelect:"none", cursor:"pointer"}}>{string}</label>
        )
    }

   

  

    // onHide={handleClose}

    return (  
        <div className="connectWallet" style={{color: "grey"}}>
            {currentAccount ? showAccount() : connectWalletButton()}
            <div>
                <Modal show={!correctNetwork}>
                    <Modal.Header closeButton>
                        {/* <Modal.Title>Wrong network</Modal.Title> */}
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            Network id: {networkId}
                        </p>
                        <p>
                            We support Harmony testnet
                        </p>
                        {/* <button onClick={switchNetwork} className="baseButton">Switch network</button> */}
                        {/* <button onClick={addHarmonyToMetamask} className="inverseButton">Add harmony to metamask</button> */}
                        <p>{networkChangeStatus}</p>
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}
 
export default ConnectWallet;