'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface AuthContextType {
  isAuthDialogOpen: boolean;
  openAuthDialog: (redirectUrl?: string) => void;
  closeAuthDialog: () => void;
  isUpdateProfileDialogOpen: boolean;
  openUpdateProfileDialog: () => void;
  closeUpdateProfileDialog: () => void;
  redirectUrl: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isUpdateProfileDialogOpen, setIsUpdateProfileDialogOpen] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('/');

  const openAuthDialog = useCallback((url: string = '/') => {
    setRedirectUrl(url);
    setIsAuthDialogOpen(true);
  }, []);

  const closeAuthDialog = useCallback(() => {
    setIsAuthDialogOpen(false);
  }, []);

  const openUpdateProfileDialog = useCallback(() => {
    setIsUpdateProfileDialogOpen(true);
  }, []);

  const closeUpdateProfileDialog = useCallback(() => {
    setIsUpdateProfileDialogOpen(false);
  }, []);

  const value = {
    isAuthDialogOpen,
    openAuthDialog,
    closeAuthDialog,
    isUpdateProfileDialogOpen,
    openUpdateProfileDialog,
    closeUpdateProfileDialog,
    redirectUrl,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
