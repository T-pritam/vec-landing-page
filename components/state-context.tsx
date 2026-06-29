"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type AppState = "vic" | "nsw";

interface StateContextValue {
  state: AppState;
  setState: (s: AppState) => void;
}

const StateContext = createContext<StateContextValue>({
  state: "vic",
  setState: () => {},
});

export function StateProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<AppState>("vic");

  useEffect(() => {
    const saved = localStorage.getItem("aem-state") as AppState | null;
    if (saved === "nsw" || saved === "vic") setStateRaw(saved);
  }, []);

  function setState(s: AppState) {
    setStateRaw(s);
    localStorage.setItem("aem-state", s);
  }

  return (
    <StateContext.Provider value={{ state, setState }}>
      {children}
    </StateContext.Provider>
  );
}

export function useAppState() {
  return useContext(StateContext);
}
