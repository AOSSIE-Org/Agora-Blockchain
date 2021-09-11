import React, { createContext, useReducer } from "react";
import ElectionReducer from "../Reducers/ElectionReducer";

export const ElectionContext = createContext();

const ElectionContextProvider = (props) => {
  const [user, dispatchElection] = useReducer(ElectionReducer, []);

  return (
    <ElectionContext.Provider values={(user, dispatchElection)}>
      {props.children}
    </ElectionContext.Provider>
  );
};

export default ElectionContextProvider;
