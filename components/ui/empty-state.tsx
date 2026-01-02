'use client';

import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn('flex flex-col items-center justify-center text-center py-16 px-4', className)}
    >
      <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-full mb-4 ring-1 ring-zinc-100 dark:ring-zinc-800">
        <Icon className="w-8 h-8 text-zinc-400 dark:text-zinc-500" strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">{title}</h3>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mb-6 text-sm">{description}</p>
      {action && <div>{action}</div>}
    </motion.div>
  );
}
