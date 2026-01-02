'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task } from '@/types';

interface RepeatSelectorProps {
  value?: Task['repeat'];
  onChange: (value: Task['repeat']) => void;
  onClose: () => void;
}

export function RepeatSelector({ value, onChange, onClose }: RepeatSelectorProps) {
  const options: { label: string; value: Task['repeat'] }[] = [
    { label: 'Does not repeat', value: undefined },
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 w-[200px] overflow-hidden"
    >
      <div className="p-1">
        {options.map(option => (
          <button
            key={option.label}
            onClick={() => {
              onChange(option.value);
              onClose();
            }}
            className={cn(
              'w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors',
              value === option.value
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            )}
          >
            <span className="flex-1 text-left">{option.label}</span>
            {value === option.value && <Check className="w-4 h-4" />}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
