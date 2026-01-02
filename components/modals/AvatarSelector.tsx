'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Check, X } from 'lucide-react';
import Image from 'next/image';
import { useUserStore } from '@/store/user.store';

interface AvatarSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVATAR_STYLES = [
  { id: 'notionists', label: 'Notionists' },
  { id: 'adventurer', label: 'Adventurer' },
  { id: 'avataaars', label: 'Avatars' },
  { id: 'bottts', label: 'Bots' },
  { id: 'fun-emoji', label: 'Emojis' },
  { id: 'lorelei', label: 'Lorelei' },
  { id: 'open-peeps', label: 'Peeps' },
  { id: 'personas', label: 'Personas' },
];

export function AvatarSelector({ isOpen, onClose }: AvatarSelectorProps) {
  const { updatePhotoURL, currentUser } = useUserStore();
  const [selectedStyle, setSelectedStyle] = useState(AVATAR_STYLES[0].id);
  const [seed, setSeed] = useState(Math.random().toString(36).substring(7));
  const [_isLoading, setIsLoading] = useState(false);

  const variations = Array.from({ length: 12 }).map((_, i) => {
    const variationSeed = `${seed}-${i}`;

    return `https://api.dicebear.com/7.x/${selectedStyle}/svg?seed=${variationSeed}`;
  });

  const handleSelect = async (url: string) => {
    setIsLoading(true);
    try {
      await updatePhotoURL(url);
      onClose();
    } catch (error) {
      console.error('Failed to update avatar', error);
    } finally {
      setIsLoading(false);
    }
  };

  const randomize = () => {
    setSeed(Math.random().toString(36).substring(7));
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
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-4xl bg-zinc-50 dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-white/20 dark:border-zinc-800 flex flex-col max-h-[85vh]"
            >
              <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    Choose Your Look
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Select a style and pick your favorite.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-500" />
                </button>
              </div>
              <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
                <div className="w-full md:w-64 bg-zinc-100/50 dark:bg-zinc-950/30 border-r border-zinc-200 dark:border-zinc-800 p-4 overflow-y-auto custom-scrollbar">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 px-2">
                    Styles
                  </h3>
                  <div className="space-y-1">
                    {AVATAR_STYLES.map(style => (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                          selectedStyle === style.id
                            ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 flex flex-col bg-white dark:bg-zinc-900 relative">
                  <div className="p-4 flex justify-between items-center border-b border-zinc-100 dark:border-zinc-800/50">
                    <div className="text-sm font-medium text-zinc-500">
                      Viewing{' '}
                      <span className="text-zinc-900 dark:text-zinc-200 font-bold">
                        {AVATAR_STYLES.find(s => s.id === selectedStyle)?.label}
                      </span>
                    </div>
                    <button
                      onClick={randomize}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors text-sm font-semibold"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Randomize
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {variations.map((url, i) => (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          onClick={() => handleSelect(url)}
                          className="group relative aspect-square rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-500 overflow-hidden transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <Image
                            src={url}
                            alt={`Avatar variation ${i}`}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                            <span className="text-white text-xs font-bold px-3 py-1.5 bg-black/50 rounded-full border border-white/20">
                              Select
                            </span>
                          </div>
                          {currentUser?.photoURL === url && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg text-white">
                              <Check className="w-3.5 h-3.5" strokeWidth={3} />
                            </div>
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
