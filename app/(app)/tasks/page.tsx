'use client';

import { TaskInput } from '@/components/task/TaskInput';
import { SortableTaskItem } from '@/components/task/SortableTaskItem';
import { EmptyState } from '@/components/ui/empty-state';
import { useTaskStore } from '@/store/task.store';
import { PageHeader } from '@/components/ui/page-header';
import { CheckSquare } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

export default function TasksPage() {
  const { tasks, isLoading, reorderTasks } = useTaskStore();

  const taskList = Object.values(tasks)
    .filter(t => !t.isDeleted)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderTasks(active.id as string, over.id as string);
    }
  };

  if (isLoading && taskList.length === 0) {
    return <div className="p-8 text-zinc-400">Loading your tasks...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <div className="pr-20 md:pr-0">
        <PageHeader
          title="Tasks"
          subtitle="Capture your ideas and to-dos."
          icon={CheckSquare}
          iconColor="text-blue-600"
        />
      </div>

      <TaskInput listId="inbox" />

      <div className="space-y-1 mt-8">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={taskList.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <AnimatePresence mode="popLayout">
              {taskList.length === 0 && !isLoading ? (
                <EmptyState
                  icon={CheckSquare}
                  title="All caught up!"
                  description="You have no tasks on your list. Enjoy your day or add a new task above."
                />
              ) : (
                taskList.map(task => <SortableTaskItem key={task.id} task={task} />)
              )}
            </AnimatePresence>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
