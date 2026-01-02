'use client';

import { useUserStore } from '@/store/user.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function LandingRedirect() {
  const { isAuthenticated, isLoading, initAuthListener } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = initAuthListener();
    return () => unsubscribe();
  }, [initAuthListener]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  return null;
}
