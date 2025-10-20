import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const ContextApp = createContext();

export const ContextProvider = ({ children }) => {
    const [bikeOn, setBikeOn] = useState(true);

    return (
        <ContextApp.Provider value={{bikeOn, setBikeOn}}>
            {children}
            </ContextApp.Provider>
    )
 }