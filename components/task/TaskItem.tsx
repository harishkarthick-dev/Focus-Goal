'use client';

import { useState } from 'react';
import { Task } from '@/types';
import { useTaskStore } from '@/store/task.store';
import { useGoalStore } from '@/store/goal.store';
import { cn } from '@/lib/utils';
import { Check, Trash2, Calendar, Star, Repeat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '@/hooks/useSound';
import confetti from 'canvas-confetti';
import { DatePicker } from '@/components/ui/date-picker';
import { RepeatSelector } from '@/components/ui/repeat-selector';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const toggleTask = useTaskStore(state => state.toggleTask);
  const tasks = useTaskStore(state => state.tasks);
  const deleteTask = useTaskStore(state => state.deleteTask);
  const updateTask = useTaskStore(state => state.updateTask);
  const goals = useGoalStore(state => state.goals);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showRepeatSelector, setShowRepeatSelector] = useState(false);

  const { play: playSuccess } = useSound(
    'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
    { volume: 0.5 }
  );

  const isCompleted = task.completed;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCompleted) {
      playSuccess();
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#3b82f6', '#10b981', '#f59e0b'],
        disableForReducedMotion: true,
      });
    }
    toggleTask(task.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.002, y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => useTaskStore.getState().selectTask(task.id)}
      className="group flex items-center gap-3 p-3.5 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200/60 dark:border-zinc-800 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md transition-all mb-2 cursor-pointer"
    >
      <button
        onClick={handleToggle}
        className={cn(
          'w-5 h-5 rounded-full border flex items-center justify-center transition-colors',
          isCompleted
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : 'border-zinc-300 dark:border-zinc-600 hover:border-blue-400 dark:hover:border-blue-400 text-transparent'
        )}
      >
        <Check className="w-3.5 h-3.5" strokeWidth={3} />
      </button>
      <div className="flex-1 min-w-0">
        <span
          className={cn(
            'block text-sm transition-colors truncate',
            isCompleted
              ? 'text-zinc-400 dark:text-zinc-500 line-through'
              : 'text-zinc-900 dark:text-zinc-100'
          )}
        >
          {task.title}
        </span>
        <div className="flex flex-wrap items-center gap-2 mt-0.5">
          {task.isMyDay && !isCompleted && (
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-amber-500"></div>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">My Day</span>
            </div>
          )}
          {task.goalId && goals[task.goalId] && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-md">
              <div
                className={`w-1 h-1 rounded-full bg-${goals[task.goalId].color || 'blue'}-500`}
              />
              <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 max-w-[80px] truncate">
                {goals[task.goalId].title}
              </span>
            </div>
          )}
          {task.parentId && tasks[task.parentId] && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-md">
              <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 max-w-[80px] truncate">
                ↳ {tasks[task.parentId].title}
              </span>
            </div>
          )}
          {(task.dueDate || showDatePicker) && (
            <div className="relative">
              <button
                onClick={e => {
                  e.stopPropagation();
                  setShowDatePicker(!showDatePicker);
                  setShowRepeatSelector(false);
                }}
                className={cn(
                  'flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium transition-colors',
                  task.dueDate && isPast(task.dueDate) && !isToday(task.dueDate) && !task.completed
                    ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                    : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                )}
              >
                <Calendar className="w-3 h-3" />
                <span>
                  {task.dueDate
                    ? isToday(task.dueDate)
                      ? 'Today'
                      : isTomorrow(task.dueDate)
                        ? 'Tomorrow'
                        : format(task.dueDate, 'MMM d')
                    : 'Set date'}
                </span>
              </button>
              <AnimatePresence>
                {showDatePicker && (
                  <div onClick={e => e.stopPropagation()}>
                    <DatePicker
                      date={task.dueDate ?? undefined}
                      onChange={date => updateTask(task.id, { dueDate: date })}
                      onClose={() => setShowDatePicker(false)}
                    />
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
          {(task.repeat || showRepeatSelector) && (
            <div className="relative">
              <button
                onClick={e => {
                  e.stopPropagation();
                  setShowRepeatSelector(!showRepeatSelector);
                  setShowDatePicker(false);
                }}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 transition-colors"
              >
                <Repeat className="w-3 h-3" />
                <span className="capitalize">{task.repeat || 'Repeat'}</span>
              </button>
              <AnimatePresence>
                {showRepeatSelector && (
                  <div onClick={e => e.stopPropagation()}>
                    <RepeatSelector
                      value={task.repeat}
                      onChange={val => updateTask(task.id, { repeat: val })}
                      onClose={() => setShowRepeatSelector(false)}
                    />
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
        {!task.dueDate && !showDatePicker && (
          <button
            onClick={e => {
              e.stopPropagation();
              setShowDatePicker(true);
              setShowRepeatSelector(false);
            }}
            className="p-1.5 text-zinc-400 dark:text-zinc-500 hover:text-blue-500 dark:hover:text-blue-400 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
            title="Set Due Date"
          >
            <Calendar className="w-4 h-4" />
          </button>
        )}
        {!task.repeat && !showRepeatSelector && (
          <button
            onClick={e => {
              e.stopPropagation();
              setShowRepeatSelector(true);
              setShowDatePicker(false);
            }}
            className="p-1.5 text-zinc-400 dark:text-zinc-500 hover:text-purple-500 dark:hover:text-purple-400 rounded hover:bg-purple-50 dark:hover:bg-purple-900/20"
            title="Repeat Task"
          >
            <Repeat className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={e => {
            e.stopPropagation();
            updateTask(task.id, { priority: task.priority === 'high' ? 'medium' : 'high' });
          }}
          className={cn(
            'p-1.5 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800',
            task.priority === 'high' ? 'text-amber-500' : 'text-zinc-400 dark:text-zinc-500'
          )}
        >
          <Star className={cn('w-4 h-4', task.priority === 'high' && 'fill-current')} />
        </button>
        <button
          onClick={e => {
            e.stopPropagation();
            deleteTask(task.id);
          }}
          className="p-1.5 text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
