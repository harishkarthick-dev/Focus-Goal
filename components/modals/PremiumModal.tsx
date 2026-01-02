import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Zap, Crown, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useUserStore } from '@/store/user.store';
import { db } from '@/lib/firebase/client';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const { currentUser, isWaitlisted, setWaitlisted } = useUserStore();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const prevIsOpenRef = useRef(isOpen);

  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      setTimeout(() => {
        if (isWaitlisted) {
          setStatus('success');
        } else {
          setStatus('idle');
        }
      }, 0);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, isWaitlisted]);

  const handleNotify = async () => {
    if (!currentUser?.email) return;

    setStatus('loading');
    try {
      await addDoc(collection(db, 'waitlist'), {
        email: currentUser.email,
        uid: currentUser.id,
        createdAt: serverTimestamp(),
        source: 'web_app_modal',
      });
      setWaitlisted(true);
      setStatus('success');
    } catch (error) {
      console.error('Failed to join waitlist:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-white/20 dark:border-white/10 shadow-2xl ring-1 ring-black/5"
            >
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl opacity-50 animate-pulse" />
                <div
                  className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-500/30 rounded-full blur-3xl opacity-50 animate-pulse"
                  style={{ animationDelay: '1s' }}
                />
              </div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors z-20"
              >
                <X className="w-5 h-5 text-zinc-500" />
              </button>

              <div className="relative z-10 flex flex-col items-center text-center p-8 pt-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1 }}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mb-6 ring-4 ring-white dark:ring-zinc-800 transition-colors duration-500 ${status === 'success' ? 'bg-gradient-to-tr from-green-400 to-emerald-600' : 'bg-gradient-to-tr from-amber-400 to-orange-500'}`}
                >
                  {status === 'success' ? (
                    <Check className="w-8 h-8 text-white" strokeWidth={3} />
                  ) : (
                    <Crown className="w-8 h-8 text-white fill-white/20" />
                  )}
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl font-bold text-zinc-900 dark:text-white mb-3"
                >
                  {status === 'success' ? (
                    <span>You&apos;re Reserved!</span>
                  ) : (
                    <span>
                      Tasky{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
                        Pro
                      </span>
                    </span>
                  )}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed"
                >
                  {status === 'success'
                    ? "You've secured your spot for early access. We'll notify you as soon as Tasky Pro is ready for launch."
                    : 'Unlock the full potential of your productivity with AI insights, unlimited collaboration, and advanced analytics.'}
                </motion.p>
                {status !== 'success' && (
                  <div className="w-full space-y-3 mb-8 text-left">
                    {[
                      'Unlimited Goals & Projects',
                      'AI-Powered Daily Planning',
                      'Advanced Analytics & Trends',
                      'Priority Support',
                    ].map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300"
                      >
                        <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                          <Check className="w-3 h-3" strokeWidth={3} />
                        </div>
                        {feature}
                      </motion.div>
                    ))}
                  </div>
                )}
                {status !== 'success' && (
                  <motion.button
                    onClick={handleNotify}
                    disabled={status !== 'idle' || !currentUser}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                                            w-full py-3.5 rounded-xl font-semibold shadow-lg transition-all relative overflow-hidden group
                                            ${status === 'error' ? 'bg-red-500 text-white' : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:shadow-xl'}
                                        `}
                  >
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      {status === 'loading' ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : status === 'error' ? (
                        <span>Something went wrong</span>
                      ) : (
                        <>
                          <Zap
                            className="w-4 h-4 text-amber-500 dark:text-amber-600"
                            fill="currentColor"
                          />
                          <span>Notify Me When Available</span>
                        </>
                      )}
                    </div>
                    {status === 'idle' && (
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                    )}
                  </motion.button>
                )}
                {status !== 'success' ? (
                  <button
                    onClick={onClose}
                    className="mt-4 text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                  >
                    Maybe later
                  </button>
                ) : (
                  <button
                    onClick={onClose}
                    className="mt-4 text-sm font-medium text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 px-6 py-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    Close
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
