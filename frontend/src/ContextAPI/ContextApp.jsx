/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";

export const ContextApp = createContext();

export const ContextProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check localStorage on mount to restore login state
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <ContextApp.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </ContextApp.Provider>
  );
};
