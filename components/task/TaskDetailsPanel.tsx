'use client';

import { useState } from 'react';
import { useTaskStore } from '@/store/task.store';
import { useGoalStore } from '@/store/goal.store';
import { format } from 'date-fns';
import { X, Sun, Calendar, Repeat, Target, Plus, Trash2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DatePicker } from '@/components/ui/date-picker';
import { RepeatSelector } from '@/components/ui/repeat-selector';
import { Task } from '@/types';

export function TaskDetailsPanel() {
  const { tasks, selectedTaskId, selectTask, updateTask, deleteTask, toggleTask } = useTaskStore();

  const { goals } = useGoalStore();

  const task = selectedTaskId ? tasks[selectedTaskId] : null;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showRepeatSelector, setShowRepeatSelector] = useState(false);
  const [showGoalSelector, setShowGoalSelector] = useState(false);

  if (!selectedTaskId || !task) return null;

  const handleClose = () => selectTask(null);

  const handleUpdate = (updates: Partial<Task>) => {
    if (task) {
      updateTask(task.id, updates);
    }
  };

  const activeGoals = Object.values(goals).filter(g => !g.isDeleted && !g.completedAt);

  return (
    <AnimatePresence>
      {selectedTaskId && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/20 dark:bg-black/50 z-[90] backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-zinc-900 shadow-2xl z-[100] flex flex-col border-l border-zinc-200 dark:border-zinc-800"
          >
            <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={cn(
                    'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                    task.completed
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-zinc-300 dark:border-zinc-600 hover:border-emerald-500'
                  )}
                >
                  {task.completed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2.5 h-2.5 bg-white rounded-full"
                    />
                  )}
                </button>
                <input
                  value={task.title}
                  onChange={e => handleUpdate({ title: e.target.value })}
                  className="text-lg font-semibold bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 w-full"
                />
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <div className="space-y-1">
                {Object.values(tasks)
                  .filter(t => t.parentId === task.id && !t.isDeleted)
                  .sort((a, b) => a.createdAt - b.createdAt)
                  .map(subTask => (
                    <div
                      key={subTask.id}
                      className="group flex items-center gap-3 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg group"
                    >
                      <button
                        onClick={() => toggleTask(subTask.id)}
                        className={cn(
                          'w-4 h-4 rounded-full border flex items-center justify-center transition-colors',
                          subTask.completed
                            ? 'bg-blue-500 border-blue-500 text-white'
                            : 'border-zinc-300 dark:border-zinc-600 hover:border-blue-500'
                        )}
                      >
                        {subTask.completed && <Check className="w-2.5 h-2.5" />}
                      </button>
                      <input
                        value={subTask.title}
                        onChange={e => updateTask(subTask.id, { title: e.target.value })}
                        className={cn(
                          'flex-1 bg-transparent border-none outline-none text-sm text-zinc-700 dark:text-zinc-200',
                          subTask.completed && 'line-through text-zinc-400'
                        )}
                      />
                      <button
                        onClick={() => {
                          if (confirm('Delete step?')) {
                            deleteTask(subTask.id);
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-500 transition-opacity"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                <div className="flex items-center gap-3 w-full p-2">
                  <Plus className="w-5 h-5 text-blue-600" />
                  <input
                    placeholder="Add step"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        const val = (e.target as HTMLInputElement).value.trim();
                        if (val) {
                          useTaskStore.getState().addTask(val, task.listId, {
                            parentId: task.id,
                            priority: task.priority,
                          });
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                    className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-blue-600 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>
              <button
                onClick={() =>
                  handleUpdate({
                    isMyDay: !task.isMyDay,
                    listId: !task.isMyDay ? 'my-day' : 'inbox',
                  })
                }
                className={cn(
                  'flex items-center gap-3 w-full p-3 rounded-lg transition-colors text-left',
                  task.isMyDay
                    ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-600 dark:text-zinc-300'
                )}
              >
                <Sun className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {task.isMyDay ? 'Added to My Day' : 'Add to My Day'}
                </span>
              </button>

              <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-2" />
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <div className="relative border-b border-zinc-100 dark:border-zinc-800/50">
                  <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="flex items-center justify-between w-full p-3 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-colors text-left rounded-t-xl"
                  >
                    <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
                      <Calendar className="w-4 h-4" />
                      <span
                        className={cn(
                          'text-sm',
                          task.dueDate && 'text-blue-600 dark:text-blue-400 font-medium'
                        )}
                      >
                        {task.dueDate ? format(task.dueDate, 'EEE, MMM d') : 'Add due date'}
                      </span>
                    </div>
                    {task.dueDate && (
                      <div
                        role="button"
                        onClick={e => {
                          e.stopPropagation();
                          handleUpdate({ dueDate: undefined });
                        }}
                        className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-full"
                      >
                        <X className="w-3 h-3 text-zinc-400" />
                      </div>
                    )}
                  </button>
                  {showDatePicker && (
                    <div className="absolute top-full left-0 mt-1 z-20 shadow-xl rounded-xl">
                      <DatePicker
                        isOpen={showDatePicker}
                        onClose={() => setShowDatePicker(false)}
                        date={task.dueDate ? new Date(task.dueDate) : undefined}
                        setDate={date => handleUpdate({ dueDate: date?.getTime() })}
                      />
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowRepeatSelector(!showRepeatSelector)}
                    className="flex items-center justify-between w-full p-3 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-colors text-left rounded-b-xl"
                  >
                    <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
                      <Repeat className="w-4 h-4" />
                      <span
                        className={cn(
                          'text-sm',
                          task.repeat && 'text-purple-600 dark:text-purple-400 font-medium'
                        )}
                      >
                        {task.repeat ? `Repeat ${task.repeat}` : 'Repeat'}
                      </span>
                    </div>
                    {task.repeat && (
                      <div
                        role="button"
                        onClick={e => {
                          e.stopPropagation();
                          handleUpdate({ repeat: undefined });
                        }}
                        className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-full"
                      >
                        <X className="w-3 h-3 text-zinc-400" />
                      </div>
                    )}
                  </button>
                  {showRepeatSelector && (
                    <div className="absolute top-full left-0 mt-1 z-20">
                      <RepeatSelector
                        value={task.repeat}
                        onChange={val => {
                          handleUpdate({ repeat: val });
                          if (val && !task.dueDate) {
                            const tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            handleUpdate({ dueDate: tomorrow.getTime() });
                          }
                        }}
                        onClose={() => setShowRepeatSelector(false)}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-2" />
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                <div className="relative">
                  <button
                    onClick={() => setShowGoalSelector(!showGoalSelector)}
                    className="flex items-center justify-between w-full p-3 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 transition-colors text-left rounded-xl"
                  >
                    <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
                      <Target className="w-4 h-4" />
                      <span
                        className={cn(
                          'text-sm',
                          task.goalId && 'text-emerald-600 dark:text-emerald-400 font-medium'
                        )}
                      >
                        {task.goalId
                          ? goals[task.goalId]?.title || 'Unknown Goal'
                          : 'Assign to a goal'}
                      </span>
                    </div>
                  </button>

                  <AnimatePresence>
                    {showGoalSelector && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 w-full z-20 bg-white dark:bg-zinc-800 shadow-xl rounded-xl border border-zinc-200 dark:border-zinc-700 max-h-48 overflow-y-auto mt-1"
                      >
                        {activeGoals.map(goal => (
                          <button
                            key={goal.id}
                            onClick={() => {
                              handleUpdate({ goalId: goal.id });
                              setShowGoalSelector(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 flex items-center gap-2"
                          >
                            <div className={cn('w-2 h-2 rounded-full', `bg-${goal.color}-500`)} />
                            {goal.title}
                          </button>
                        ))}
                        {task.goalId && (
                          <button
                            onClick={() => {
                              handleUpdate({ goalId: undefined });
                              setShowGoalSelector(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-rose-50 dark:hover:bg-rose-900/10 text-rose-500 border-t border-zinc-100 dark:border-zinc-700"
                          >
                            Remove from goal
                          </button>
                        )}
                        {activeGoals.length === 0 && !task.goalId && (
                          <div className="px-4 py-2 text-sm text-zinc-400 text-center">
                            No active goals
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-2" />
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 min-h-[100px] flex flex-col">
                <textarea
                  key={task.id}
                  defaultValue={task.note || ''}
                  onBlur={e => handleUpdate({ note: e.target.value })}
                  placeholder="Add a note..."
                  className="w-full h-full min-h-[120px] p-3 bg-transparent border-none outline-none resize-none text-sm text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400"
                />
              </div>
            </div>
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
              <span>Created {format(task.createdAt, 'MMM d, yyyy')}</span>
              <button
                onClick={() => {
                  if (confirm('Delete this task?')) {
                    deleteTask(task.id);
                    handleClose();
                  }
                }}
                className="p-2 hover:bg-rose-50 dark:hover:bg-rose-900/10 text-zinc-400 hover:text-rose-500 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
