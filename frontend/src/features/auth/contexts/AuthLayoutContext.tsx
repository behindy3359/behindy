"use client";

import React, { createContext, useContext } from 'react';

interface AuthLayoutContextValue {
  openWarningModal: () => void;
}

const AuthLayoutContext = createContext<AuthLayoutContextValue | undefined>(undefined);

export const AuthLayoutProvider: React.FC<{
  children: React.ReactNode;
  openWarningModal: () => void;
}> = ({ children, openWarningModal }) => {
  return (
    <AuthLayoutContext.Provider value={{ openWarningModal }}>
      {children}
    </AuthLayoutContext.Provider>
  );
};

export const useAuthLayout = () => {
  const context = useContext(AuthLayoutContext);
  if (!context) {
    throw new Error('useAuthLayout must be used within AuthLayoutProvider');
  }
  return context;
};
