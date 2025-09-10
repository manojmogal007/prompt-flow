import React, { createContext, useContext, useState } from "react";

// Define the type for the context
type DnDContextType = [
  any | null,
  React.Dispatch<React.SetStateAction<string | null>>
];

// Provide a default undefined so we can check it
const DnDContext = createContext<DnDContextType | undefined>(undefined);

export const DnDProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const state = useState<any>(null);

  return <DnDContext.Provider value={state}>{children}</DnDContext.Provider>;
};

export const useDnD = (): DnDContextType => {
  const context = useContext(DnDContext);
  if (!context) {
    throw new Error("useDnD must be used within a DnDProvider");
  }
  return context;
};
