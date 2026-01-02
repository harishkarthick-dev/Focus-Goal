import { describe, it, expect, beforeEach } from 'vitest';
import { useAudioStore } from '@/store/audio.store';

describe('useAudioStore', () => {
  beforeEach(() => {
    useAudioStore.setState({ isMuted: false, masterVolume: 0.5 });
  });

  describe('initial state', () => {
    it('should not be muted by default', () => {
      const { isMuted } = useAudioStore.getState();
      expect(isMuted).toBe(false);
    });

    it('should have 0.5 master volume', () => {
      const { masterVolume } = useAudioStore.getState();
      expect(masterVolume).toBe(0.5);
    });
  });

  describe('toggleMute', () => {
    it('should toggle mute state', () => {
      const { toggleMute } = useAudioStore.getState();

      toggleMute();
      expect(useAudioStore.getState().isMuted).toBe(true);

      toggleMute();
      expect(useAudioStore.getState().isMuted).toBe(false);
    });
  });

  describe('setVolume', () => {
    it('should set master volume to 0.8', () => {
      const { setVolume } = useAudioStore.getState();

      setVolume(0.8);

      const { masterVolume } = useAudioStore.getState();
      expect(masterVolume).toBe(0.8);
    });

    it('should set volume to 0', () => {
      const { setVolume } = useAudioStore.getState();

      setVolume(0);

      const { masterVolume } = useAudioStore.getState();
      expect(masterVolume).toBe(0);
    });

    it('should set volume to 1', () => {
      const { setVolume } = useAudioStore.getState();

      setVolume(1);

      const { masterVolume } = useAudioStore.getState();
      expect(masterVolume).toBe(1);
    });
  });
});
