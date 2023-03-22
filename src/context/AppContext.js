import { createContext, useState } from "react";

const AppContext = createContext();

function AppProvider({ children }) {
  const [connectedWallet, setConnectedWallet] = useState("0x");

  const updateConnectedWallet = (address) => {
    setConnectedWallet(address);
  };

  const valueToShare = { connectedWallet, updateConnectedWallet };

  return <AppContext.Provider value={valueToShare}>{children}</AppContext.Provider>;
}

export { AppProvider };
export default AppContext;
