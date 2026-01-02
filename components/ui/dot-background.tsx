'use client';

import { cn } from '@/lib/utils';

interface DotBackgroundProps {
  className?: string;
}

export function DotBackground({ className }: DotBackgroundProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 -z-50 pointer-events-none h-full w-full bg-zinc-50 dark:bg-zinc-950',
        className
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] opacity-50 dark:opacity-20" />
    </div>
  );
}
