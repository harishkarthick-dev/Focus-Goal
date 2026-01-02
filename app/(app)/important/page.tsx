'use client';

import { TaskItem } from '@/components/task/TaskItem';
import { useTaskStore } from '@/store/task.store';
import { PageHeader } from '@/components/ui/page-header';
import { Star } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export default function ImportantPage() {
  const { tasks } = useTaskStore();

  const taskList = Object.values(tasks)
    .filter(t => !t.isDeleted && !t.completed && t.priority === 'high')
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="pr-16 md:pr-36">
        <PageHeader
          title="Important"
          subtitle="High priority tasks that need attention."
          icon={Star}
          iconColor="text-amber-500"
        />
      </div>

      <div className="space-y-1">
        <AnimatePresence mode="popLayout">
          {taskList.length === 0 ? (
            <div className="text-center py-12 text-zinc-400">
              <p>No critical tasks. Nice work! ⭐</p>
            </div>
          ) : (
            taskList.map(task => <TaskItem key={task.id} task={task} />)
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
