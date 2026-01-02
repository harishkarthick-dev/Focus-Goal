'use client';

import { useTaskStore } from '@/store/task.store';
import { useGoalStore } from '@/store/goal.store';
import { motion } from 'framer-motion';
import { CheckCircle2, Target, Calendar } from 'lucide-react';
import Link from 'next/link';

export function DashboardStats() {
  const tasks = useTaskStore(state => state.tasks);
  const goals = useGoalStore(state => state.goals);

  const activeTasksCount = Object.values(tasks).filter(t => !t.isDeleted && !t.completed).length;
  const myDayCount = Object.values(tasks).filter(
    t => !t.isDeleted && !t.completed && t.isMyDay
  ).length;
  const activeGoalsCount = Object.values(goals).filter(g => !g.isDeleted).length;

  const stats = [
    {
      label: 'My Day',
      count: myDayCount,
      icon: Calendar,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      href: '/day',
    },
    {
      label: 'Pending Tasks',
      count: activeTasksCount,
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      href: '/tasks',
    },
    {
      label: 'Active Goals',
      count: activeGoalsCount,
      icon: Target,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      href: '/goals',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
      {stats.map((stat, i) => (
        <Link key={stat.label} href={stat.href}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all cursor-pointer flex flex-col items-start relative overflow-hidden group"
          >
            <div
              className={`p-3 rounded-lg ${stat.bg} ${stat.color} mb-4 relative z-10 transition-transform group-hover:scale-110 duration-500`}
            >
              <stat.icon className="w-5 h-5" />
            </div>
            <span className="text-4xl font-serif font-medium text-zinc-900 dark:text-zinc-100 relative z-10">
              {stat.count}
            </span>
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1 relative z-10">
              {stat.label}
            </span>
            <div className="absolute -right-4 -bottom-4 opacity-5 stroke-current group-hover:opacity-10 transition-opacity">
              <stat.icon className={`w-32 h-32 ${stat.color} text-current`} />
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
