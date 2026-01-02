'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar } from 'lucide-react';
import { useGoalStore } from '@/store/goal.store';
import { Goal } from '@/types';
import { cn } from '@/lib/utils';
import { DatePicker } from '@/components/ui/date-picker';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  format,
} from 'date-fns';

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal?: Goal;
}

const COLORS = [
  { name: 'blue', class: 'bg-blue-500', text: 'text-blue-500' },
  { name: 'emerald', class: 'bg-emerald-500', text: 'text-emerald-500' },
  { name: 'violet', class: 'bg-violet-500', text: 'text-violet-500' },
  { name: 'amber', class: 'bg-amber-500', text: 'text-amber-500' },
  { name: 'rose', class: 'bg-rose-500', text: 'text-rose-500' },
  { name: 'cyan', class: 'bg-cyan-500', text: 'text-cyan-500' },
];

const PERIODS = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
  { label: 'Custom', value: 'custom' },
];

export function GoalFormModal({ isOpen, onClose, goal }: GoalFormModalProps) {
  const { addGoal, updateGoal } = useGoalStore();

  const [title, setTitle] = useState(goal?.title || '');
  const [type, setType] = useState<Goal['type']>(goal?.type || 'daily');
  const [startDate, setStartDate] = useState<Date>(goal ? new Date(goal.startDate) : new Date());

  const [endDate, setEndDate] = useState<Date>(
    goal
      ? new Date(goal.endDate)
      : (() => {
          const d = new Date();
          d.setDate(d.getDate() + 7);
          return d;
        })()
  );
  const [color, setColor] = useState(goal?.color || 'blue');

  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);

  const handleTypeChange = (newType: string) => {
    setType(newType as Goal['type']);
    const now = new Date();
    if (newType === 'weekly') {
      setStartDate(startOfWeek(now, { weekStartsOn: 1 }));
      setEndDate(endOfWeek(now, { weekStartsOn: 1 }));
    } else if (newType === 'monthly') {
      setStartDate(startOfMonth(now));
      setEndDate(endOfMonth(now));
    } else if (newType === 'yearly') {
      setStartDate(startOfYear(now));
      setEndDate(endOfYear(now));
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;

    if (goal) {
      await updateGoal(goal.id, {
        title,
        type,
        startDate: startDate.getTime(),
        endDate: endDate.getTime(),
        color,
      });
    } else {
      await addGoal(title, type, startDate.getTime(), endDate.getTime());
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/20 dark:bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif font-bold text-zinc-900 dark:text-zinc-50">
                  {goal ? 'Edit Goal' : 'New Goal'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-500" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Goal Title
                  </label>
                  <input
                    autoFocus
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g., Run 50km this month"
                    className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 outline-none text-lg transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Time Period
                  </label>
                  <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden">
                    {PERIODS.map(p => (
                      <button
                        key={p.value}
                        onClick={() => handleTypeChange(p.value)}
                        className={cn(
                          'flex-1 py-1.5 text-sm font-medium rounded-lg transition-all',
                          type === p.value
                            ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 shadow-sm'
                            : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                        )}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Start Date
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => {
                          if (type !== 'custom') return;
                          setOpenStartDate(!openStartDate);
                          setOpenEndDate(false);
                        }}
                        disabled={type !== 'custom'}
                        className={cn(
                          'w-full flex items-center gap-2 px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none text-left transition-all',
                          type === 'custom'
                            ? 'hover:border-zinc-300 dark:hover:border-zinc-600 cursor-pointer'
                            : 'opacity-70 cursor-not-allowed',
                          openStartDate &&
                            'ring-2 ring-zinc-900 dark:ring-zinc-100 border-transparent'
                        )}
                      >
                        <Calendar className="w-4 h-4 text-zinc-400" />
                        <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                          {format(startDate, 'MMM d, yyyy')}
                        </span>
                      </button>
                      <DatePicker
                        isOpen={openStartDate}
                        onClose={() => setOpenStartDate(false)}
                        date={startDate}
                        setDate={d => {
                          if (d) setStartDate(d);
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      End Date
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => {
                          if (type !== 'custom') return;
                          setOpenEndDate(!openEndDate);
                          setOpenStartDate(false);
                        }}
                        disabled={type !== 'custom'}
                        className={cn(
                          'w-full flex items-center gap-2 px-4 py-3 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none text-left transition-all',
                          type === 'custom'
                            ? 'hover:border-zinc-300 dark:hover:border-zinc-600 cursor-pointer'
                            : 'opacity-70 cursor-not-allowed',
                          openEndDate &&
                            'ring-2 ring-zinc-900 dark:ring-zinc-100 border-transparent'
                        )}
                      >
                        <Calendar className="w-4 h-4 text-zinc-400" />
                        <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                          {format(endDate, 'MMM d, yyyy')}
                        </span>
                      </button>
                      <DatePicker
                        isOpen={openEndDate}
                        onClose={() => setOpenEndDate(false)}
                        date={endDate}
                        setDate={d => {
                          if (d) setEndDate(d);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Color Theme
                  </label>
                  <div className="flex gap-3">
                    {COLORS.map(c => (
                      <button
                        key={c.name}
                        onClick={() => setColor(c.name)}
                        className={cn(
                          'w-8 h-8 rounded-full transition-transform hover:scale-110 focus:scale-110 outline-none ring-2 ring-offset-2 dark:ring-offset-zinc-900',
                          c.class,
                          color === c.name
                            ? 'ring-zinc-400 dark:ring-zinc-500 scale-110'
                            : 'ring-transparent'
                        )}
                        aria-label={`Select ${c.name} color`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!title.trim()}
                  className="px-5 py-2.5 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-lg shadow-zinc-900/10"
                >
                  {goal ? 'Save Changes' : 'Create Goal'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
