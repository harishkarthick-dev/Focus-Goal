'use client';

import { useParams, useRouter } from 'next/navigation';
import { useGoalStore } from '@/store/goal.store';
import { useTaskStore } from '@/store/task.store';
import { Target, Calendar, ArrowLeft, Trophy, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { TaskItem } from '@/components/task/TaskItem';
import { TaskInput } from '@/components/task/TaskInput';
import { GoalFormModal } from '@/components/goal/GoalFormModal';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function GoalDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { goals, deleteGoal } = useGoalStore();
  const { tasks } = useTaskStore();

  const goal = goals[id];
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  if (!goal) {
    return (
      <div className="p-8 text-center text-zinc-500">
        Goal not found
        <button
          onClick={() => router.back()}
          className="block mx-auto mt-4 text-blue-500 hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const linkedTasks = Object.values(tasks)
    .filter(t => t.goalId === goal.id && !t.isDeleted)
    .sort((a, b) =>
      a.completed === b.completed ? b.createdAt - a.createdAt : a.completed ? 1 : -1
    );

  const completedTasks = linkedTasks.filter(t => t.completed).length;
  const progress =
    linkedTasks.length > 0 ? Math.round((completedTasks / linkedTasks.length) * 100) : 0;

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this goal? Linked tasks will not be deleted.')) {
      await deleteGoal(goal.id);
      router.push('/goals');
    }
  };

  const colorClasses: Record<string, { bg: string; text: string; lightBg: string }> = {
    blue: { bg: 'bg-blue-500', text: 'text-blue-600', lightBg: 'bg-blue-50 dark:bg-blue-900/20' },
    emerald: {
      bg: 'bg-emerald-500',
      text: 'text-emerald-600',
      lightBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    violet: {
      bg: 'bg-violet-500',
      text: 'text-violet-600',
      lightBg: 'bg-violet-50 dark:bg-violet-900/20',
    },
    amber: {
      bg: 'bg-amber-500',
      text: 'text-amber-600',
      lightBg: 'bg-amber-50 dark:bg-amber-900/20',
    },
    rose: { bg: 'bg-rose-500', text: 'text-rose-600', lightBg: 'bg-rose-50 dark:bg-rose-900/20' },
    cyan: { bg: 'bg-cyan-500', text: 'text-cyan-600', lightBg: 'bg-cyan-50 dark:bg-cyan-900/20' },
  };

  const theme = colorClasses[goal.color || 'blue'] || colorClasses.blue;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Goals
      </button>
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 mb-8 shadow-sm">
        <div className={cn('absolute top-0 left-0 w-full h-2', theme.bg)} />

        <div className="flex items-start justify-between">
          <div className="flex gap-6">
            <div
              className={cn(
                'w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3',
                theme.bg
              )}
            >
              <Target className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-50 mb-2">
                {goal.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                <span className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
                  <Calendar className="w-4 h-4" />
                  {format(goal.startDate, 'MMM d')} - {format(goal.endDate, 'MMM d, yyyy')}
                </span>
                <span className="capitalize px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-700">
                  {goal.type} Goal
                </span>
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl"
            >
              <MoreVertical className="w-5 h-5 text-zinc-400" />
            </button>
            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-40 p-1 z-20 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden"
                >
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 rounded-lg text-left"
                  >
                    <Edit2 className="w-4 h-4" /> Edit Goal
                  </button>
                  <div className="h-px bg-zinc-100 dark:bg-zinc-700/50 my-1" />
                  <button
                    onClick={handleDelete}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg text-left"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Goal
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl">
            <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">
              Progress
            </p>
            <p className={cn('text-3xl font-bold', theme.text)}>{progress}%</p>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl">
            <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">
              Tasks Done
            </p>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              {completedTasks}{' '}
              <span className="text-lg text-zinc-400 font-medium">/ {linkedTasks.length}</span>
            </p>
          </div>
          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-2xl">
            <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">
              Time Left
            </p>
            <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              {Math.max(0, differenceInDays(goal.endDate, new Date()))}{' '}
              <span className="text-lg text-zinc-400 font-medium">days</span>
            </p>
          </div>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Steps to Achieve This
        </h2>

        <div className="mb-6">
          <TaskInput
            placeholder={`Add a task for "${goal.title}"...`}
            defaultGoalId={goal.id}
            fixedGoal={true}
          />
          <p className="text-xs text-zinc-400 mt-2 pl-2">
            * New tasks will be automatically linked to this goal.
          </p>
        </div>

        <div className="space-y-2">
          {linkedTasks.length > 0 ? (
            linkedTasks.map(task => <TaskItem key={task.id} task={task} />)
          ) : (
            <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-800/30 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
              <p className="text-zinc-500">No tasks linked to this goal yet.</p>
              <p className="text-sm text-zinc-400">
                Start breaking down your goal into actionable steps!
              </p>
            </div>
          )}
        </div>
      </div>

      <GoalFormModal isOpen={isEditing} onClose={() => setIsEditing(false)} goal={goal} />
    </div>
  );
}
