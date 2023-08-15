import React, { createContext, useContext, useState } from 'react';

const RetractContext = createContext();

export function RetractProvider({ children }) {
  const [retract, setRetract] = useState(localStorage.getItem('retract') || 'show');

  return (
    <RetractContext.Provider value={{ retract, setRetract }}>
      {children}
    </RetractContext.Provider>
  );
}

export function useRetract() {
  return useContext(RetractContext);
}