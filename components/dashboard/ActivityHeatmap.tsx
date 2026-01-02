'use client';

import { useTaskStore } from '@/store/task.store';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export function ActivityHeatmap() {
  const { tasks } = useTaskStore();
  const allTasks = Object.values(tasks);

  const today = new Date();
  const days = [];

  for (let i = 84; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const count = allTasks.filter(t => {
      if (!t.completed || !t.completedAt) return false;
      const tDate = new Date(t.completedAt);
      return (
        tDate.getDate() === d.getDate() &&
        tDate.getMonth() === d.getMonth() &&
        tDate.getFullYear() === d.getFullYear()
      );
    }).length;

    let level = 0;
    if (count > 0) level = 1;
    if (count > 2) level = 2;
    if (count > 4) level = 3;
    if (count > 6) level = 4;

    days.push({
      date: d.toLocaleDateString(),
      count,
      level,
      dayOfWeek: d.getDay(),
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-3xl shadow-sm"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-zinc-900 dark:text-zinc-100 font-semibold text-lg">Activity</h3>
          <p className="text-zinc-500 text-sm">Your productivity streak over last 3 months</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 md:gap-1.5 overflow-x-auto pb-2">
        {days.map((day, i) => (
          <TooltipProvider key={i} delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.005 }}
                  className={cn(
                    'w-3 h-3 md:w-3.5 md:h-3.5 rounded-sm transition-colors',
                    day.level === 0 && 'bg-zinc-100 dark:bg-zinc-800',
                    day.level === 1 && 'bg-emerald-200 dark:bg-emerald-900/50',
                    day.level === 2 && 'bg-emerald-300 dark:bg-emerald-700',
                    day.level === 3 && 'bg-emerald-400 dark:bg-emerald-600',
                    day.level === 4 && 'bg-emerald-500 dark:bg-emerald-500'
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {day.count} tasks on {day.date}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-zinc-400">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-zinc-100 dark:bg-zinc-800" />
          <div className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-900/50" />
          <div className="w-3 h-3 rounded-sm bg-emerald-300 dark:bg-emerald-700" />
          <div className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-600" />
          <div className="w-3 h-3 rounded-sm bg-emerald-500 dark:bg-emerald-500" />
        </div>
        <span>More</span>
      </div>
    </motion.div>
  );
}
