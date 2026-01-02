import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGoalStore } from '@/store/goal.store';

vi.mock('uuid', () => ({
  v4: () => 'test-goal-uuid',
}));

describe('useGoalStore', () => {
  beforeEach(() => {
    useGoalStore.setState({ goals: {}, isLoading: false });
  });

  describe('initial state', () => {
    it('should have empty goals object', () => {
      const { goals } = useGoalStore.getState();
      expect(goals).toEqual({});
    });

    it('should have isLoading as false after reset', () => {
      const { isLoading } = useGoalStore.getState();
      expect(isLoading).toBe(false);
    });
  });

  describe('loadGoals', () => {
    it('should set isLoading to true when called', async () => {
      const { loadGoals } = useGoalStore.getState();

      const loadPromise = loadGoals();

      expect(useGoalStore.getState().isLoading).toBe(true);

      await loadPromise;
    });

    it('should set isLoading to false after loading', async () => {
      const { loadGoals } = useGoalStore.getState();

      await loadGoals();

      expect(useGoalStore.getState().isLoading).toBe(false);
    });
  });

  describe('addGoal', () => {
    it('should add a goal to the store', async () => {
      const { addGoal } = useGoalStore.getState();

      await addGoal('Test Goal', 'monthly', Date.now(), Date.now() + 30 * 24 * 60 * 60 * 1000);

      const { goals } = useGoalStore.getState();
      const goalValues = Object.values(goals);

      expect(goalValues).toHaveLength(1);
      expect(goalValues[0].title).toBe('Test Goal');
      expect(goalValues[0].type).toBe('monthly');
    });

    it('should set default color to blue', async () => {
      const { addGoal } = useGoalStore.getState();

      await addGoal('Test Goal', 'weekly', Date.now(), Date.now() + 7 * 24 * 60 * 60 * 1000);

      const { goals } = useGoalStore.getState();
      const goalValues = Object.values(goals);

      expect(goalValues[0].color).toBe('blue');
    });

    it('should set isDeleted to false', async () => {
      const { addGoal } = useGoalStore.getState();

      await addGoal('Test Goal', 'yearly', Date.now(), Date.now() + 365 * 24 * 60 * 60 * 1000);

      const { goals } = useGoalStore.getState();
      const goalValues = Object.values(goals);

      expect(goalValues[0].isDeleted).toBe(false);
    });

    it('should have correct timestamps', async () => {
      const beforeTime = Date.now();
      const { addGoal } = useGoalStore.getState();
      const startDate = Date.now();
      const endDate = Date.now() + 7 * 24 * 60 * 60 * 1000;

      await addGoal('Test Goal', 'weekly', startDate, endDate);

      const afterTime = Date.now();
      const { goals } = useGoalStore.getState();
      const goalValues = Object.values(goals);

      expect(goalValues[0].startDate).toBe(startDate);
      expect(goalValues[0].endDate).toBe(endDate);
      expect(goalValues[0].createdAt).toBeGreaterThanOrEqual(beforeTime);
      expect(goalValues[0].createdAt).toBeLessThanOrEqual(afterTime);
    });

    it('should set userId from currentUser or guest', async () => {
      const { addGoal } = useGoalStore.getState();

      await addGoal('Test Goal', 'daily', Date.now(), Date.now() + 24 * 60 * 60 * 1000);

      const { goals } = useGoalStore.getState();
      const goalValues = Object.values(goals);

      expect(goalValues[0].userId).toBe('guest');
    });
  });

  describe('deleteGoal', () => {
    it('should delete a goal from the store', async () => {
      useGoalStore.setState({
        goals: {
          'goal-1': {
            id: 'goal-1',
            userId: 'guest',
            title: 'Test Goal',
            type: 'weekly',
            startDate: Date.now(),
            endDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
            color: 'blue',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            isDeleted: false,
          },
        },
      });

      const { deleteGoal } = useGoalStore.getState();
      await deleteGoal('goal-1');

      const { goals } = useGoalStore.getState();
      expect(Object.keys(goals)).toHaveLength(0);
    });

    it('should only delete specified goal', async () => {
      useGoalStore.setState({
        goals: {
          'goal-1': {
            id: 'goal-1',
            userId: 'guest',
            title: 'Goal 1',
            type: 'weekly',
            startDate: Date.now(),
            endDate: Date.now() + 7 * 24 * 60 * 60 * 1000,
            color: 'blue',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            isDeleted: false,
          },
          'goal-2': {
            id: 'goal-2',
            userId: 'guest',
            title: 'Goal 2',
            type: 'monthly',
            startDate: Date.now(),
            endDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
            color: 'green',
            createdAt: Date.now(),
            updatedAt: Date.now(),
            isDeleted: false,
          },
        },
      });

      const { deleteGoal } = useGoalStore.getState();
      await deleteGoal('goal-1');

      const { goals } = useGoalStore.getState();
      expect(Object.keys(goals)).toHaveLength(1);
      expect(goals['goal-2']).toBeDefined();
      expect(goals['goal-1']).toBeUndefined();
    });

    it('should handle deleting non-existent goal', async () => {
      const { deleteGoal } = useGoalStore.getState();
      await expect(deleteGoal('non-existent')).resolves.not.toThrow();
    });
  });
});
