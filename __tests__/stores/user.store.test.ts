import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useUserStore } from '@/store/user.store';

let authStateCallback: ((user: unknown) => void) | null = null;

vi.mock('@/lib/firebase/client', () => ({
  auth: {
    currentUser: { uid: 'test-uid', displayName: 'Test User' },
    signOut: vi.fn().mockResolvedValue(undefined),
  },
  db: {},
}));

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn((_auth, callback) => {
    authStateCallback = callback;
    return () => {};
  }),
  GoogleAuthProvider: class {},
  signInWithPopup: vi.fn().mockResolvedValue({ user: { uid: 'test-uid' } }),
  signInWithEmailAndPassword: vi.fn().mockResolvedValue({ user: { uid: 'test-uid' } }),
  createUserWithEmailAndPassword: vi.fn().mockResolvedValue({ user: { uid: 'test-uid' } }),
  updateProfile: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn().mockResolvedValue({ empty: true }),
}));

describe('useUserStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    authStateCallback = null;
    useUserStore.setState({
      currentUser: null,
      isLoading: false,
      isAuthenticated: false,
      isWaitlisted: false,
    });
  });

  describe('initial state', () => {
    it('should have null currentUser', () => {
      const { currentUser } = useUserStore.getState();
      expect(currentUser).toBeNull();
    });

    it('should not be authenticated', () => {
      const { isAuthenticated } = useUserStore.getState();
      expect(isAuthenticated).toBe(false);
    });

    it('should not be loading after reset', () => {
      const { isLoading } = useUserStore.getState();
      expect(isLoading).toBe(false);
    });

    it('should not be waitlisted', () => {
      const { isWaitlisted } = useUserStore.getState();
      expect(isWaitlisted).toBe(false);
    });
  });

  describe('setUser', () => {
    it('should set user and mark as authenticated', () => {
      const { setUser } = useUserStore.getState();

      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        displayName: 'Test User',
        theme: 'light' as const,
        createdAt: Date.now(),
        subscriptionTier: 'free' as const,
      };

      setUser(mockUser);

      const { currentUser, isAuthenticated, isLoading } = useUserStore.getState();
      expect(currentUser).toEqual(mockUser);
      expect(isAuthenticated).toBe(true);
      expect(isLoading).toBe(false);
    });

    it('should clear user on null', () => {
      useUserStore.setState({
        currentUser: {
          id: 'user-1',
          email: 'test@example.com',
          theme: 'light',
          createdAt: Date.now(),
          subscriptionTier: 'free',
        },
        isAuthenticated: true,
      });

      const { setUser } = useUserStore.getState();
      setUser(null);

      const { currentUser, isAuthenticated } = useUserStore.getState();
      expect(currentUser).toBeNull();
      expect(isAuthenticated).toBe(false);
    });
  });

  describe('setWaitlisted', () => {
    it('should set waitlisted status to true', () => {
      const { setWaitlisted } = useUserStore.getState();
      setWaitlisted(true);
      const { isWaitlisted } = useUserStore.getState();
      expect(isWaitlisted).toBe(true);
    });

    it('should set waitlisted status to false', () => {
      useUserStore.setState({ isWaitlisted: true });
      const { setWaitlisted } = useUserStore.getState();
      setWaitlisted(false);
      const { isWaitlisted } = useUserStore.getState();
      expect(isWaitlisted).toBe(false);
    });
  });

  describe('checkWaitlistStatus', () => {
    it('should check waitlist status for email', async () => {
      const { checkWaitlistStatus } = useUserStore.getState();
      await checkWaitlistStatus('test@example.com');
      const { isWaitlisted } = useUserStore.getState();
      expect(isWaitlisted).toBe(false);
    });

    it('should set isWaitlisted to true when user is on waitlist', async () => {
      const { getDocs } = await import('firebase/firestore');
      vi.mocked(getDocs).mockResolvedValueOnce({ empty: false } as never);

      const { checkWaitlistStatus } = useUserStore.getState();
      await checkWaitlistStatus('waitlisted@example.com');
      const { isWaitlisted } = useUserStore.getState();
      expect(isWaitlisted).toBe(true);
    });

    it('should handle errors gracefully', async () => {
      const { getDocs } = await import('firebase/firestore');
      vi.mocked(getDocs).mockRejectedValueOnce(new Error('Network error'));

      const { checkWaitlistStatus } = useUserStore.getState();
      await checkWaitlistStatus('test@example.com');
      const { isWaitlisted } = useUserStore.getState();
      expect(isWaitlisted).toBe(false);
    });
  });

  describe('initAuthListener', () => {
    it('should set isLoading to true when initialized', () => {
      const { initAuthListener } = useUserStore.getState();
      initAuthListener();
      const { isLoading } = useUserStore.getState();
      expect(isLoading).toBe(true);
    });

    it('should return an unsubscribe function', () => {
      const { initAuthListener } = useUserStore.getState();
      const unsubscribe = initAuthListener();
      expect(typeof unsubscribe).toBe('function');
    });

    it('should set user when firebase user is authenticated', async () => {
      const { initAuthListener } = useUserStore.getState();
      initAuthListener();

      const mockFirebaseUser = {
        uid: 'firebase-uid',
        email: 'user@example.com',
        displayName: 'Firebase User',
        photoURL: 'https://example.com/photo.jpg',
        providerData: [{ providerId: 'google.com' }],
      };

      if (authStateCallback) {
        await authStateCallback(mockFirebaseUser);
      }

      const state = useUserStore.getState();
      expect(state.currentUser?.id).toBe('firebase-uid');
      expect(state.currentUser?.email).toBe('user@example.com');
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
    });

    it('should clear user when firebase user is null', async () => {
      useUserStore.setState({
        currentUser: {
          id: 'user-1',
          email: 'test@example.com',
          theme: 'light',
          createdAt: Date.now(),
          subscriptionTier: 'free',
        },
        isAuthenticated: true,
      });

      const { initAuthListener } = useUserStore.getState();
      initAuthListener();

      if (authStateCallback) {
        await authStateCallback(null);
      }

      const state = useUserStore.getState();
      expect(state.currentUser).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.isWaitlisted).toBe(false);
    });
  });

  describe('logout', () => {
    it('should set isLoading to true during logout', async () => {
      useUserStore.setState({
        currentUser: {
          id: 'user-1',
          email: 'test@example.com',
          theme: 'light',
          createdAt: Date.now(),
          subscriptionTier: 'free',
        },
        isAuthenticated: true,
      });

      const { logout } = useUserStore.getState();
      const logoutPromise = logout();
      expect(useUserStore.getState().isLoading).toBe(true);
      await logoutPromise;
    });

    it('should clear user state after logout', async () => {
      useUserStore.setState({
        currentUser: {
          id: 'user-1',
          email: 'test@example.com',
          theme: 'light',
          createdAt: Date.now(),
          subscriptionTier: 'free',
        },
        isAuthenticated: true,
        isWaitlisted: true,
      });

      const { logout } = useUserStore.getState();
      await logout();

      const state = useUserStore.getState();
      expect(state.currentUser).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isWaitlisted).toBe(false);
      expect(state.isLoading).toBe(false);
    });

    it('should handle logout errors gracefully', async () => {
      const { auth } = await import('@/lib/firebase/client');
      vi.mocked(auth.signOut).mockRejectedValueOnce(new Error('Logout failed'));

      useUserStore.setState({
        currentUser: {
          id: 'user-1',
          email: 'test@example.com',
          theme: 'light',
          createdAt: Date.now(),
          subscriptionTier: 'free',
        },
        isAuthenticated: true,
      });

      const { logout } = useUserStore.getState();
      await logout();

      const { isLoading } = useUserStore.getState();
      expect(isLoading).toBe(false);
    });
  });

  describe('loginWithGoogle', () => {
    it('should set isLoading to true during login', async () => {
      const { loginWithGoogle } = useUserStore.getState();
      const loginPromise = loginWithGoogle();
      expect(useUserStore.getState().isLoading).toBe(true);
      await loginPromise;
    });

    it('should throw error on login failure', async () => {
      const { signInWithPopup } = await import('firebase/auth');
      vi.mocked(signInWithPopup).mockRejectedValueOnce(new Error('Popup closed'));

      const { loginWithGoogle } = useUserStore.getState();
      await expect(loginWithGoogle()).rejects.toThrow('Popup closed');
    });
  });

  describe('loginWithEmail', () => {
    it('should set isLoading to true during login', async () => {
      const { loginWithEmail } = useUserStore.getState();
      const loginPromise = loginWithEmail('test@example.com', 'password123');
      expect(useUserStore.getState().isLoading).toBe(true);
      await loginPromise;
    });

    it('should throw error and reset loading on failure', async () => {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      vi.mocked(signInWithEmailAndPassword).mockRejectedValueOnce(new Error('Invalid credentials'));

      const { loginWithEmail } = useUserStore.getState();
      await expect(loginWithEmail('test@example.com', 'wrong')).rejects.toThrow(
        'Invalid credentials'
      );

      const { isLoading } = useUserStore.getState();
      expect(isLoading).toBe(false);
    });
  });

  describe('signUpWithEmail', () => {
    it('should set isLoading to true during signup', async () => {
      const { signUpWithEmail } = useUserStore.getState();
      const signupPromise = signUpWithEmail('test@example.com', 'password123');
      expect(useUserStore.getState().isLoading).toBe(true);
      await signupPromise;
    });

    it('should throw error and reset loading on failure', async () => {
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      vi.mocked(createUserWithEmailAndPassword).mockRejectedValueOnce(
        new Error('Email already exists')
      );

      const { signUpWithEmail } = useUserStore.getState();
      await expect(signUpWithEmail('existing@example.com', 'password')).rejects.toThrow(
        'Email already exists'
      );

      const { isLoading } = useUserStore.getState();
      expect(isLoading).toBe(false);
    });
  });

  describe('updateDisplayName', () => {
    it('should update display name when user exists', async () => {
      useUserStore.setState({
        currentUser: {
          id: 'user-1',
          email: 'test@example.com',
          displayName: 'Old Name',
          theme: 'light',
          createdAt: Date.now(),
          subscriptionTier: 'free',
        },
        isAuthenticated: true,
      });

      const { updateDisplayName } = useUserStore.getState();
      await updateDisplayName('New Name');

      const { currentUser, isLoading } = useUserStore.getState();
      expect(currentUser?.displayName).toBe('New Name');
      expect(isLoading).toBe(false);
    });

    it('should throw error and reset loading on failure', async () => {
      const { updateProfile } = await import('firebase/auth');
      vi.mocked(updateProfile).mockRejectedValueOnce(new Error('Update failed'));

      useUserStore.setState({
        currentUser: {
          id: 'user-1',
          email: 'test@example.com',
          theme: 'light',
          createdAt: Date.now(),
          subscriptionTier: 'free',
        },
        isAuthenticated: true,
      });

      const { updateDisplayName } = useUserStore.getState();
      await expect(updateDisplayName('New Name')).rejects.toThrow('Update failed');

      const { isLoading } = useUserStore.getState();
      expect(isLoading).toBe(false);
    });
  });

  describe('updatePhotoURL', () => {
    it('should update photo URL when user exists', async () => {
      useUserStore.setState({
        currentUser: {
          id: 'user-1',
          email: 'test@example.com',
          theme: 'light',
          createdAt: Date.now(),
          subscriptionTier: 'free',
        },
        isAuthenticated: true,
      });

      const { updatePhotoURL } = useUserStore.getState();
      await updatePhotoURL('https://example.com/avatar.jpg');

      const { currentUser, isLoading } = useUserStore.getState();
      expect(currentUser?.photoURL).toBe('https://example.com/avatar.jpg');
      expect(isLoading).toBe(false);
    });

    it('should throw error and reset loading on failure', async () => {
      const { updateProfile } = await import('firebase/auth');
      vi.mocked(updateProfile).mockRejectedValueOnce(new Error('Upload failed'));

      useUserStore.setState({
        currentUser: {
          id: 'user-1',
          email: 'test@example.com',
          theme: 'light',
          createdAt: Date.now(),
          subscriptionTier: 'free',
        },
        isAuthenticated: true,
      });

      const { updatePhotoURL } = useUserStore.getState();
      await expect(updatePhotoURL('https://example.com/new.jpg')).rejects.toThrow('Upload failed');

      const { isLoading } = useUserStore.getState();
      expect(isLoading).toBe(false);
    });
  });
});
