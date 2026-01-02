'use client';

import * as React from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Settings,
  User,
  Zap,
  Search,
  Moon,
  Sun,
  LogOut,
  LayoutDashboard,
  ListTodo,
  Target,
  StickyNote,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { useThemeStore } from '@/store/theme.store';
import { useUserStore } from '@/store/user.store';
import { useTaskStore } from '@/store/task.store';
import { useNoteStore } from '@/store/note.store';
import { useGoalStore } from '@/store/goal.store';

export function CommandCenter() {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const router = useRouter();

  const { theme, setTheme } = useThemeStore();
  const { logout } = useUserStore();
  const { tasks } = useTaskStore();
  const { notes } = useNoteStore();
  const { goals } = useGoalStore();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }

      if (e.key === 'n' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        router.push('/tasks');
        setOpen(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [router]);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  const showResults = search.length > 0;

  const filteredTasks = showResults
    ? Object.values(tasks)
        .filter(t => !t.isDeleted && t.title.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 3)
    : [];
  const filteredNotes = showResults
    ? Object.values(notes)
        .filter(
          n =>
            !n.isDeleted &&
            (n.title.toLowerCase().includes(search.toLowerCase()) ||
              (n.textPreview || '').toLowerCase().includes(search.toLowerCase()))
        )
        .slice(0, 3)
    : [];
  const filteredGoals = showResults
    ? Object.values(goals)
        .filter(g => !g.isDeleted && g.title.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 3)
    : [];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-lg relative z-10"
          >
            <Command
              className="w-full bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden"
              loop
              onKeyDown={e => {
                if (e.key === 'Escape') setOpen(false);
              }}
            >
              <div className="flex items-center px-4 border-b border-zinc-200 dark:border-zinc-800">
                <Search className="w-5 h-5 text-zinc-400 mr-3" />
                <Command.Input
                  autoFocus
                  placeholder="Type a command or search..."
                  className="w-full py-4 bg-transparent outline-none text-lg text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 font-medium"
                  value={search}
                  onValueChange={setSearch}
                />
                <div className="flex gap-1">
                  <kbd className="px-2 py-0.5 text-[10px] font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
                    ESC
                  </kbd>
                </div>
              </div>
              <Command.List className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2 custom-scrollbar">
                <Command.Empty className="py-6 text-center text-sm text-zinc-500">
                  No results found.
                </Command.Empty>
                {showResults && (
                  <>
                    {filteredTasks.length > 0 && (
                      <Command.Group
                        heading="Tasks"
                        className="text-xs font-bold text-zinc-400 px-2 py-2 uppercase tracking-wider mb-1"
                      >
                        {filteredTasks.map(task => (
                          <CommandItem
                            key={task.id}
                            onSelect={() => runCommand(() => router.push('/tasks'))}
                            icon={CheckCircle2}
                          >
                            {task.title}
                          </CommandItem>
                        ))}
                      </Command.Group>
                    )}
                    {filteredNotes.length > 0 && (
                      <Command.Group
                        heading="Notes"
                        className="text-xs font-bold text-zinc-400 px-2 py-2 uppercase tracking-wider mb-1"
                      >
                        {filteredNotes.map(note => (
                          <CommandItem
                            key={note.id}
                            onSelect={() => runCommand(() => router.push('/notes'))}
                            icon={StickyNote}
                          >
                            {note.title || 'Untitled Note'}
                          </CommandItem>
                        ))}
                      </Command.Group>
                    )}
                    {filteredGoals.length > 0 && (
                      <Command.Group
                        heading="Goals"
                        className="text-xs font-bold text-zinc-400 px-2 py-2 uppercase tracking-wider mb-1"
                      >
                        {filteredGoals.map(goal => (
                          <CommandItem
                            key={goal.id}
                            onSelect={() => runCommand(() => router.push('/goals'))}
                            icon={Target}
                          >
                            {goal.title}
                          </CommandItem>
                        ))}
                      </Command.Group>
                    )}
                  </>
                )}
                {!showResults && (
                  <>
                    <Command.Group
                      heading="Suggestions"
                      className="text-xs font-bold text-zinc-400 px-2 py-2 uppercase tracking-wider mb-1"
                    >
                      <CommandItem
                        onSelect={() => runCommand(() => router.push('/'))}
                        icon={LayoutDashboard}
                      >
                        Dashboard
                      </CommandItem>
                      <CommandItem
                        onSelect={() => runCommand(() => router.push('/tasks'))}
                        icon={ListTodo}
                      >
                        My Tasks
                      </CommandItem>
                      <CommandItem
                        onSelect={() => runCommand(() => router.push('/goals'))}
                        icon={Target}
                      >
                        Goals
                      </CommandItem>
                    </Command.Group>

                    <Command.Group
                      heading="Quick Actions"
                      className="text-xs font-bold text-zinc-400 px-2 py-2 uppercase tracking-wider mb-1"
                    >
                      <CommandItem
                        onSelect={() => runCommand(() => router.push('/tasks'))}
                        icon={Plus}
                        shortcut="⌘N"
                      >
                        Create New Task
                      </CommandItem>
                      <CommandItem
                        onSelect={() =>
                          runCommand(() =>
                            document.dispatchEvent(
                              new KeyboardEvent('keydown', { key: 'f', metaKey: true })
                            )
                          )
                        }
                        icon={Zap}
                        shortcut="⌘F"
                      >
                        Focus Mode
                      </CommandItem>
                    </Command.Group>

                    <Command.Group
                      heading="Settings"
                      className="text-xs font-bold text-zinc-400 px-2 py-2 uppercase tracking-wider mb-1"
                    >
                      <CommandItem
                        onSelect={() => runCommand(() => router.push('/settings'))}
                        icon={User}
                      >
                        Profile
                      </CommandItem>
                      <CommandItem
                        onSelect={() => runCommand(() => router.push('/settings'))}
                        icon={Settings}
                      >
                        Settings
                      </CommandItem>
                      <CommandItem
                        onSelect={() => runCommand(() => router.push('/settings'))}
                        icon={CreditCard}
                      >
                        Billing
                      </CommandItem>
                    </Command.Group>

                    <Command.Group
                      heading="Utility"
                      className="text-xs font-bold text-zinc-400 px-2 py-2 uppercase tracking-wider mb-1"
                    >
                      <CommandItem
                        onSelect={() =>
                          runCommand(() => setTheme(theme === 'dark' ? 'light' : 'dark'))
                        }
                        icon={theme === 'dark' ? Sun : Moon}
                      >
                        Toggle Theme
                      </CommandItem>
                      <CommandItem
                        onSelect={() =>
                          runCommand(() => logout().then(() => router.push('/login')))
                        }
                        icon={LogOut}
                        shortcut="Ext"
                      >
                        Log Out
                      </CommandItem>
                    </Command.Group>
                  </>
                )}
              </Command.List>
              <div className="px-4 py-2 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-between text-xs text-zinc-400">
                <span>Tasky Pro</span>
                <div className="flex gap-2">
                  <span>Move</span> <kbd className="font-sans">↑↓</kbd>
                  <span>Select</span> <kbd className="font-sans">↵</kbd>
                </div>
              </div>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function CommandItem({
  children,
  icon: Icon,
  onSelect,
  shortcut,
}: {
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  onSelect: () => void;
  shortcut?: string;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-white cursor-pointer transition-all aria-selected:bg-indigo-50 dark:aria-selected:bg-indigo-900/30 aria-selected:text-indigo-600 dark:aria-selected:text-indigo-400 data-[selected=true]:bg-indigo-50 dark:data-[selected=true]:bg-indigo-900/30 data-[selected=true]:text-indigo-600 dark:data-[selected=true]:text-indigo-400"
    >
      <div className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:bg-white dark:group-hover:bg-zinc-700 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors group-data-[selected=true]:bg-indigo-100 dark:group-data-[selected=true]:bg-indigo-900/50 group-data-[selected=true]:text-indigo-600 dark:group-data-[selected=true]:text-indigo-300">
        <Icon className="w-4 h-4" />
      </div>
      <span className="flex-1 font-medium">{children}</span>
      {shortcut && <span className="text-xs text-zinc-400 font-mono">{shortcut}</span>}
    </Command.Item>
  );
}
