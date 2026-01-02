'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  format,
  addDays,
  startOfToday,
  startOfWeek,
  addWeeks,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  date?: number | Date;
  onChange?: (date?: number) => void;
  setDate?: (date?: Date) => void;
  onClose?: () => void;
  isOpen?: boolean;
  disabled?: boolean;
}

export function DatePicker({
  date,
  onChange,
  setDate,
  onClose,
  isOpen,
  disabled,
}: DatePickerProps) {
  const today = startOfToday();
  const dateValue = date instanceof Date ? date : date ? new Date(date) : undefined;
  const [currentMonth, setCurrentMonth] = useState(() => dateValue || today);

  if (isOpen !== undefined && !isOpen) {
    return null;
  }

  if (disabled) {
    return (
      <div className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-sm text-zinc-500 cursor-not-allowed">
        {dateValue ? format(dateValue, 'MMM d, yyyy') : 'Select date'}
      </div>
    );
  }

  const quickActions = [
    { label: 'Today', date: today },
    { label: 'Tomorrow', date: addDays(today, 1) },
    { label: 'Next Week', date: startOfWeek(addWeeks(today, 1), { weekStartsOn: 1 }) },
  ];

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDateCal = startOfWeek(monthStart);
  const endDateCal = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDateCal,
    end: endDateCal,
  });

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const selectDate = (d: Date) => {
    if (onChange) {
      onChange(d.getTime());
    }
    if (setDate) {
      setDate(d);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-800 w-[320px] overflow-hidden p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="font-semibold text-zinc-800 dark:text-zinc-200">
          {format(currentMonth, 'MMMM yyyy')}
        </div>
        <button
          onClick={nextMonth}
          className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar">
        {quickActions.map(action => (
          <button
            key={action.label}
            onClick={() => selectDate(action.date)}
            className="flex-shrink-0 text-xs font-medium px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors"
          >
            {action.label}
          </button>
        ))}
        {date && (
          <button
            onClick={() => {
              if (onChange) onChange(undefined);
              if (setDate) setDate(undefined);
              if (onClose) onClose();
            }}
            className="flex-shrink-0 text-xs font-medium px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div
            key={day}
            className="text-center text-[10px] font-medium text-zinc-400 uppercase tracking-wider py-1"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, _dayIdx) => {
          const isSelected = date ? isSameDay(day, date) : false;
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isTodayDate = isToday(day);

          return (
            <button
              key={day.toString()}
              onClick={() => selectDate(day)}
              className={cn(
                'relative h-9 w-9 text-sm rounded-lg flex items-center justify-center transition-all',
                !isCurrentMonth && 'text-zinc-300 dark:text-zinc-700',
                isCurrentMonth &&
                  !isSelected &&
                  'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800',
                isSelected && 'bg-blue-500 text-white shadow-md shadow-blue-500/20 font-medium',
                isTodayDate &&
                  !isSelected &&
                  'text-blue-500 font-semibold bg-blue-50 dark:bg-blue-900/10'
              )}
            >
              {format(day, 'd')}
              {isTodayDate && !isSelected && (
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500" />
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
