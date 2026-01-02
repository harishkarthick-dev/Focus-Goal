'use client';

import { useEffect, useState } from 'react';
import { useFocusStore } from '@/store/focus.store';
import { useTaskStore } from '@/store/task.store';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, X, Coffee, Brain, Armchair, Headphones } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSound } from '@/hooks/useSound';

export function FocusTimer() {
  const {
    isActive,
    timeLeft,
    mode,
    associatedTaskId,
    startTimer,
    pauseTimer,
    stopTimer,
    setMode,
    tick,
  } = useFocusStore();

  const [isOpen, setIsOpen] = useState(false);

  const { tasks } = useTaskStore();
  const activeTask = associatedTaskId ? tasks[associatedTaskId] : null;

  const [soundEnabled, setSoundEnabled] = useState(false);
  const { play: playAmbience, pause: pauseAmbience } = useSound(
    'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
    { volume: 0.3, loop: true }
  );

  useEffect(() => {
    if (isActive && soundEnabled) {
      playAmbience();
    } else {
      pauseAmbience();
    }
  }, [isActive, soundEnabled, playAmbience, pauseAmbience]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, tick]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const totalTime = mode === 'focus' ? 25 * 60 : mode === 'short-break' ? 5 * 60 : 15 * 60;
  const progress = (timeLeft / totalTime) * 100;
  const strokeDasharray = 283;
  const strokeDashoffset = strokeDasharray - (progress / 100) * strokeDasharray;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'f' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-zinc-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-6"
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2 mb-12 bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800">
            <ModeButton
              active={mode === 'focus'}
              onClick={() => setMode('focus')}
              label="Deep Focus"
              icon={Brain}
            />
            <ModeButton
              active={mode === 'short-break'}
              onClick={() => setMode('short-break')}
              label="Short Break"
              icon={Coffee}
            />
            <ModeButton
              active={mode === 'long-break'}
              onClick={() => setMode('long-break')}
              label="Long Break"
              icon={Armchair}
            />
          </div>
          <div className="relative mb-12">
            <div className="relative w-80 h-80 md:w-96 md:h-96 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  className="stroke-zinc-800 fill-transparent"
                  strokeWidth="6"
                />
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  className={cn(
                    'fill-transparent stroke-current transition-colors duration-500',
                    mode === 'focus' ? 'text-indigo-500' : 'text-emerald-500'
                  )}
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: strokeDasharray }}
                  animate={{
                    strokeDasharray: strokeDasharray,
                    strokeDashoffset: strokeDashoffset,
                  }}
                  transition={{ duration: 1, ease: 'linear' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  key={formattedTime}
                  initial={{ y: 5, opacity: 0.5 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={cn(
                    'text-7xl md:text-9xl font-mono font-bold tracking-tighter',
                    mode === 'focus' ? 'text-white' : 'text-emerald-100'
                  )}
                >
                  {formattedTime}
                </motion.div>
                <p className="text-zinc-500 mt-2 font-medium tracking-widest uppercase text-sm">
                  {isActive ? 'Flowing' : 'Paused'}
                </p>
              </div>
            </div>
          </div>
          <div className="h-16 mb-8">
            <AnimatePresence mode="wait">
              {activeTask ? (
                <motion.div
                  key={activeTask.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 px-6 py-3 bg-zinc-900 rounded-full border border-zinc-800"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-zinc-200 font-medium max-w-[200px] truncate">
                    {activeTask.title}
                  </span>
                </motion.div>
              ) : (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-zinc-500 text-sm"
                >
                  Select a task to focus on
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <div className="flex items-center gap-6">
            <ControlButton
              onClick={stopTimer}
              icon={RotateCcw}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white"
            />

            <button
              onClick={() => (isActive ? pauseTimer() : startTimer())}
              className={cn(
                'w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg transition-transform active:scale-95 group',
                mode === 'focus'
                  ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20'
              )}
            >
              {isActive ? (
                <Pause className="w-8 h-8 text-white fill-white" />
              ) : (
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              )}
            </button>
            <ControlButton
              onClick={() => setSoundEnabled(!soundEnabled)}
              icon={Headphones}
              className={cn(
                'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white',
                soundEnabled && 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
              )}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface ModeButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

function ModeButton({ active, onClick, label, icon: Icon }: ModeButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
        active
          ? 'bg-zinc-800 text-white shadow-sm ring-1 ring-zinc-700'
          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

interface ControlButtonProps {
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}

function ControlButton({ onClick, icon: Icon, className }: ControlButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95',
        className
      )}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}
