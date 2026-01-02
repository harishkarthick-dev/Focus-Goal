import { describe, it, expect, beforeEach } from 'vitest';
import { useThemeStore } from '@/store/theme.store';

describe('useThemeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({ theme: 'light' });
  });

  describe('initial state', () => {
    it('should have light theme by default', () => {
      const { theme } = useThemeStore.getState();
      expect(theme).toBe('light');
    });
  });

  describe('setTheme', () => {
    it('should set theme to dark', () => {
      const { setTheme } = useThemeStore.getState();
      setTheme('dark');

      const { theme } = useThemeStore.getState();
      expect(theme).toBe('dark');
    });

    it('should set theme to light', () => {
      useThemeStore.setState({ theme: 'dark' });
      const { setTheme } = useThemeStore.getState();

      setTheme('light');

      const { theme } = useThemeStore.getState();
      expect(theme).toBe('light');
    });
  });
});
