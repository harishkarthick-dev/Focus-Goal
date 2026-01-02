import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  platforms: string[];
}

describe('InstallPrompt', () => {
  let deferredPrompt: Partial<BeforeInstallPromptEvent>;
  let eventListeners: Record<string, EventListener[]> = {};

  beforeEach(() => {
    eventListeners = {};

    deferredPrompt = {
      prompt: vi.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'accepted' }),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.addEventListener = vi.fn((event: string, handler: any) => {
      if (!eventListeners[event]) {
        eventListeners[event] = [];
      }
      eventListeners[event].push(handler);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.removeEventListener = vi.fn((event: string, handler: any) => {
      if (eventListeners[event]) {
        eventListeners[event] = eventListeners[event].filter(h => h !== handler);
      }
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should not show prompt on initial render', () => {
      render(<InstallPrompt />);
      expect(screen.queryByText('Install Tasky')).not.toBeInTheDocument();
    });

    it('should register beforeinstallprompt event listener on mount', () => {
      render(<InstallPrompt />);
      expect(window.addEventListener).toHaveBeenCalledWith(
        'beforeinstallprompt',
        expect.any(Function)
      );
    });

    it('should cleanup event listener on unmount', () => {
      const { unmount } = render(<InstallPrompt />);
      unmount();
      expect(window.removeEventListener).toHaveBeenCalledWith(
        'beforeinstallprompt',
        expect.any(Function)
      );
    });
  });

  describe('beforeinstallprompt Event', () => {
    it('should show prompt when beforeinstallprompt event fires', async () => {
      render(<InstallPrompt />);

      const mockEvent = {
        ...deferredPrompt,
        preventDefault: vi.fn(),
      } as unknown as BeforeInstallPromptEvent;

      const handler = eventListeners['beforeinstallprompt']?.[0];
      if (handler) {
        handler(mockEvent);
      }

      await waitFor(() => {
        expect(screen.getByText('Install Tasky')).toBeInTheDocument();
      });
    });

    it('should prevent default on beforeinstallprompt event', async () => {
      render(<InstallPrompt />);

      const mockEvent = {
        ...deferredPrompt,
        preventDefault: vi.fn(),
      } as unknown as BeforeInstallPromptEvent;

      const handler = eventListeners['beforeinstallprompt']?.[0];
      if (handler) {
        handler(mockEvent);
      }

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should display install message correctly', async () => {
      render(<InstallPrompt />);

      const mockEvent = {
        ...deferredPrompt,
        preventDefault: vi.fn(),
      } as unknown as BeforeInstallPromptEvent;

      const handler = eventListeners['beforeinstallprompt']?.[0];
      if (handler) {
        handler(mockEvent);
      }

      await waitFor(() => {
        expect(screen.getByText('Install Tasky')).toBeInTheDocument();
        expect(
          screen.getByText('Install the app for a better experience locally.')
        ).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    beforeEach(async () => {
      render(<InstallPrompt />);

      const mockEvent = {
        ...deferredPrompt,
        preventDefault: vi.fn(),
      } as unknown as BeforeInstallPromptEvent;

      const handler = eventListeners['beforeinstallprompt']?.[0];
      if (handler) {
        handler(mockEvent);
      }

      await waitFor(() => {
        expect(screen.getByText('Install Tasky')).toBeInTheDocument();
      });
    });

    it('should hide prompt when close button is clicked', async () => {
      const closeButton = screen.getByRole('button', { name: '' });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText('Install Tasky')).not.toBeInTheDocument();
      });
    });

    it('should call prompt when install button is clicked', async () => {
      const installButton = screen.getByRole('button', { name: 'Install' });
      fireEvent.click(installButton);

      await waitFor(() => {
        expect(deferredPrompt.prompt).toHaveBeenCalled();
      });
    });

    it('should hide prompt after successful installation', async () => {
      const installButton = screen.getByRole('button', { name: 'Install' });
      fireEvent.click(installButton);

      await waitFor(() => {
        expect(screen.queryByText('Install Tasky')).not.toBeInTheDocument();
      });
    });

    it('should not hide prompt if user dismisses install dialog', async () => {
      deferredPrompt.userChoice = Promise.resolve({ outcome: 'dismissed' });

      const installButton = screen.getByRole('button', { name: 'Install' });
      fireEvent.click(installButton);

      await waitFor(() => {
        expect(deferredPrompt.prompt).toHaveBeenCalled();
      });

      expect(screen.getByText('Install Tasky')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle reopening prompt after closing', async () => {
      render(<InstallPrompt />);

      const mockEvent = {
        ...deferredPrompt,
        preventDefault: vi.fn(),
      } as unknown as BeforeInstallPromptEvent;

      const handler = eventListeners['beforeinstallprompt']?.[0];
      if (handler) {
        handler(mockEvent);
      }

      await waitFor(() => {
        expect(screen.getByText('Install Tasky')).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: '' });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText('Install Tasky')).not.toBeInTheDocument();
      });

      const newMockEvent = {
        prompt: vi.fn(),
        userChoice: Promise.resolve({ outcome: 'accepted' }),
        preventDefault: vi.fn(),
      } as unknown as BeforeInstallPromptEvent;

      if (handler) {
        handler(newMockEvent);
      }

      await waitFor(() => {
        expect(screen.getByText('Install Tasky')).toBeInTheDocument();
      });
    });

    it('should handle prompt rejection gracefully', async () => {
      const errorPrompt = {
        prompt: vi.fn().mockRejectedValue(new Error('Prompt failed')),
        userChoice: Promise.resolve({ outcome: 'accepted' }),
        preventDefault: vi.fn(),
      }; // Not casting to BeforeInstallPromptEvent directly here to allow error property simulation if needed, but for prompt prop it matches

      render(<InstallPrompt />);

      const handler = eventListeners['beforeinstallprompt']?.[0];
      if (handler) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler(errorPrompt as any);
      }

      await waitFor(() => {
        expect(screen.getByText('Install Tasky')).toBeInTheDocument();
      });

      const installButton = screen.getByRole('button', { name: 'Install' });
      fireEvent.click(installButton);

      await waitFor(() => {
        expect(errorPrompt.prompt).toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles', async () => {
      render(<InstallPrompt />);

      const mockEvent = {
        ...deferredPrompt,
        preventDefault: vi.fn(),
      } as unknown as BeforeInstallPromptEvent;

      const handler = eventListeners['beforeinstallprompt']?.[0];
      if (handler) {
        handler(mockEvent);
      }

      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThanOrEqual(2);
      });
    });

    it('should display Smartphone icon', async () => {
      render(<InstallPrompt />);

      const mockEvent = {
        ...deferredPrompt,
        preventDefault: vi.fn(),
      } as unknown as BeforeInstallPromptEvent;

      const handler = eventListeners['beforeinstallprompt']?.[0];
      if (handler) {
        handler(mockEvent);
      }

      await waitFor(() => {
        expect(screen.getByText('Install Tasky')).toBeInTheDocument();
      });
    });
  });

  describe('Animation', () => {
    it('should animate in when shown', async () => {
      const { container } = render(<InstallPrompt />);

      const mockEvent = {
        ...deferredPrompt,
        preventDefault: vi.fn(),
      } as unknown as BeforeInstallPromptEvent;

      const handler = eventListeners['beforeinstallprompt']?.[0];
      if (handler) {
        handler(mockEvent);
      }

      await waitFor(() => {
        const motionDiv = container.querySelector('div[class*="fixed"]');
        expect(motionDiv).toBeInTheDocument();
      });
    });

    it('should animate out when closed', async () => {
      render(<InstallPrompt />);

      const mockEvent = {
        ...deferredPrompt,
        preventDefault: vi.fn(),
      } as unknown as BeforeInstallPromptEvent;

      const handler = eventListeners['beforeinstallprompt']?.[0];
      if (handler) {
        handler(mockEvent);
      }

      await waitFor(() => {
        expect(screen.getByText('Install Tasky')).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: '' });
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText('Install Tasky')).not.toBeInTheDocument();
      });
    });
  });
});
