import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SideCartContextType {
  isSideCartOpen: boolean;
  openSideCart: () => void;
  closeSideCart: () => void;
  toggleSideCart: () => void;
}

const SideCartContext = createContext<SideCartContextType | undefined>(
  undefined,
);

export const SideCartProvider = ({ children }: { children: ReactNode }) => {
  const [isSideCartOpen, setIsSideCartOpen] = useState(false);

  const openSideCart = () => setIsSideCartOpen(true);
  const closeSideCart = () => setIsSideCartOpen(false);
  const toggleSideCart = () => setIsSideCartOpen((prev) => !prev);

  return (
    <SideCartContext.Provider
      value={{
        isSideCartOpen,
        openSideCart,
        closeSideCart,
        toggleSideCart,
      }}
    >
      {children}
    </SideCartContext.Provider>
  );
};

export const useSideCart = () => {
  const context = useContext(SideCartContext);
  if (!context) {
    throw new Error('useSideCart must be used within a SideCartProvider');
  }
  return context;
};
