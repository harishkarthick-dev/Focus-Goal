'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Sun,
  CheckSquare,
  Target,
  StickyNote,
  Home,
  CalendarDays,
  Star,
  PanelLeft,
} from 'lucide-react';

import { useUIStore } from '@/store/ui.store';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

const navItems = [
  { label: 'Home', icon: Home, href: '/dashboard', color: 'text-indigo-500' },
  { label: 'My Day', icon: Sun, href: '/day', color: 'text-amber-500' },
  { label: 'Upcoming', icon: CalendarDays, href: '/upcoming', color: 'text-purple-500' },
  { label: 'Important', icon: Star, href: '/important', color: 'text-rose-500' },
  { label: 'Tasks', icon: CheckSquare, href: '/tasks', color: 'text-blue-500' },
  { label: 'Goals', icon: Target, href: '/goals', color: 'text-emerald-500' },
  { label: 'Notes', icon: StickyNote, href: '/notes', color: 'text-yellow-500' },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isSidebarOpen ? '16rem' : '4.5rem',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="h-screen bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col hidden md:flex overflow-hidden relative"
    >
      <div
        className={cn(
          'p-6 flex items-center justify-between',
          isSidebarOpen ? 'min-w-[16rem]' : 'min-w-[4.5rem] flex-col gap-4'
        )}
      >
        {isSidebarOpen ? (
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0">
              <Image src="/logo.png" alt="Tasky" fill className="object-cover dark:hidden" />
              <Image
                src="/logo-dark.png"
                alt="Tasky"
                fill
                className="object-cover hidden dark:block"
              />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-tr from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Tasky
            </h1>
          </div>
        ) : (
          <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0">
            <Image src="/logo.png" alt="Tasky" fill className="object-cover dark:hidden" />
            <Image
              src="/logo-dark.png"
              alt="Tasky"
              fill
              className="object-cover hidden dark:block"
            />
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
        >
          <PanelLeft className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(link => {
          const Icon = link.icon;
          const isActive =
            pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200',
                !isSidebarOpen && 'justify-center px-2'
              )}
              title={!isSidebarOpen ? link.label : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-pill"
                  className="absolute inset-0 bg-white dark:bg-zinc-800 shadow-sm rounded-lg"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-3">
                <Icon
                  className={cn(
                    'w-5 h-5',
                    isActive ? link.color : 'text-zinc-400 dark:text-zinc-600'
                  )}
                />
                {isSidebarOpen && <span className="whitespace-nowrap">{link.label}</span>}
              </div>
            </Link>
          );
        })}
      </nav>
    </motion.aside>
  );
}
