import React, { createContext, useContext, useState, useEffect } from "react";
import { DrizzleContext } from '@drizzle/react-plugin';
import { USER_CONTRACT, ELECTION_CONTRACT } from './constants';
import UserContract from '../blockchainBuild/User.json';
import ElectionContract from '../blockchainBuild/Election.json';

const Context = createContext();

export function ContractProvider({ children }) {
    const { drizzle } = useContext(DrizzleContext.Context);

    const [contracts, setContracts] = useState([]);
    const [currentElection, setCurrentElection] = useState(null)

    const isAvailable = (oldContracts, contractName, contractAddress) => {
        let available = false
        oldContracts.forEach((contract) => {
            if(contract.contractName == contractName || contractAddress == contract.newAddress) {
                available = true;
            }
        });
        return available;
    }

    const pushNewContracts = (contractName, contractAddress, contractType) => {
        let newContract = {
            contractName,
            contractAddress,
            contractType
        };
        setContracts(oldContracts => (
            !isAvailable(oldContracts, contractName, contractAddress)
            ?
            [...oldContracts, newContract]
            :
            oldContracts
        ));
    }

    const addElectionContract = (contractName, contractAddress) => {
        if(currentElection?.contractAddress != contractAddress) {
            let newContract = {
                contractName,
                contractAddress,
            };
            setCurrentElection(newContract);
        }
    }

    useEffect(() => {
        if(currentElection != null && drizzle?.web3?.eth != undefined) {
            const {contractName, contractAddress} = currentElection;
            if(!checkContractExist({contractName, contractAddress})) {
                let web3Contract = new drizzle.web3.eth.Contract(ElectionContract.abi, contractAddress);
                drizzle.addContract({ contractName, web3Contract });
            }     
        }  
    }, [currentElection, drizzle?.web3?.eth])

    const checkContractExist = (contract) => {
        if(drizzle?.contracts[contract.contractName] != undefined) {
            return true;
        } else {
            return false;
        }
    }

    useEffect(() => {
        contracts.forEach(({contractName, contractAddress, contractType}) => {
            if(!checkContractExist({contractName, contractAddress})) {
                let web3Contract;
                switch (contractType) {
                    case USER_CONTRACT:
                        web3Contract = new drizzle.web3.eth.Contract(UserContract.abi, contractAddress);
                        break;
                    case ELECTION_CONTRACT:
                        web3Contract = new drizzle.web3.eth.Contract(ElectionContract.abi, contractAddress);
                        break;
                    default: console.log("Contract type not given");
                }
                drizzle.addContract({ contractName, web3Contract });
            }
        });
    }, [contracts.length])   
    
    return <Context.Provider value={{contracts, pushNewContracts, isAvailable, addElectionContract}}>{children}</Context.Provider>;
}

export function useContractContext() {
    const context = useContext(Context);
    return context;
}