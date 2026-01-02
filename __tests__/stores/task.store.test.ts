import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTaskStore } from '@/store/task.store';

vi.mock('uuid', () => ({
  v4: () => 'test-uuid-1234',
}));

describe('useTaskStore', () => {
  beforeEach(() => {
    useTaskStore.setState({ tasks: {}, isLoading: false });
  });

  describe('initial state', () => {
    it('should have empty tasks object', () => {
      const { tasks } = useTaskStore.getState();
      expect(tasks).toEqual({});
    });

    it('should have isLoading as false after reset', () => {
      const { isLoading } = useTaskStore.getState();
      expect(isLoading).toBe(false);
    });
  });

  describe('addTask', () => {
    it('should add a task to the store', async () => {
      const { addTask } = useTaskStore.getState();

      await addTask('Test Task', 'inbox');

      const { tasks } = useTaskStore.getState();
      const taskValues = Object.values(tasks);

      expect(taskValues).toHaveLength(1);
      expect(taskValues[0].title).toBe('Test Task');
      expect(taskValues[0].listId).toBe('inbox');
      expect(taskValues[0].completed).toBe(false);
    });

    it('should add task with options', async () => {
      const { addTask } = useTaskStore.getState();
      const dueDate = Date.now() + 86400000;

      await addTask('Task with options', 'my-day', {
        dueDate,
        priority: 'high',
        repeat: 'daily',
      });

      const { tasks } = useTaskStore.getState();
      const taskValues = Object.values(tasks);

      expect(taskValues[0].priority).toBe('high');
      expect(taskValues[0].dueDate).toBe(dueDate);
      expect(taskValues[0].repeat).toBe('daily');
      expect(taskValues[0].isMyDay).toBe(true);
    });

    it('should use default priority of medium', async () => {
      const { addTask } = useTaskStore.getState();

      await addTask('Task without priority', 'inbox');

      const { tasks } = useTaskStore.getState();
      const taskValues = Object.values(tasks);

      expect(taskValues[0].priority).toBe('medium');
    });

    it('should set isMyDay to true for my-day list', async () => {
      const { addTask } = useTaskStore.getState();

      await addTask('My Day Task', 'my-day');

      const { tasks } = useTaskStore.getState();
      const taskValues = Object.values(tasks);

      expect(taskValues[0].isMyDay).toBe(true);
    });

    it('should set syncStatus to pending', async () => {
      const { addTask } = useTaskStore.getState();

      await addTask('Sync Test Task', 'inbox');

      const { tasks } = useTaskStore.getState();
      const taskValues = Object.values(tasks);

      expect(taskValues[0].syncStatus).toBe('pending');
    });

    it('should set isDeleted to false', async () => {
      const { addTask } = useTaskStore.getState();

      await addTask('Not Deleted Task', 'inbox');

      const { tasks } = useTaskStore.getState();
      const taskValues = Object.values(tasks);

      expect(taskValues[0].isDeleted).toBe(false);
    });

    it('should set timestamps', async () => {
      const beforeTime = Date.now();
      const { addTask } = useTaskStore.getState();

      await addTask('Timestamp Test Task', 'inbox');

      const afterTime = Date.now();
      const { tasks } = useTaskStore.getState();
      const taskValues = Object.values(tasks);

      expect(taskValues[0].createdAt).toBeGreaterThanOrEqual(beforeTime);
      expect(taskValues[0].createdAt).toBeLessThanOrEqual(afterTime);
      expect(taskValues[0].updatedAt).toBeGreaterThanOrEqual(beforeTime);
      expect(taskValues[0].updatedAt).toBeLessThanOrEqual(afterTime);
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      useTaskStore.setState({
        tasks: {
          'task-1': {
            id: 'task-1',
            userId: 'guest',
            title: 'Original Title',
            completed: false,
            priority: 'medium',
            listId: 'inbox',
            steps: [],
            isMyDay: false,
            order: 0,
            isDeleted: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        },
      });

      const { updateTask } = useTaskStore.getState();
      await updateTask('task-1', { title: 'Updated Title', priority: 'high' });

      const { tasks } = useTaskStore.getState();
      expect(tasks['task-1'].title).toBe('Updated Title');
      expect(tasks['task-1'].priority).toBe('high');
    });

    it('should not update non-existent task', async () => {
      const { updateTask } = useTaskStore.getState();
      await updateTask('non-existent', { title: 'New Title' });

      const { tasks } = useTaskStore.getState();
      expect(Object.keys(tasks)).toHaveLength(0);
    });

    it('should update syncStatus to pending', async () => {
      useTaskStore.setState({
        tasks: {
          'task-1': {
            id: 'task-1',
            userId: 'guest',
            title: 'Original Title',
            completed: false,
            priority: 'medium',
            listId: 'inbox',
            steps: [],
            isMyDay: false,
            order: 0,
            isDeleted: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            syncStatus: 'synced',
          },
        },
      });

      const { updateTask } = useTaskStore.getState();
      await updateTask('task-1', { title: 'Updated' });

      const { tasks } = useTaskStore.getState();
      expect(tasks['task-1'].syncStatus).toBe('pending');
    });

    it('should update updatedAt timestamp', async () => {
      const originalTime = Date.now() - 10000;
      useTaskStore.setState({
        tasks: {
          'task-1': {
            id: 'task-1',
            userId: 'guest',
            title: 'Original Title',
            completed: false,
            priority: 'medium',
            listId: 'inbox',
            steps: [],
            isMyDay: false,
            order: 0,
            isDeleted: false,
            createdAt: originalTime,
            updatedAt: originalTime,
          },
        },
      });

      const beforeUpdate = Date.now();
      const { updateTask } = useTaskStore.getState();
      await updateTask('task-1', { title: 'Updated' });

      const { tasks } = useTaskStore.getState();
      expect(tasks['task-1'].updatedAt).toBeGreaterThanOrEqual(beforeUpdate);
    });
  });

  describe('toggleTask', () => {
    it('should toggle task completion to true', async () => {
      useTaskStore.setState({
        tasks: {
          'task-1': {
            id: 'task-1',
            userId: 'guest',
            title: 'Test Task',
            completed: false,
            priority: 'medium',
            listId: 'inbox',
            steps: [],
            isMyDay: false,
            order: 0,
            isDeleted: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        },
      });

      const { toggleTask } = useTaskStore.getState();
      await toggleTask('task-1');

      const { tasks } = useTaskStore.getState();
      expect(tasks['task-1'].completed).toBe(true);
      expect(tasks['task-1'].completedAt).toBeDefined();
    });

    it('should toggle task completion to false', async () => {
      useTaskStore.setState({
        tasks: {
          'task-1': {
            id: 'task-1',
            userId: 'guest',
            title: 'Test Task',
            completed: true,
            completedAt: Date.now(),
            priority: 'medium',
            listId: 'inbox',
            steps: [],
            isMyDay: false,
            order: 0,
            isDeleted: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        },
      });

      const { toggleTask } = useTaskStore.getState();
      await toggleTask('task-1');

      const { tasks } = useTaskStore.getState();
      expect(tasks['task-1'].completed).toBe(false);
      expect(tasks['task-1'].completedAt).toBeUndefined();
    });

    it('should not toggle non-existent task', async () => {
      const { toggleTask } = useTaskStore.getState();
      await toggleTask('non-existent');

      const { tasks } = useTaskStore.getState();
      expect(Object.keys(tasks)).toHaveLength(0);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task from the store', async () => {
      useTaskStore.setState({
        tasks: {
          'task-1': {
            id: 'task-1',
            userId: 'guest',
            title: 'Test Task',
            completed: false,
            priority: 'medium',
            listId: 'inbox',
            steps: [],
            isMyDay: false,
            order: 0,
            isDeleted: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        },
      });

      const { deleteTask } = useTaskStore.getState();
      await deleteTask('task-1');

      const { tasks } = useTaskStore.getState();
      expect(Object.keys(tasks)).toHaveLength(0);
    });

    it('should handle deleting non-existent task', async () => {
      const { deleteTask } = useTaskStore.getState();
      await deleteTask('non-existent');

      const { tasks } = useTaskStore.getState();
      expect(Object.keys(tasks)).toHaveLength(0);
    });

    it('should only delete specified task', async () => {
      useTaskStore.setState({
        tasks: {
          'task-1': {
            id: 'task-1',
            userId: 'guest',
            title: 'Task 1',
            completed: false,
            priority: 'medium',
            listId: 'inbox',
            steps: [],
            isMyDay: false,
            order: 0,
            isDeleted: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          'task-2': {
            id: 'task-2',
            userId: 'guest',
            title: 'Task 2',
            completed: false,
            priority: 'medium',
            listId: 'inbox',
            steps: [],
            isMyDay: false,
            order: 1,
            isDeleted: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        },
      });

      const { deleteTask } = useTaskStore.getState();
      await deleteTask('task-1');

      const { tasks } = useTaskStore.getState();
      expect(Object.keys(tasks)).toHaveLength(1);
      expect(tasks['task-2']).toBeDefined();
      expect(tasks['task-1']).toBeUndefined();
    });
  });

  describe('loadTasks', () => {
    it('should set isLoading to true when called', async () => {
      const { loadTasks } = useTaskStore.getState();

      const loadPromise = loadTasks();

      expect(useTaskStore.getState().isLoading).toBe(true);

      await loadPromise;
    });
  });

  describe('reorderTasks', () => {
    it('should reorder tasks', async () => {
      useTaskStore.setState({
        tasks: {
          'task-1': {
            id: 'task-1',
            userId: 'guest',
            title: 'Task 1',
            completed: false,
            priority: 'medium',
            listId: 'inbox',
            steps: [],
            isMyDay: false,
            order: 0,
            isDeleted: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          'task-2': {
            id: 'task-2',
            userId: 'guest',
            title: 'Task 2',
            completed: false,
            priority: 'medium',
            listId: 'inbox',
            steps: [],
            isMyDay: false,
            order: 1,
            isDeleted: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        },
      });

      const { reorderTasks } = useTaskStore.getState();
      await reorderTasks('task-1', 'task-2');

      const { tasks } = useTaskStore.getState();
      expect(tasks['task-1']).toBeDefined();
      expect(tasks['task-2']).toBeDefined();
    });
  });
});
