'use client';

import Image from 'next/image';
import { useUserStore } from '@/store/user.store';
import { useTaskStore } from '@/store/task.store';
import { useGoalStore } from '@/store/goal.store';
import { useNoteStore } from '@/store/note.store';
import { useAudioStore } from '@/store/audio.store';
import { motion } from 'framer-motion';
import { User, Shield, Zap, Bell, Monitor } from 'lucide-react';
import { useState } from 'react';

import { AvatarSelector } from '@/components/modals/AvatarSelector';

export default function SettingsPage() {
  const { currentUser, updateDisplayName } = useUserStore();
  const [editingName, setEditingName] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [newName, setNewName] = useState('');

  const handleUpdateName = async () => {
    if (!newName.trim()) return;
    await updateDisplayName(newName);
    setEditingName(false);
  };

  interface SettingItem {
    label: string;
    value: React.ReactNode;
    action?: string;
    onAction?: () => void;
    editable?: boolean;
    highlight?: boolean;
    badge?: React.ReactNode;
    isEditing?: boolean;
  }

  interface SettingSection {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    items: SettingItem[];
  }

  const sections: SettingSection[] = [
    {
      title: 'Profile',
      icon: User,
      description: 'Manage your public profile information.',
      items: [
        {
          label: 'Profile Picture',
          value: (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                {currentUser?.photoURL ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={currentUser.photoURL}
                      alt="Avatar"
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400 font-bold bg-gradient-to-tr from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                    {currentUser?.displayName?.[0] || 'U'}
                  </div>
                )}
              </div>
              <span className="text-xs text-zinc-500">
                {currentUser?.photoURL ? 'Custom Avatar' : 'Default Initials'}
              </span>
            </div>
          ),
          action: 'Change',
          onAction: () => setShowAvatarSelector(true),
        },
        {
          label: 'Name',
          value: editingName ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-700"
                autoFocus
                onKeyDown={e => {
                  if (e.key === 'Enter') handleUpdateName();
                  if (e.key === 'Escape') setEditingName(false);
                }}
              />
              <button onClick={handleUpdateName} className="text-xs font-bold text-green-600">
                Save
              </button>
              <button onClick={() => setEditingName(false)} className="text-xs text-red-500">
                Cancel
              </button>
            </div>
          ) : (
            currentUser?.displayName || 'Guest'
          ),
          action: 'Edit',
          onAction: () => {
            setNewName(currentUser?.displayName || '');
            setEditingName(true);
          },
          editable: !editingName,
        },
        { label: 'Email', value: currentUser?.email || '', editable: false },
      ],
    },
    {
      title: 'Account',
      icon: Shield,
      description: 'Security and authentication settings.',
      items: [
        currentUser?.provider === 'google.com'
          ? {
              label: 'Authentication',
              value: 'Connected with Google',
              badge: (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Google
                  </span>
                </div>
              ),
            }
          : { label: 'Password', value: '••••••••', action: 'Change' },
      ],
    },
    {
      title: 'Appearance',
      icon: Monitor,
      description: 'Customize your visual experience.',
      items: [{ label: 'Theme', value: 'Managed via Global Toggle', action: 'Toggle' }],
    },
    {
      title: 'Experience',
      icon: Bell,
      description: 'Soundscapes and feedback.',
      items: [
        {
          label: 'Sound Effects',
          value: useAudioStore.getState().isMuted ? 'Muted' : 'On',
          action: useAudioStore.getState().isMuted ? 'Unmute' : 'Mute',
          onAction: () => useAudioStore.getState().toggleMute(),
        },
        {
          label: 'Volume',
          value: `${Math.round(useAudioStore.getState().masterVolume * 100)}%`,
          editable: true,
          action: 'Adjust',
          onAction: () => {
            const current = useAudioStore.getState().masterVolume;
            const next = current >= 1 ? 0.2 : current + 0.2;
            useAudioStore.getState().setVolume(Number(next.toFixed(1)));
          },
        },
      ],
    },
    {
      title: 'Subscription',
      icon: Zap,
      description: 'Manage your plan and billing.',
      items: [
        {
          label: 'Current Plan',
          value: 'Early Access',
          highlight: true,
          badge: (
            <div className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              EARLY ADOPTER
            </div>
          ),
        },
      ],
    },
    {
      title: 'Data Control',
      icon: Shield,
      description: 'Manage your data ownership.',
      items: [
        {
          label: 'Export Data',
          value: 'Download JSON backup',
          action: 'Export',
          onAction: () => {
            const data = {
              tasks: useTaskStore.getState().tasks,
              goals: useGoalStore.getState().goals,
              notes: useNoteStore.getState().notes,
              user: useUserStore.getState().currentUser,
              timestamp: Date.now(),
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tasky-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          },
        },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 pb-24 space-y-8">
      <header className="mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500 tracking-tight"
        >
          Settings
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-zinc-500 dark:text-zinc-400 mt-3 text-lg"
        >
          Manage your preferences and account security.
        </motion.p>
      </header>

      <div className="grid gap-8">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative overflow-hidden p-8 rounded-[2rem] bg-white/50 dark:bg-zinc-900/50 border border-white/50 dark:border-zinc-800 backdrop-blur-xl shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-amber-500/10 to-purple-500/10 rounded-full blur-3xl group-hover:opacity-100 transition-opacity opacity-50" />

            <div className="flex items-start gap-5 mb-8 relative z-10">
              <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-inner">
                <section.icon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  {section.title}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{section.description}</p>
              </div>
            </div>

            <div className="space-y-3 relative z-10">
              {section.items.map((item, j) => (
                <div
                  key={j}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/40 dark:bg-zinc-800/20 hover:bg-white/80 dark:hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-zinc-100 dark:hover:border-zinc-700"
                >
                  <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400 px-1">
                    {item.label}
                  </span>

                  <div className="flex items-center gap-4">
                    {item.badge ? (
                      item.badge
                    ) : (
                      <span
                        className={`text-sm ${item.highlight ? 'font-bold text-amber-500' : 'text-zinc-900 dark:text-zinc-100 font-medium'}`}
                      >
                        {item.value}
                      </span>
                    )}
                    {(item.action || item.editable) &&
                      !item.value?.toString().includes('input') && (
                        <button
                          onClick={item.onAction}
                          className="text-xs px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold hover:opacity-90 transition-opacity"
                        >
                          {item.action || 'Edit'}
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center pt-8 opacity-50">
        <p className="text-xs text-zinc-400 font-mono">Secure • Encrypted • Local-First</p>
      </div>

      <AvatarSelector isOpen={showAvatarSelector} onClose={() => setShowAvatarSelector(false)} />
    </div>
  );
}
