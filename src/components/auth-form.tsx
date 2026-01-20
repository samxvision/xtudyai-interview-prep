
'use client';

import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/components/google-icon';
import { useFirebase } from '@/firebase/provider';
import { GoogleAuthProvider, signInWithPopup, signInAnonymously, getAdditionalUserInfo } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Loader2, User } from 'lucide-react';
import React from 'react';
import { useAuthContext } from '@/context/AuthContext';

interface AuthFormProps {
    onAuthSuccess?: () => void;
}

export function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const { auth } = useFirebase();
  const router = useRouter();
  const { redirectUrl, openUpdateProfileDialog } = useAuthContext();
  const { toast } = useToast();
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
  const [isGuestLoading, setIsGuestLoading] = React.useState(false);

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const additionalInfo = getAdditionalUserInfo(result);
      
      onAuthSuccess?.(); // Close the auth dialog

      if (additionalInfo?.isNewUser || !result.user.displayName) {
        toast({
          title: 'Welcome!',
          description: "One last step - please enter your name.",
        });
        openUpdateProfileDialog();
      } else {
        toast({
          title: 'Signed In',
          description: `Welcome back, ${result.user.displayName}!`,
        });
        router.push(redirectUrl);
      }
    } catch (error: any) {
      toast({
        title: 'Authentication Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
        setIsGoogleLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setIsGuestLoading(true);
    try {
      await signInAnonymously(auth);
      toast({
        title: 'Signed In',
        description: "You are now browsing as a guest.",
      });
      onAuthSuccess?.();
      router.push(redirectUrl);
    } catch (error: any) {
      toast({
        title: 'Guest Sign-In Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
        setIsGuestLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        className="w-full h-12 text-base"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading || isGuestLoading}
      >
        {isGoogleLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
            <GoogleIcon />
        )}
        Continue with Google
      </Button>
      <Button
        variant="secondary"
        className="w-full h-12 text-base"
        onClick={handleGuestSignIn}
        disabled={isGoogleLoading || isGuestLoading}
      >
        {isGuestLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <User className="mr-2 h-5 w-5" />}
        Continue as Guest
      </Button>
    </div>
  );
}
