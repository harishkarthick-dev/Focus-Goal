'use client';

import { AppSidebar } from '@/components/layout/AppSidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { UserNav } from '@/components/layout/UserNav';
import { BottomNav } from '@/components/layout/BottomNav';
import { CommandCenter } from '@/components/command/CommandCenter';
import { FocusTimer } from '@/components/focus/FocusTimer';
import { TaskDetailsPanel } from '@/components/task/TaskDetailsPanel';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import { useEffect } from 'react';
import { useTaskStore } from '@/store/task.store';
import { useGoalStore } from '@/store/goal.store';
import { useNoteStore } from '@/store/note.store';
import { useUserStore } from '@/store/user.store';
import { useSync } from '@/hooks/useSync';
import { useRouter } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  useSync();
  const { loadTasks } = useTaskStore();
  const { loadGoals } = useGoalStore();
  const { loadNotes } = useNoteStore();
  const { initAuthListener } = useUserStore();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const unsub = initAuthListener();
      loadTasks();
      loadGoals();
      loadNotes();
      return () => unsub();
    }
  }, [initAuthListener, loadTasks, loadGoals, loadNotes]);

  const { isAuthenticated, isLoading } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('AppLayout: Not authenticated, redirecting to login');
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans transition-colors duration-300">
      <AppSidebar />
      <MobileNav />
      {/* Desktop UserNav - only visible on md+ */}
      <UserNav className="fixed top-6 right-6 z-50 hidden md:flex" />
      <BottomNav />
      <CommandCenter />
      <FocusTimer />
      <TaskDetailsPanel />
      <InstallPrompt />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
