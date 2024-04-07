import React, { createContext, useContext } from "react";

const FirebaseContext = createContext(null);

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children, db }) => (
  <FirebaseContext.Provider value={db}>{children}</FirebaseContext.Provider>
);
