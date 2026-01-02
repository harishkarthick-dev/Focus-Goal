import { create } from 'zustand';
import { Task, TaskListType } from '@/types';
import { dbPromise } from '@/lib/offline/db';
import { performLocalAction, performLocalDelete } from '@/lib/offline/actions';
import { v4 as uuidv4 } from 'uuid';
import { useUserStore } from './user.store';

interface TaskState {
  tasks: Record<string, Task>;
  isLoading: boolean;
  loadTasks: () => Promise<void>;
  addTask: (
    title: string,
    listId?: TaskListType,
    options?: {
      dueDate?: number;
      repeat?: Task['repeat'];
      priority?: Task['priority'];
      goalId?: string;
      parentId?: string;
    }
  ) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  reorderTasks: (activeId: string, overId: string) => Promise<void>;
  selectedTaskId: string | null;
  selectTask: (id: string | null) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: {},
  isLoading: true,
  selectedTaskId: null,

  selectTask: id => set({ selectedTaskId: id }),

  loadTasks: async () => {
    set({ isLoading: true });
    try {
      const db = await dbPromise;
      if (!db) return;

      const allTasks = await db.getAll('tasks');
      const taskMap: Record<string, Task> = {};
      allTasks.forEach((t: Task) => {
        taskMap[t.id] = t;
      });

      set({ tasks: taskMap, isLoading: false });
    } catch (error) {
      console.error('Failed to load tasks', error);
      set({ isLoading: false });
    }
  },

  addTask: async (title: string, listId = 'inbox', options) => {
    const { currentUser } = useUserStore.getState();
    const userId = currentUser?.id || 'guest';

    const newTask: Task = {
      id: uuidv4(),
      userId,
      title,
      completed: false,
      priority: options?.priority || 'medium',
      listId,
      dueDate: options?.dueDate,
      repeat: options?.repeat,
      goalId: options?.goalId,
      parentId: options?.parentId,
      steps: [],
      isMyDay: listId === 'my-day',
      order: Date.now(),
      isDeleted: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      syncStatus: 'pending',
    };

    set(state => ({
      tasks: { ...state.tasks, [newTask.id]: newTask },
    }));

    await performLocalAction('tasks', newTask, 'CREATE', 'TASK');
  },

  updateTask: async (id: string, updates: Partial<Task>) => {
    const currentTask = get().tasks[id];
    if (!currentTask) return;

    const updatedTask = {
      ...currentTask,
      ...updates,
      updatedAt: Date.now(),
      syncStatus: 'pending' as const,
    };

    set(state => ({
      tasks: { ...state.tasks, [id]: updatedTask },
    }));

    await performLocalAction('tasks', updatedTask, 'UPDATE', 'TASK');
  },

  toggleTask: async (id: string) => {
    const task = get().tasks[id];
    if (task) {
      const completed = !task.completed;

      await get().updateTask(id, {
        completed,
        completedAt: completed ? Date.now() : undefined,
      });

      if (completed && task.repeat && task.repeat !== 'custom' && task.dueDate) {
        const nextDueDate = new Date(task.dueDate);

        switch (task.repeat) {
          case 'daily':
            nextDueDate.setDate(nextDueDate.getDate() + 1);
            break;
          case 'weekly':
            nextDueDate.setDate(nextDueDate.getDate() + 7);
            break;
          case 'monthly':
            nextDueDate.setMonth(nextDueDate.getMonth() + 1);
            break;
          case 'yearly':
            nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
            break;
        }

        await get().addTask(task.title, task.listId, {
          dueDate: nextDueDate.getTime(),
          repeat: task.repeat,
          priority: task.priority,
        });
      }
    }
  },

  deleteTask: async (id: string) => {
    set(state => {
      const newTasks = { ...state.tasks };
      delete newTasks[id];
      return { tasks: newTasks };
    });

    await performLocalDelete('tasks', id, 'TASK');
  },

  reorderTasks: async (activeId: string, overId: string) => {
    const state = get();
    const tasksArray = Object.values(state.tasks).sort((a, b) => (b.order || 0) - (a.order || 0));

    const oldIndex = tasksArray.findIndex(t => t.id === activeId);
    const newIndex = tasksArray.findIndex(t => t.id === overId);

    if (oldIndex === -1 || newIndex === -1) return;

    const [movedItem] = tasksArray.splice(oldIndex, 1);
    tasksArray.splice(newIndex, 0, movedItem);

    const updates: Record<string, Partial<Task>> = {};
    tasksArray.forEach((t, index) => {
      const newOrder = index;
      if (t.order !== newOrder) {
        updates[t.id] = { order: newOrder };
        state.tasks[t.id].order = newOrder;
      }
    });

    set({ tasks: { ...state.tasks } });

    for (const [id, update] of Object.entries(updates)) {
      await performLocalAction('tasks', { ...state.tasks[id], ...update }, 'UPDATE', 'TASK');
    }
  },
}));
