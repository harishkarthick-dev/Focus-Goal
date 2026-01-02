import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type FocusMode = 'focus' | 'short-break' | 'long-break';

interface FocusState {
  isActive: boolean;
  mode: FocusMode;
  timeLeft: number;
  associatedTaskId: string | null;
  startTimer: (taskId?: string) => void;
  pauseTimer: () => void;
  stopTimer: () => void;
  setMode: (mode: FocusMode) => void;
  tick: () => void;
  resetTimer: () => void;
}

const MODES = {
  focus: 25 * 60,
  'short-break': 5 * 60,
  'long-break': 15 * 60,
};

export const useFocusStore = create<FocusState>()(
  persist(
    (set, get) => ({
      isActive: false,
      mode: 'focus',
      timeLeft: MODES['focus'],
      associatedTaskId: null,

      startTimer: taskId =>
        set({ isActive: true, associatedTaskId: taskId || get().associatedTaskId }),
      pauseTimer: () => set({ isActive: false }),
      stopTimer: () =>
        set({ isActive: false, timeLeft: MODES[get().mode], associatedTaskId: null }),

      setMode: mode =>
        set({
          mode,
          timeLeft: MODES[mode],
          isActive: false,
        }),

      tick: () => {
        const { timeLeft, isActive } = get();
        if (isActive && timeLeft > 0) {
          set({ timeLeft: timeLeft - 1 });
        } else if (isActive && timeLeft === 0) {
          set({ isActive: false });
        }
      },

      resetTimer: () => set({ timeLeft: MODES[get().mode], isActive: false }),
    }),
    {
      name: 'tasky-focus-storage',
    }
  )
);
