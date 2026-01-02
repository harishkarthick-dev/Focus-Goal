'use client';

import { useThemeStore } from '@/store/theme.store';
import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  const cycleTheme = async (e: React.MouseEvent) => {
    const newTheme = theme === 'light' ? 'dark' : 'light';

    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    const x = e.clientX === 0 && e.clientY === 0 ? window.innerWidth / 2 : e.clientX;
    const y = e.clientX === 0 && e.clientY === 0 ? window.innerHeight / 2 : e.clientY;

    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    const transition = document.startViewTransition(() => {
      setTheme(newTheme);
    });

    transition.ready.then(() => {
      const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 500,
          easing: 'ease-out',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  };

  return (
    <button
      onClick={e => {
        e.stopPropagation();
        cycleTheme(e);
      }}
      className={`
                w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-500 relative overflow-hidden shadow-sm hover:shadow-md
                ${theme === 'light' ? 'bg-amber-100 hover:bg-amber-200 text-amber-600' : 'bg-indigo-950/50 hover:bg-indigo-900/50 text-indigo-200'}
            `}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <AnimatePresence>
        {theme === 'light' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-3 bg-amber-400 rounded-full"
                initial={{ scale: 0, opacity: 0, y: 0 }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                  y: -32,
                  rotate: i * 45,
                }}
                transition={{
                  duration: 0.8,
                  ease: 'easeOut',
                  delay: 0.1,
                }}
                style={{ transformOrigin: 'center 32px' }}
              />
            ))}
          </motion.div>
        )}
        {theme === 'dark' && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[
              { duration: 1.7, delay: 0.2, top: 25, left: 30 },
              { duration: 1.9, delay: 0.4, top: 45, left: 70 },
              { duration: 2.0, delay: 0.1, top: 60, left: 25 },
              { duration: 1.6, delay: 0.3, top: 35, left: 55 },
              { duration: 1.8, delay: 0.15, top: 75, left: 60 },
              { duration: 2.1, delay: 0.45, top: 55, left: 40 },
            ].map((star, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-indigo-100 rounded-full"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1.2, 0.8, 1],
                  opacity: [0, 1, 0.6, 1],
                }}
                transition={{
                  duration: star.duration,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  delay: star.delay,
                }}
                style={{
                  top: `${star.top}%`,
                  left: `${star.left}%`,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'light' ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative z-10"
          >
            <Sun className="w-6 h-6 fill-amber-400 text-amber-600" strokeWidth={2} />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative z-10"
          >
            <Moon className="w-6 h-6 fill-indigo-400 text-indigo-200" strokeWidth={2} />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
