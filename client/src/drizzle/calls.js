import React, { createContext, useContext, useState, useEffect } from "react";
import { DrizzleContext } from '@drizzle/react-plugin';
import { useContractContext } from './drizzleContracts';
import { USER_CONTRACT, ELECTION_CONTRACT, CURRENT_ELECTION } from './constants';

const Context = createContext();

export function CallProvider({ children }) {
    const { drizzle, drizzleState, initialized } = useContext(DrizzleContext.Context);
    const { pushNewContracts, contracts, addElectionContract } = useContractContext();

    const accounts = drizzleState?.accounts;
    const account = accounts ? accounts[0] : "0x0";

    // MainContract instance
    const MainContract = drizzle.contracts['MainContract']?.methods;
    const MainSubscriber = drizzleState?.contracts['MainContract'];
    
    // UserContract instance
    const UserContract = drizzle?.contracts[contracts[0]?.contractName]?.methods;
    const UserSubscriber = drizzleState?.contracts[contracts[0]?.contractName];

    // List of ElectionContract instances
    const ElectionContracts = Object.keys(drizzle?.contracts)?.filter(contract => 
        (contract.split('.'))[0] === ELECTION_CONTRACT
    ).reduce((obj, key, index) => {
        obj[key] = drizzle?.contracts[key]?.methods;
        obj[key].contractAddress = drizzle?.contracts[key]?.address;
        return obj;
    }, {});
    const ElectionSubscribers = drizzleState ? Object.keys(drizzleState?.contracts)?.filter(subscriber => 
        (subscriber.split('.'))[0] === ELECTION_CONTRACT
    ).reduce((obj, key) => {
        obj[key] = drizzleState?.contracts[key];
        return obj;
    }, {}) : {};

    // Current election contract instance
    const CurrentElection = drizzle?.contracts[CURRENT_ELECTION]?.methods;
    const CurrentElectionSubscriber = drizzleState?.contracts[CURRENT_ELECTION];

    // Cache keys
    const [isRegisteredKey, setIsRegisteredKey] = useState(null);
    const [userInfoKey, setUserInfoKey] = useState(null);
    const [eIdKey, setEIdKey] = useState(null);
    const [electionDetailKeys, setElectionDetailKeys] = useState([]);
    const [currentElectionKey, setCurrentElectionKey] = useState(null);

    // Cached values
    const [eId, setEId] = useState(0);
    const [electionDetails, setElectionDetails] = useState([]);
    const [isRegistered, setIsRegistered] = useState([false, -1]);
    const [currentElectionDetails, setCurrentElectionDetails] = useState(null);
    let [userInfo, setUserInfo] = useState({
        id: null,
        name: null,
        publicAddress: null,
        contractAddress: []
    });

    // Adding User contracts
    if(isRegistered && isRegistered[0] != 0) {
        MainContract?.Users(isRegistered[1])?.call().then((user) => {
            pushNewContracts(user.contractAddress, user.contractAddress, USER_CONTRACT)
        })
    }

    // Setting up main contract key and value
    useEffect(() => {
        setIsRegisteredKey(MainContract?.isRegistered?.cacheCall(account));
        setIsRegistered(MainSubscriber?.isRegistered[isRegisteredKey]?.value);
    }, [MainSubscriber])

    // Setting up user cache key and value
    useEffect(() => {
        setUserInfoKey(UserContract?.info?.cacheCall({from: account}));
        setEIdKey(UserContract?.electionId?.cacheCall({from: account}));

        const info = UserSubscriber?.info[userInfoKey]?.value;
        const _userInfo = {
            id: info?.userId,
            name: info?.name,
            publicAddress: info?.publicAddress,
            contractAddress: contracts[0]?.contractAddress
        }
        setUserInfo(_userInfo);
        setEId(UserSubscriber?.electionId[eIdKey]?.value);
    }, [UserSubscriber])

    // Setting up election contract key and value
    useEffect(() => {
        let newKeys = [];
        for(let i = 0; i < eId; i++) {
            newKeys[i] = ElectionContracts[`${ELECTION_CONTRACT}.${userInfo.id}.${i}`]?.getElectionDetails?.cacheCall({from: account});
            setElectionDetailKeys(newKeys);
        }

        let newInfos = [];
        for(let i = 0; i < eId; i++) {
            newInfos[i] = ElectionSubscribers[`${ELECTION_CONTRACT}.${userInfo.id}.${i}`]?.getElectionDetails[electionDetailKeys[i]]?.value;
            if(newInfos[i]) {
                newInfos[i] = {...newInfos[i], contractAddress: ElectionContracts[`${ELECTION_CONTRACT}.${userInfo.id}.${i}`]?.contractAddress};
            }
            setElectionDetails(newInfos);
        }
    }, [JSON.stringify(ElectionSubscribers)])

    // Setting up current election contract cache key and value
    useEffect(() => {
        setCurrentElectionKey(CurrentElection?.getElectionDetails?.cacheCall({from: account}));
        setCurrentElectionDetails(CurrentElectionSubscriber?.getElectionDetails[currentElectionKey]?.value);
    }, [CurrentElectionSubscriber])

    // Function to push election contracts to contract array
    const pushElectionContracts = async () => {
        let electionAddresses;
        let promises = [];
        for(let i = 0; i < eId; i++) {
            promises.push(UserContract?.Elections(i)?.call());
        }
        electionAddresses = await Promise.all(promises);
        for(let i = 0; i < eId; i++) {
            pushNewContracts(`${ELECTION_CONTRACT}.${userInfo.id}.${i}`, electionAddresses[i], ELECTION_CONTRACT);
        }
    }

    // Calling the pushElectionConracts() function whenever there is new election
    useEffect(() => {
        if(!isNaN(eId)) {
            pushElectionContracts();
        }
    }, [eId])

    const getCurrentElection = (contractAddress) => {
        addElectionContract(CURRENT_ELECTION, contractAddress);
    }

    return <Context.Provider 
        value = {
            {
                MainContract, 
                UserContract, 
                UserSubscriber, 
                userInfo, 
                electionDetails, 
                getCurrentElection, 
                CurrentElection,
                currentElectionDetails, 
                initialized, 
                isRegistered, 
                account
            }
        }
    >
        {children}
    </Context.Provider>;
}

export function useCallContext() {
    const context = useContext(Context);
    return context;
}