'use client';

import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { MotionButton } from '@/components/ui/motion-button';

export function LandingNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-md border-b border-zinc-200/50 dark:border-zinc-800/50">
      <div className="flex items-center gap-2">
        <div className="bg-amber-500 rounded-lg p-1">
          <CheckCircle2 className="w-5 h-5 text-white" />
        </div>
        <span className="font-serif text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Tasky
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          Sign In
        </Link>
        <Link href="/login">
          <MotionButton size="sm" className="hidden sm:flex">
            Get Started <ArrowRight className="w-4 h-4 ml-1" />
          </MotionButton>
        </Link>
      </div>
    </nav>
  );
}
