import React, { createContext, useContext, useState, useEffect } from "react";
import { useDrizzleContext } from "../../drizzle/drizzleContext";

const Context = createContext();

export function CacheCallsProvider({ drizzle, children }) {
  // Importing drizzle variables from drizzle context
  const { drizzleVariables } = useDrizzleContext();
  const {
    MainContract,
    subscriber,
    UserContract,
    UserSubscriber,
    accounts,
    initialized,
  } = drizzleVariables;

  // Setting up cache keys corresponding to cache calls
  const [cacheKeys, setCacheKey] = useState({
    isRegistered: null,
    user: null,
    info: null,
  });

  // Setting up cache calls for requried functions
  const cacheCalls = {
    isRegistered: subscriber?.isRegistered[cacheKeys?.isRegistered]?.value,
    user: subscriber?.Users[cacheKeys?.user]?.value,
    info: cacheKeys.info != null ? UserSubscriber?.info[cacheKeys?.info]?.value : null
  };

  // Initializing cache keys
  useEffect(() => {
    const _isRegistered = MainContract?.isRegistered?.cacheCall(accounts[0]);
    const _user = MainContract?.Users?.cacheCall(
      cacheCalls.isRegistered ? cacheCalls.isRegistered[1] : 0
    );
    let _info = UserContract?.info?.cacheCall();

    setCacheKey({
      ...cacheKeys,
      isRegistered: _isRegistered,
      user: _user,
      info: _info
    });
  }, [MainContract, UserContract, accounts, cacheCalls.isRegistered]);

  return (
    <Context.Provider value={{ cacheCalls, initialized }}>
      {children}
    </Context.Provider>
  );
}

export function useCacheCallsContext() {
  const context = useContext(Context);
  return context;
}
