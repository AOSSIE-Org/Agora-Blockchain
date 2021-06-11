import React, { createContext, useState } from "react";

export const UserContext = createContext();

const UserContextProvider = (props) => {
  const [user, setAuthUser] = useState({});

  return (
    <UserContext.Provider values={(user, setAuthUser)}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
