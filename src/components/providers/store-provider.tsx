'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@/stores/user-store';
import { useUIStore } from '@/stores/ui-store';
import { ToastProvider } from '@/components/ui/toast-provider';

interface StoreProviderProps {
  children: React.ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  const { data: session, status } = useSession();
  const { setCurrentUser, setAuthenticated, clearUserData } = useUserStore();
  const { addToast } = useUIStore();

  // Sync session with user store
  useEffect(() => {
    if (status === 'loading') return;

    try {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          username: session.user.username || '',
          name: session.user.name,
          email: session.user.email || '',
          image: session.user.image,
          bio: null,
          role: session.user.role || 'USER',
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        setAuthenticated(true);
      } else {
        clearUserData();
      }
    } catch (error) {
      console.error('Error syncing session with user store:', error);
      // Fallback: clear user data on error
      clearUserData();
    }
  }, [session, status, setCurrentUser, setAuthenticated, clearUserData]);

  // Show authentication status changes (only on initial sign in, not on every load)
  useEffect(() => {
    if (status === 'loading') return;

    // Only show welcome toast if user just signed in (not on page refresh)
    if (session?.user && status === 'authenticated' && !sessionStorage.getItem('welcome-shown')) {
      addToast({
        type: 'success',
        title: 'Welcome back!',
        description: `Signed in as ${session.user.name || session.user.email}`,
      });
      sessionStorage.setItem('welcome-shown', 'true');
    }
    
    // Clear welcome flag when user signs out
    if (!session && status === 'unauthenticated') {
      sessionStorage.removeItem('welcome-shown');
    }
  }, [session, status, addToast]);

  return (
    <>
      {children}
      <ToastProvider />
    </>
  );
}
export default StoreProvider