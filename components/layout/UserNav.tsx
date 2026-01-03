'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/user.store';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { PremiumModal } from '@/components/modals/PremiumModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, LogOut, Sparkles } from 'lucide-react';

export function UserNav({ className }: { className?: string }) {
  const { currentUser, logout } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const _router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();

    window.location.href = '/login';
  };

  const menuItems = [
    {
      label: 'Upgrade Plan',
      icon: Sparkles,
      color: 'text-amber-500',
      action: () => setShowPremium(true),
    },
    { label: 'Settings', icon: Settings, shortcut: '⌘S', href: '/settings' },
  ];

  return (
    <>
      <div className={cn('flex flex-col items-end', className)} ref={menuRef}>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          className="relative flex items-center gap-1 p-1.5 pr-2 pl-2 rounded-full 
                    bg-white/80 dark:bg-zinc-900/90 backdrop-blur-2xl 
                    border border-white/40 dark:border-zinc-800
                    shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.4)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]
                    hover:shadow-[0_12px_40px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.5)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]
                    transition-all duration-300 select-none group/nav overflow-hidden"
        >
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-full">
            <div className="absolute top-0 -inset-full h-full w-1/2 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 dark:opacity-5 dark:to-zinc-500 animate-shimmer" />
          </div>
          <motion.div
            className="relative z-10 flex items-center gap-3 px-3 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors group/user"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex flex-col items-end text-right hidden sm:flex">
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 leading-tight tracking-tight">
                {currentUser?.displayName ||
                  (currentUser?.email ? currentUser.email.split('@')[0] : 'Guest')}
              </span>
              <span className="text-[10px] uppercase tracking-wider font-medium text-emerald-500 font-bold opacity-100 transition-opacity">
                Early Access
              </span>
            </div>
            <div className="relative shrink-0 w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-md flex items-center justify-center text-white text-sm font-bold ring-2 ring-white dark:ring-zinc-800 group-hover/user:ring-blue-100 dark:group-hover/user:ring-indigo-900/50 transition-all overflow-hidden">
              {currentUser?.photoURL ? (
                <Image
                  src={currentUser.photoURL}
                  alt="User Avatar"
                  width={36}
                  height={36}
                  className="object-cover w-full h-full"
                />
              ) : (
                (currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'U').toUpperCase()
              )}
            </div>
          </motion.div>
          <div className="relative z-10 w-px h-8 bg-gradient-to-b from-transparent via-zinc-300 dark:via-zinc-700 to-transparent mx-1 opacity-50" />
          <div className="relative z-10 pl-1">
            <ThemeToggle />
          </div>
        </motion.div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute top-full right-0 mt-3 w-64 p-2 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-white/20 dark:border-zinc-800 shadow-2xl overflow-hidden z-40"
            >
              <div className="flex flex-col gap-1">
                {menuItems.map((item, i) => {
                  const ItemContent = () => (
                    <>
                      <item.icon
                        className={`w-4 h-4 ${item.color || 'text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'}`}
                      />
                      <span className="flex-1">{item.label}</span>
                      {item.shortcut && (
                        <span className="text-xs text-zinc-400 font-mono">{item.shortcut}</span>
                      )}
                    </>
                  );

                  return item.href ? (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-sm font-medium text-zinc-700 dark:text-zinc-200 transition-colors w-full text-left group"
                    >
                      <ItemContent />
                    </Link>
                  ) : (
                    <motion.button
                      key={item.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => {
                        setIsOpen(false);
                        item.action?.();
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 text-sm font-medium text-zinc-700 dark:text-zinc-200 transition-colors w-full text-left group"
                    >
                      <ItemContent />
                    </motion.button>
                  );
                })}

                <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1 mx-2" />

                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium text-red-600 dark:text-red-400 transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <PremiumModal isOpen={showPremium} onClose={() => setShowPremium(false)} />
    </>
  );
}
