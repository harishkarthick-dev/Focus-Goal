'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Sun, CheckSquare, Target, StickyNote } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Home', icon: Home, href: '/dashboard', color: 'text-indigo-500' },
  { label: 'My Day', icon: Sun, href: '/day', color: 'text-amber-500' },
  { label: 'Tasks', icon: CheckSquare, href: '/tasks', color: 'text-blue-500' },
  { label: 'Goals', icon: Target, href: '/goals', color: 'text-emerald-500' },
  { label: 'Notes', icon: StickyNote, href: '/notes', color: 'text-yellow-500' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800 pb-safe">
      <nav className="flex items-center justify-around px-2 py-3">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200',
                isActive
                  ? 'text-zinc-900 dark:text-zinc-100'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
              )}
            >
              <div
                className={cn(
                  'p-1.5 rounded-full transition-all duration-200',
                  isActive ? 'bg-zinc-100 dark:bg-zinc-800' : 'bg-transparent'
                )}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 transition-colors duration-200',
                    isActive ? item.color : 'text-zinc-500 dark:text-zinc-400'
                  )}
                />
              </div>
              <span
                className={cn('text-[10px] font-medium transition-colors', isActive && item.color)}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
