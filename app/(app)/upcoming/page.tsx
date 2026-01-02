'use client';

import { TaskItem } from '@/components/task/TaskItem';
import { useTaskStore } from '@/store/task.store';
import { PageHeader } from '@/components/ui/page-header';
import { CalendarDays } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export default function UpcomingPage() {
  const { tasks } = useTaskStore();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const taskList = Object.values(tasks)
    .filter(t => !t.isDeleted && !t.completed && t.dueDate && t.dueDate >= today.getTime())
    .sort((a, b) => (a.dueDate || 0) - (b.dueDate || 0));

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="pr-16 md:pr-36">
        <PageHeader
          title="Upcoming"
          subtitle="Plan effectively for what's next."
          icon={CalendarDays}
          iconColor="text-purple-600"
        />
      </div>

      <div className="space-y-1">
        <AnimatePresence mode="popLayout">
          {taskList.length === 0 ? (
            <div className="text-center py-12 text-zinc-400">
              <p>No upcoming deadlines. You&apos;re free! 🎉</p>
            </div>
          ) : (
            taskList.map(task => <TaskItem key={task.id} task={task} />)
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
