import { create } from 'zustand';
import { User } from '@/types';
import { auth, db } from '@/lib/firebase/client';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isWaitlisted: boolean;
  setUser: (user: User | null) => void;
  initAuthListener: () => () => void;
  logout: () => Promise<void>;
  checkWaitlistStatus: (email: string) => Promise<void>;
  setWaitlisted: (value: boolean) => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  updatePhotoURL: (url: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  currentUser: null,
  isLoading: true,
  isAuthenticated: false,
  isWaitlisted: false,

  setUser: user => set({ currentUser: user, isAuthenticated: !!user, isLoading: false }),
  setWaitlisted: value => set({ isWaitlisted: value }),

  checkWaitlistStatus: async (email: string) => {
    try {
      const q = query(collection(db, 'waitlist'), where('email', '==', email));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        set({ isWaitlisted: true });
      }
    } catch (error) {
      console.error('Failed to check waitlist status:', error);
    }
  },

  initAuthListener: () => {
    set({ isLoading: true });
    return onAuthStateChanged(auth, async firebaseUser => {
      if (firebaseUser) {
        const user: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          theme: 'system',
          createdAt: Date.now(),
          subscriptionTier: 'early-access',
          provider: firebaseUser.providerData[0]?.providerId,
          photoURL: firebaseUser.photoURL || undefined,
        };

        set({ currentUser: user, isAuthenticated: true, isLoading: false });

        if (user.email) {
          await get().checkWaitlistStatus(user.email);
        }
      } else {
        set({ currentUser: null, isAuthenticated: false, isLoading: false, isWaitlisted: false });
      }
    });
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await auth.signOut();
      set({ currentUser: null, isAuthenticated: false, isLoading: false, isWaitlisted: false });
      console.log('Logout successful, state cleared');
    } catch (error) {
      console.error('Logout failed', error);
      set({ isLoading: false });
    }
  },

  loginWithGoogle: async () => {
    set({ isLoading: true });
    try {
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  },

  loginWithEmail: async (email, password) => {
    set({ isLoading: true });
    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Email login failed', error);
      set({ isLoading: false });
      throw error;
    }
  },

  signUpWithEmail: async (email, password) => {
    set({ isLoading: true });
    try {
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Email signup failed', error);
      set({ isLoading: false });
      throw error;
    }
  },

  updateDisplayName: async (name: string) => {
    set({ isLoading: true });
    try {
      const { updateProfile } = await import('firebase/auth');
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
        set(state => ({
          currentUser: state.currentUser ? { ...state.currentUser, displayName: name } : null,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error('Update profile failed', error);
      set({ isLoading: false });
      throw error;
    }
  },

  updatePhotoURL: async (url: string) => {
    set({ isLoading: true });
    try {
      const { updateProfile } = await import('firebase/auth');
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: url });
        set(state => ({
          currentUser: state.currentUser ? { ...state.currentUser, photoURL: url } : null,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error('Update photoURL failed', error);
      set({ isLoading: false });
      throw error;
    }
  },
}));
