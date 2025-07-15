import React, { createContext, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const currentUser = {
    name: "Tommy",
    role: "Recruiter",
  };

  return (
    <UserContext.Provider value={currentUser}>{children}</UserContext.Provider>
  );
};

export const useCurrentUser = () => useContext(UserContext);
