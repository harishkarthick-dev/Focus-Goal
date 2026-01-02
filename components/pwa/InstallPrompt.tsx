'use client';

import { useState, useEffect } from 'react';
import { X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  platforms: string[];
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-[100] bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 p-4 rounded-2xl shadow-2xl flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-zinc-800 dark:bg-zinc-200 flex items-center justify-center shrink-0">
            <Smartphone className="w-6 h-6 text-indigo-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-sm">Install Tasky</h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Install the app for a better experience locally.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPrompt(false)}
              className="p-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={handleInstall}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Install
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
