'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const TooltipContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
} | null>(null);

export function TooltipProvider({
  children,
  delayDuration: _ = 0,
}: {
  children: React.ReactNode;
  delayDuration?: number;
}) {
  return <>{children}</>;
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <TooltipContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block">{children}</div>
    </TooltipContext.Provider>
  );
}

export function TooltipTrigger({
  children,
  asChild: _asChild,
}: {
  children: React.ReactNode;
  asChild?: boolean;
}) {
  const ctx = React.useContext(TooltipContext);

  return (
    <div
      onMouseEnter={() => ctx?.setIsOpen(true)}
      onMouseLeave={() => ctx?.setIsOpen(false)}
      className="inline-block"
    >
      {children}
    </div>
  );
}

export function TooltipContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(TooltipContext);

  return (
    <AnimatePresence>
      {ctx?.isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 5 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'absolute z-50 px-3 py-1.5 text-xs text-zinc-50 bg-zinc-900 rounded-md shadow-md -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none',
            className
          )}
        >
          {children}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900 rotate-45" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
