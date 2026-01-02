import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AudioState {
  isMuted: boolean;
  masterVolume: number;

  toggleMute: () => void;
  setVolume: (volume: number) => void;
}

export const useAudioStore = create<AudioState>()(
  persist(
    set => ({
      isMuted: false,
      masterVolume: 0.5,

      toggleMute: () => set(state => ({ isMuted: !state.isMuted })),
      setVolume: volume => set({ masterVolume: volume }),
    }),
    {
      name: 'tasky-audio-storage',
    }
  )
);
