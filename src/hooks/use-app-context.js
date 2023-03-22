import { useContext } from "react";
import AppContext from "../context/AppContext";

function useAppContext() {
  return useContext(AppContext);
}

export default useAppContext;
