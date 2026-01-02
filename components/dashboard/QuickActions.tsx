'use client';

import { motion } from 'framer-motion';
import { Plus, StickyNote, Target } from 'lucide-react';
import Link from 'next/link';

const actions = [
  {
    label: 'Add Task',
    desc: 'Organize your day',
    icon: Plus,
    href: '/tasks',
    color: 'bg-blue-600',
    textColor: 'text-blue-100',
  },
  {
    label: 'New Goal',
    desc: 'Dream big',
    icon: Target,
    href: '/goals',
    color: 'bg-emerald-600',
    textColor: 'text-emerald-100',
  },
  {
    label: 'Write Note',
    desc: 'Capture ideas',
    icon: StickyNote,
    href: '/notes',
    color: 'bg-amber-500',
    textColor: 'text-amber-100',
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {actions.map((action, i) => (
        <Link key={action.label} href={action.href}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-800/50 p-5 shadow-sm hover:shadow-xl transition-all flex items-center gap-5 cursor-pointer"
          >
            <div
              className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center shadow-md transform group-hover:rotate-12 transition-transform duration-300 relative z-10`}
            >
              <action.icon className={`w-6 h-6 ${action.textColor}`} strokeWidth={2.5} />
            </div>
            <div className="relative z-10">
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {action.label}
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{action.desc}</p>
            </div>
            <div
              className={`absolute -right-6 -bottom-6 w-32 h-32 rounded-full ${action.color} opacity-[0.08] group-hover:scale-150 transition-transform duration-500 blur-2xl`}
            />
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
