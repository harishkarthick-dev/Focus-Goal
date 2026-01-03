import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  Home,
  Sun,
  CalendarDays,
  Star,
  CheckSquare,
  Target,
  StickyNote,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserNav } from './UserNav';

const navItems = [
  { label: 'Home', icon: Home, href: '/dashboard', color: 'text-indigo-500' },
  { label: 'My Day', icon: Sun, href: '/day', color: 'text-amber-500' },
  { label: 'Upcoming', icon: CalendarDays, href: '/upcoming', color: 'text-purple-500' },
  { label: 'Important', icon: Star, href: '/important', color: 'text-rose-500' },
  { label: 'Tasks', icon: CheckSquare, href: '/tasks', color: 'text-blue-500' },
  { label: 'Goals', icon: Target, href: '/goals', color: 'text-emerald-500' },
  { label: 'Notes', icon: StickyNote, href: '/notes', color: 'text-yellow-500' },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      setTimeout(() => setIsOpen(false), 0);
      prevPathRef.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-40 px-4 py-3 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm text-zinc-600 dark:text-zinc-300 active:scale-95 transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>

        <span className="text-lg font-bold bg-gradient-to-tr from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Tasky
        </span>

        <UserNav className="" />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] bg-zinc-50 dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold bg-gradient-to-tr from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Tasky
                </h1>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-1">
                {navItems.map((link, i) => {
                  const Icon = link.icon;
                  const isActive =
                    pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));

                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 + 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-colors',
                          isActive
                            ? 'bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-zinc-100'
                            : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-200'
                        )}
                      >
                        <Icon
                          className={cn(
                            'w-5 h-5',
                            isActive ? link.color : 'text-zinc-400 dark:text-zinc-600'
                          )}
                        />
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                <p className="text-xs text-center text-zinc-400 font-mono">
                  Simple. Fast. Focused.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
