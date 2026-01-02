'use client';

import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { useTaskStore } from '@/store/task.store';
import { useGoalStore } from '@/store/goal.store';
import { Plus, Calendar, Repeat, Target, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { DatePicker } from '@/components/ui/date-picker';
import { RepeatSelector } from '@/components/ui/repeat-selector';
import { Task, TaskListType } from '@/types';

interface TaskInputProps {
  listId?: TaskListType;
  placeholder?: string;
  autoFocus?: boolean;
  defaultGoalId?: string;
  fixedGoal?: boolean;
}

export function TaskInput({
  listId = 'inbox',
  placeholder = 'Add a task...',
  autoFocus = false,
  defaultGoalId,
  fixedGoal = false,
}: TaskInputProps) {
  const { addTask } = useTaskStore();
  const { goals } = useGoalStore();
  const [title, setTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [repeat, setRepeat] = useState<Task['repeat']>(undefined);
  const [priority, setPriority] = useState<Task['priority']>('medium');

  const [selectedGoalId, setSelectedGoalId] = useState<string>(
    fixedGoal && defaultGoalId ? defaultGoalId : ''
  );

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showRepeatSelector, setShowRepeatSelector] = useState(false);
  const [showGoalSelector, setShowGoalSelector] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeGoals = Object.values(goals).filter(g => !g.isDeleted && !g.completedAt);

  const handleSubmit = async () => {
    if (!title.trim()) return;

    await addTask(title.trim(), listId, {
      dueDate: dueDate?.getTime(),
      repeat,
      priority,
      goalId: selectedGoalId,
    });

    setTitle('');
    setDueDate(undefined);
    setRepeat(undefined);
    setPriority('medium');
    if (!fixedGoal) {
      setSelectedGoalId('');
    }
    setIsExpanded(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (!title) setIsExpanded(false);
        setShowDatePicker(false);
        setShowRepeatSelector(false);
        setShowGoalSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [title]);

  return (
    <div ref={containerRef} className="relative z-20 mb-6">
      <div
        className={cn(
          'bg-white dark:bg-zinc-900 border transition-all duration-200 overflow-visible',
          isExpanded
            ? 'rounded-2xl border-zinc-300 dark:border-zinc-700 shadow-lg ring-4 ring-zinc-100 dark:ring-zinc-800'
            : 'rounded-xl border-zinc-200 dark:border-zinc-800 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700'
        )}
      >
        <div className="flex items-center px-4 py-3">
          <div
            className={cn(
              'flex items-center justify-center w-6 h-6 rounded-full border-2 mr-3 transition-colors',
              isExpanded
                ? 'border-zinc-300 dark:border-zinc-600'
                : 'border-zinc-200 dark:border-zinc-700'
            )}
          >
            <Plus className={cn('w-4 h-4 text-zinc-400', isExpanded && 'text-zinc-500')} />
          </div>

          <input
            ref={inputRef}
            value={title}
            onChange={e => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="flex-1 bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 font-medium"
          />

          {title && (
            <button
              onClick={() => setTitle('')}
              className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className=""
            >
              <div className="px-4 pb-3 pt-1 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/50">
                <div className="flex items-center gap-1">
                  <div className="relative">
                    <button
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className={cn(
                        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border border-transparent',
                        dueDate
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border-blue-100 dark:border-blue-900/30'
                          : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      )}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      {dueDate
                        ? dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                        : 'Date'}
                    </button>
                    <div className="absolute top-full left-0 mt-2 z-50">
                      <DatePicker
                        isOpen={showDatePicker}
                        onClose={() => setShowDatePicker(false)}
                        date={dueDate}
                        setDate={setDueDate}
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowRepeatSelector(!showRepeatSelector)}
                      className={cn(
                        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border border-transparent',
                        repeat
                          ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 border-purple-100 dark:border-purple-900/30'
                          : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      )}
                    >
                      <Repeat className="w-3.5 h-3.5" />
                      {repeat ? repeat : 'Repeat'}
                    </button>
                    {showRepeatSelector && (
                      <RepeatSelector
                        value={repeat}
                        onChange={val => {
                          setRepeat(val);
                          if (val && !dueDate) {
                            const tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            setDueDate(tomorrow);
                          }
                        }}
                        onClose={() => setShowRepeatSelector(false)}
                      />
                    )}
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => !fixedGoal && setShowGoalSelector(!showGoalSelector)}
                      disabled={fixedGoal}
                      className={cn(
                        'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border border-transparent',
                        selectedGoalId
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30'
                          : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800',
                        fixedGoal && 'cursor-default opacity-100'
                      )}
                    >
                      <Target className="w-3.5 h-3.5" />
                      {selectedGoalId ? goals[selectedGoalId]?.title || 'Goal' : 'Goal'}
                    </button>

                    {showGoalSelector && (
                      <div className="absolute top-full left-0 mt-2 z-50 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 max-h-60 overflow-y-auto p-1">
                        {activeGoals.length > 0 ? (
                          activeGoals.map(g => (
                            <button
                              key={g.id}
                              onClick={() => {
                                setSelectedGoalId(g.id);
                                setShowGoalSelector(false);
                              }}
                              className={cn(
                                'w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 truncate',
                                selectedGoalId === g.id
                                  ? 'text-emerald-600 font-medium'
                                  : 'text-zinc-600 dark:text-zinc-300'
                              )}
                            >
                              {g.title}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 py-2 text-xs text-zinc-400 text-center">
                            No active goals
                          </div>
                        )}

                        {selectedGoalId && (
                          <button
                            onClick={() => {
                              setSelectedGoalId('');
                              setShowGoalSelector(false);
                            }}
                            className="w-full text-left px-3 py-2 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg border-t border-zinc-100 dark:border-zinc-800/50 mt-1"
                          >
                            Clear Goal
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!title.trim()}
                  className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50 transition-transform active:scale-95"
                >
                  Add Task
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
