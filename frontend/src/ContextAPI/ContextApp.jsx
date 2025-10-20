/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

export const ContextApp = createContext();

export const ContextProvider = ({ children }) => {
  const [bikeOn, setBikeOn] = useState(true);

  return (
    <ContextApp.Provider value={{ bikeOn, setBikeOn }}>
      {children}
    </ContextApp.Provider>
  );
};
