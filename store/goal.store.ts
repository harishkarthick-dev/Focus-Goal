import { create } from 'zustand';
import { Goal } from '@/types';
import { dbPromise } from '@/lib/offline/db';
import { performLocalAction, performLocalDelete } from '@/lib/offline/actions';
import { v4 as uuidv4 } from 'uuid';
import { useUserStore } from './user.store';

interface GoalState {
  goals: Record<string, Goal>;
  isLoading: boolean;
  loadGoals: () => Promise<void>;
  addGoal: (title: string, type: Goal['type'], startDate: number, endDate: number) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  toggleGoal: (id: string) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
}

export const useGoalStore = create<GoalState>((set, get) => ({
  goals: {},
  isLoading: true,

  loadGoals: async () => {
    set({ isLoading: true });
    try {
      const db = await dbPromise;
      if (!db) return;
      const allGoals = await db.getAll('goals');
      const goalMap: Record<string, Goal> = {};
      allGoals.forEach((g: Goal) => {
        goalMap[g.id] = g;
      });
      set({ goals: goalMap, isLoading: false });
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
    }
  },

  addGoal: async (title, type, startDate, endDate) => {
    const { currentUser } = useUserStore.getState();
    const userId = currentUser?.id || 'guest';

    const newGoal: Goal = {
      id: uuidv4(),
      userId,
      title,
      type,
      startDate,
      endDate,
      color: 'blue',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isDeleted: false,
    };

    set(state => ({ goals: { ...state.goals, [newGoal.id]: newGoal } }));
    await performLocalAction('goals', newGoal, 'CREATE', 'GOAL');
  },

  updateGoal: async (id, updates) => {
    const currentGoal = get().goals[id];
    if (!currentGoal) return;

    const updatedGoal = {
      ...currentGoal,
      ...updates,
      updatedAt: Date.now(),
    };

    set(state => ({
      goals: { ...state.goals, [id]: updatedGoal },
    }));
    await performLocalAction('goals', updatedGoal, 'UPDATE', 'GOAL');
  },

  toggleGoal: async id => {
    const goal = get().goals[id];
    if (goal) {
      const isCompleted = !!goal.completedAt;
      await get().updateGoal(id, {
        completedAt: isCompleted ? undefined : Date.now(),
      });
    }
  },

  deleteGoal: async id => {
    set(state => {
      const g = { ...state.goals };
      delete g[id];
      return { goals: g };
    });
    await performLocalDelete('goals', id, 'GOAL');
  },
}));
