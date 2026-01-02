'use client';

import { Goal } from '@/types';
import { useGoalStore } from '@/store/goal.store';
import { useTaskStore } from '@/store/task.store';
import { motion } from 'framer-motion';
import {
  Target,
  Calendar,
  ArrowRight,
  MoreVertical,
  Trash2,
  Edit2,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoalFormModal } from './GoalFormModal';
import { AnimatePresence } from 'framer-motion';

interface GoalCardProps {
  goal: Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
  const { deleteGoal, toggleGoal } = useGoalStore();
  const { tasks } = useTaskStore();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const linkedTasks = Object.values(tasks).filter(t => t.goalId === goal.id && !t.isDeleted);
  const completedTasks = linkedTasks.filter(t => t.completed).length;
  const progress =
    linkedTasks.length > 0 ? Math.round((completedTasks / linkedTasks.length) * 100) : 0;

  const daysLeft = differenceInDays(new Date(goal.endDate), new Date());
  const isOverdue = daysLeft < 0;

  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500',
    emerald: 'bg-emerald-500',
    violet: 'bg-violet-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    cyan: 'bg-cyan-500',
  };

  const bgMap: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30',
    violet: 'bg-violet-50 dark:bg-violet-900/10 border-violet-100 dark:border-violet-900/30',
    amber: 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30',
    rose: 'bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-900/30',
    cyan: 'bg-cyan-50 dark:bg-cyan-900/10 border-cyan-100 dark:border-cyan-900/30',
  };

  const activeColor = goal.color || 'blue';

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -4 }}
        className={cn(
          'group relative p-5 rounded-3xl border transition-all duration-300',
          bgMap[activeColor],
          goal.completedAt && 'opacity-60 grayscale-[0.5]'
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push(`/goals/${goal.id}`)}
          >
            <div
              className={cn(
                'w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm text-white',
                colorMap[activeColor]
              )}
            >
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-50 leading-tight">
                {goal.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                <Calendar className="w-3 h-3" />
                <span>{format(goal.endDate, 'MMM d, yyyy')}</span>
                {goal.completedAt ? (
                  <span className="text-emerald-600 font-medium px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                    Completed
                  </span>
                ) : (
                  <span
                    className={cn(
                      'font-medium px-1.5 py-0.5 rounded-full',
                      isOverdue
                        ? 'text-rose-600 bg-rose-100 dark:bg-rose-900/30'
                        : 'text-amber-600 bg-amber-100 dark:bg-amber-900/30'
                    )}
                  >
                    {isOverdue ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 text-zinc-500 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-32 p-1 z-20 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden"
                  >
                    <button
                      onClick={() => {
                        toggleGoal(goal.id);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 rounded-lg text-left"
                    >
                      {goal.completedAt ? (
                        <>
                          <Circle className="w-4 h-4" /> Not Done
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Complete
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 rounded-lg text-left"
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <div className="h-px bg-zinc-100 dark:bg-zinc-700/50 my-1" />
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg text-left"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-medium text-zinc-500">
              {goal.completedAt ? 'Goal Achieved' : `${linkedTasks.length} tasks linked`}
            </span>
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {goal.completedAt ? '100%' : `${progress}%`}
            </span>
          </div>
          <div className="h-2.5 w-full bg-black/5 dark:bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: goal.completedAt ? '100%' : `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={cn('h-full rounded-full', colorMap[activeColor])}
            />
          </div>
        </div>
        <div
          onClick={() => router.push(`/goals/${goal.id}`)}
          className="mt-6 pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between group/footer cursor-pointer"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 group-hover/footer:text-zinc-600 dark:group-hover/footer:text-zinc-300 transition-colors">
            View Details
          </span>
          <ArrowRight className="w-4 h-4 text-zinc-400 dark:text-zinc-500 group-hover/footer:translate-x-1 transition-all" />
        </div>
      </motion.div>

      <GoalFormModal isOpen={isEditing} onClose={() => setIsEditing(false)} goal={goal} />
    </>
  );
}
