import React, { createContext, useContext } from "react";
import { DrizzleContext } from "@drizzle/react-plugin";
import { useContractContext } from "./drizzleContracts";

import MainContractCall from "./MainContractCall";
import UserCall from "./UserCall";
import ElectionCall from "./ElectionCall";

const Context = createContext();

export function CallProvider({ children }) {
  const { drizzle, drizzleState, initialized } = useContext(
    DrizzleContext.Context
  );
  const {
    pushNewContracts,
    contracts,
    addElectionContract,
  } = useContractContext();

  const accounts = drizzleState?.accounts;
  const account = accounts ? accounts[0] : "0x0";
  let balance = drizzleState?.accountBalances;
  
  if(balance) {
    balance = ((Object.values(balance))[0] / 1e18).toFixed(2);
  }

  const drizzleVariables = {drizzle, drizzleState, contracts, account};

  const { MainContract, MainSubscriber, isRegistered } = MainContractCall({
    drizzleVariables,
    pushNewContracts,
  });

  const { UserContract, UserSubscriber, userInfo, eId } = UserCall({
    drizzleVariables
  });

  const {
    electionDetails,
    getCurrentElection,
    CurrentElection,
    currentElectionDetails,
  } = ElectionCall({
    drizzleVariables,
    UserContract,
    userInfo,
    eId,
    pushNewContracts,
    addElectionContract,
  });

  return (
    <Context.Provider
      value={{
        MainContract,
        MainSubscriber,
        UserContract,
        UserSubscriber,
        userInfo,
        electionDetails,
        getCurrentElection,
        CurrentElection,
        currentElectionDetails,
        initialized,
        isRegistered,
        account,
        balance
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useCallContext() {
  const context = useContext(Context);
  return context;
}
