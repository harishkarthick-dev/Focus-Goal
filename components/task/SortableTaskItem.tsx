'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskItem } from './TaskItem';
import { Task } from '@/types';
import { GripVertical } from 'lucide-react';

interface Props {
  task: Task;
}

export function SortableTaskItem({ task }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group/sortable touch-none">
      <div className="flex items-center gap-2">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 text-zinc-300 hover:text-zinc-500 dark:text-zinc-700 dark:hover:text-zinc-400 opacity-0 group-hover/sortable:opacity-100 transition-opacity"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        <div className="flex-1">
          <TaskItem task={task} />
        </div>
      </div>
    </div>
  );
}
