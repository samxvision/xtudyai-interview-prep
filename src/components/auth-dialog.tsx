'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { AuthForm } from '@/components/auth-form';
import { useAuthContext } from '@/context/AuthContext';
import { Logo } from './logo';

export function AuthDialog() {
  const { isAuthDialogOpen, closeAuthDialog } = useAuthContext();

  return (
    <Dialog open={isAuthDialogOpen} onOpenChange={closeAuthDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="items-center text-center">
          <Logo />
          <DialogTitle className="text-2xl pt-4">Access Your Account</DialogTitle>
          <DialogDescription>
            Sign in or continue as a guest to access all features.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <AuthForm onAuthSuccess={closeAuthDialog} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
