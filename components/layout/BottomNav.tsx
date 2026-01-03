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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-t border-zinc-200 dark:border-zinc-800 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)]">
      <nav className="flex items-center justify-around px-2 py-3">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 group touch-manipulation"
            >
              {isActive && (
                <span className="absolute -top-3 w-8 h-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 shadow-sm" />
              )}

              <div
                className={cn(
                  'p-1.5 rounded-2xl transition-all duration-300',
                  isActive
                    ? 'bg-zinc-100 dark:bg-zinc-800/80 -translate-y-1'
                    : 'bg-transparent group-active:scale-95'
                )}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 transition-colors duration-300',
                    isActive
                      ? item.color
                      : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300'
                  )}
                />
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium transition-all duration-300',
                  isActive ? cn(item.color, 'font-bold') : 'text-zinc-400 dark:text-zinc-500'
                )}
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
