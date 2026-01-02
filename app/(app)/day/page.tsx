'use client';

import { TaskInput } from '@/components/task/TaskInput';
import { TaskItem } from '@/components/task/TaskItem';
import { useTaskStore } from '@/store/task.store';
import { PageHeader } from '@/components/ui/page-header';
import { AnimatePresence } from 'framer-motion';
import { Sun } from 'lucide-react';
import { format, isToday, isBefore, startOfToday } from 'date-fns';

export default function MyDayPage() {
  const { tasks, isLoading } = useTaskStore();

  const todayStart = startOfToday();

  const taskList = Object.values(tasks)
    .filter(
      t =>
        !t.isDeleted &&
        (t.isMyDay ||
          t.listId === 'my-day' ||
          (t.dueDate && isToday(t.dueDate)) ||
          (t.dueDate && isBefore(t.dueDate, todayStart) && !t.completed))
    )
    .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));

  const today = format(new Date(), 'EEEE, MMMM d');

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="pr-20 md:pr-0">
        <PageHeader title="My Day" subtitle={today} icon={Sun} iconColor="text-amber-500" />
      </div>

      <TaskInput listId="my-day" placeholder="Add a task to your day" />

      <div className="space-y-1">
        <AnimatePresence mode="popLayout">
          {taskList.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </AnimatePresence>

        {taskList.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
            <div className="w-24 h-24 bg-amber-50 dark:bg-amber-900/10 rounded-full flex items-center justify-center mb-4">
              <Sun className="w-10 h-10 text-amber-200 dark:text-amber-500/50" />
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">Your day is clear.</p>
            <p className="text-zinc-400 dark:text-zinc-500 text-sm">
              Focus on what&apos;s important today.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
