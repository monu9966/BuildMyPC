import { createContext, useContext, useEffect, useState } from "react";

const BuildContext = createContext();

export function BuildProvider({ children }) {
  const [selectedParts, setSelectedParts] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem("build");
    if (saved) setSelectedParts(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("build", JSON.stringify(selectedParts));
  }, [selectedParts]);

  return (
    <BuildContext.Provider value={{ selectedParts, setSelectedParts }}>
      {children}
    </BuildContext.Provider>
  );
}

export function useBuild() {
  return useContext(BuildContext);
}
