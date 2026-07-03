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
  /** null until the visitor has actively chosen a state (see StateGate). */
  state: AppState | null;
  setState: (s: AppState) => void;
  /** false until localStorage has been read on the client — avoids a gate flash. */
  hydrated: boolean;
}

const StateContext = createContext<StateContextValue>({
  state: null,
  setState: () => {},
  hydrated: false,
});

export function StateProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<AppState | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("aem-state") as AppState | null;
    if (saved === "nsw" || saved === "vic") setStateRaw(saved);
    setHydrated(true);
  }, []);

  function setState(s: AppState) {
    setStateRaw(s);
    localStorage.setItem("aem-state", s);
  }

  return (
    <StateContext.Provider value={{ state, setState, hydrated }}>
      {children}
    </StateContext.Provider>
  );
}

export function useAppState() {
  return useContext(StateContext);
}
