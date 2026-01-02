'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

export function Greeting({ name = 'Friend' }: { name?: string }) {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="mb-12"
    >
      <h1 className="text-5xl md:text-7xl tracking-tight text-zinc-900 dark:text-zinc-50 leading-[0.95]">
        <span className="font-serif italic font-light text-zinc-400 dark:text-zinc-500 block mb-1 md:mb-2">
          {greeting},
        </span>
        <span className="font-semibold">{name}.</span>
      </h1>
      <div className="h-1 w-20 bg-zinc-900 dark:bg-zinc-100 mt-6 md:mt-8 rounded-full" />
    </motion.div>
  );
}
