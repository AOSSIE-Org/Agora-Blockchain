import React, { createContext, useContext, useState, useEffect } from "react";
import { useDrizzleContext } from '../../drizzle/drizzleContext';
import { useCacheCallsContext } from './CacheCallsContext';

const Context = createContext();

export function UserProvider({ children }) {
  const { drizzle, addNewContract, drizzleVariables } = useDrizzleContext();
  const { cacheCalls } = useCacheCallsContext();

  const [userInfo, setUserInfo] = useState({
    userId: null,
    name: null,
    publicAddress: null,
    contractAddress: null,
    isRegistered: null
  })

  useEffect(() => {
    if(cacheCalls.isRegistered && cacheCalls.isRegistered[0] == 1) {
      userInfo.contractAddress != null && 
      drizzle.contracts[userInfo.contractAddress] === undefined && 
      addNewContract(userInfo.contractAddress, userInfo.contractAddress);
      
      setUserInfo({
        ...userInfo,
        userId: cacheCalls.isRegistered[1],
        isRegistered: true,
        // name: cacheCalls.fullName,
        publicAddress: cacheCalls?.user?.publicAddress,
        contractAddress: cacheCalls?.user?.contractAddress
      })
    } else {
      setUserInfo({
        ...userInfo,
        isRegistered: false
      })
    }
  }, [cacheCalls, drizzleVariables.UserContract]);

  return <Context.Provider value={{ userInfo }}>{children}</Context.Provider>;
}

export function useUserContext() {
  const context = useContext(Context);
  return context;
}