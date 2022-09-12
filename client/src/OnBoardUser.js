import React from "react";
import OnBoardModal from './OnBoardModal';
import { useState, useEffect } from 'react';

const OnboardUser = () => {
    const [step, setStep] = useState(-1);
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(0);

    function isEthereum() {
        if(window.ethereum) {
            return true
        }
        return false
    }

    function getChainID() {
        if(isEthereum()) {
            return parseInt(window.ethereum.chainId)
        }
        return 0
    }

    async function handleConnection(accounts) {
        if(accounts.length === 0) {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
            return accounts
        } else {
            return accounts
        }
    }

    async function requestAccount() {
        let account = 0x0;
        if(isEthereum() && getChainID() !== 0) {
            try {
                let accounts = await window.ethereum.request({ method: 'eth_accounts' })
                accounts = await handleConnection(accounts)
                account = accounts[0]
        
                window.ethereum.on('accountsChanged', async function () {
                    const accounts = await window.ethereum.enable()
                    account = accounts[0]
                })
            } catch {
                alert("Request denied!")
            }
        }
        return account;
    }

    async function requestBalance(account) {
        let balance = 0
        if(isEthereum()) {
            try {
                balance = await window.ethereum.request({
                    method: "eth_getBalance",
                    params: [account, 'latest']
                })

                balance = parseInt(balance) / 1e18
                
                return {balance, err: false}
            } catch(err) {
                alert("Error occured!")
            }
        }
        return {balance, err: true}
    }

    async function getStep() {
        if(!isEthereum()) {
            setStep(0)
            return
        } else {
            let account = await requestAccount()
            if(account === 0x0) {
                setStep(1)
                return
            }

            setAccount(account)

            if(getChainID() !== 43113) {
                setStep(2)
                return
            }

            let {balance, err} = await requestBalance(account)
            if(err) {
                return
            }
            setBalance(balance)

            if(balance < 1) {
                setStep(3)
                return
            }
        }

        setStep(-1)
    }

    useEffect(() => {
        getStep()
    }, [])

    return (
        <div>
            {/* <OnBoardModal step={step} account={account} balance={balance}/> */}
        </div>
    )
}

export default OnboardUser;