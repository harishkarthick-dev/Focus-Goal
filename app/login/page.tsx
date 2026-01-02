'use client';

import { motion } from 'framer-motion';
import { useUserStore } from '@/store/user.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const {
    loginWithGoogle,
    loginWithEmail,
    signUpWithEmail,
    isAuthenticated,
    isLoading,
    initAuthListener,
  } = useUserStore();
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = initAuthListener();
    return () => unsub();
  }, [initAuthListener]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setError('');
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
      setError('Failed to sign in with Google');
      setIsLoggingIn(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err) {
      console.error(err);

      const firebaseError = err as { code?: string };
      if (firebaseError.code === 'auth/invalid-credential') {
        setError('Invalid email or password');
      } else if (firebaseError.code === 'auth/email-already-in-use') {
        setError('Email is already in use');
      } else if (firebaseError.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters');
      } else {
        setError('Authentication failed. Please try again.');
      }
      setIsLoggingIn(false);
    }
  };

  if (isLoading && isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-950">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-zinc-950 text-zinc-50 font-sans selection:bg-amber-500/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[128px] opacity-40 animate-pulse" />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-amber-600/20 rounded-full blur-[128px] opacity-40 animate-pulse"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div className="w-full h-screen flex flex-col items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 shadow-xl shadow-amber-900/20 flex items-center justify-center">
              <span className="text-3xl font-bold text-white">T</span>
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-zinc-400 mb-2">
              Welcome to Tasky
            </h1>
            <p className="text-zinc-400">Your intelligent workspace for life and work.</p>
          </div>
          <div className="bg-zinc-900/50 border border-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl ring-1 ring-black/20">
            <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-zinc-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-zinc-900 text-zinc-500">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={isLoggingIn}
              className="w-full relative group overflow-hidden bg-white hover:bg-zinc-50 text-zinc-900 font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-white/5 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  style={{ fill: '#34A853' }}
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  style={{ fill: '#FBBC05' }}
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  style={{ fill: '#EA4335' }}
                />
              </svg>
              <span>Google</span>
            </button>

            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-zinc-500">
              <span>{isSignUp ? 'Already have an account?' : 'New here?'}</span>
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="text-amber-500 hover:text-amber-400 font-medium transition-colors"
              >
                {isSignUp ? 'Sign In' : 'Create Account'}
              </button>
            </div>
          </div>
        </motion.div>

        <div className="absolute bottom-8 text-xs text-zinc-500 font-mono">
          Tasky v1.0 • Secure Login
        </div>
      </div>
    </div>
  );
}
