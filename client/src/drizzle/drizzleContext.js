import React, { createContext, useContext, useState } from "react";
import Web3 from 'web3';
import UserContract from '../blockchainBuild/User.json';

const Context = createContext();

export function DrizzleProvider({ drizzle, children }) {
    const [drizzleVariables, setDrizzleVariables] = useState({
        initialized: false,
        state: null,
        web3: null,
        accounts: null,
        MainContract: null,
        UserContract: null,
        ElectionContracts: [null],
        subscriber: null,
        UserSubscriber: null,
        ElectionSubscriber: null
    })
    const unsubscribe = drizzle?.store?.subscribe(() => {
        const drizzleState = drizzle?.store?.getState();
        if (drizzleState?.drizzleStatus?.initialized) {
            const { web3, accounts } = drizzleState;
            const MainContract =  drizzle?.contracts?.MainContract?.methods;
            const subscriber = drizzleState?.contracts?.MainContract;
            setDrizzleVariables({
                ...drizzleVariables,
                state: drizzleState,
                web3,
                accounts,
                MainContract,
                subscriber,
                initialized: true
            });
        }
    });

    const addNewContract = async (contractName, newAddress) => {
        let web3 = new Web3("HTTP://127.0.0.1:7545")
        let web3Contract = new web3.eth.Contract(UserContract.abi, newAddress);
        await drizzle.addContract({ contractName, web3Contract });
        
        const drizzleState = drizzle?.store?.getState();
        if (drizzleState?.drizzleStatus?.initialized) {
            const UserContract =  drizzle?.contracts[contractName]?.methods;
            const UserSubscriber = drizzleState?.contracts[contractName];
            setDrizzleVariables({
                ...drizzleVariables,
                state: drizzleState,
                UserContract,
                UserSubscriber
            });
        }
    }

    drizzleVariables?.initialized && unsubscribe()
    
    return <Context.Provider value={{drizzle, drizzleVariables, addNewContract}}>{children}</Context.Provider>;
}

export function useDrizzleContext() {
  const context = useContext(Context);
  return context;
}