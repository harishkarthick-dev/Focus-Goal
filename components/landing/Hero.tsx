'use client';

import { motion } from 'framer-motion';
import { MotionButton } from '@/components/ui/motion-button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-amber-500/20 blur-[120px] rounded-full opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-orange-500/20 blur-[100px] rounded-full opacity-30 pointer-events-none" />

      <div className="container px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 mb-8"
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
            Reimagine your workflow
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6 max-w-4xl"
        >
          Organize your life <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
            with elegance.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-10 leading-relaxed"
        >
          Tasky isn&apos;t just another to-do list. It&apos;s a crafted workspace designed to bring
          clarity, focus, and joy to your daily planning.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href="/login">
            <MotionButton size="lg" className="px-8 text-lg h-12">
              Start for free <ArrowRight className="w-5 h-5 ml-2" />
            </MotionButton>
          </Link>
          <Link href="#features">
            <button className="px-8 h-12 rounded-xl text-zinc-600 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              How it works
            </button>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, type: 'spring' }}
          className="mt-20 relative w-full max-w-5xl aspect-[16/9] bg-zinc-50 dark:bg-zinc-900 rounded-t-2xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden select-none"
        >
          <div className="absolute top-0 left-0 right-0 h-10 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 gap-2 z-20">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="absolute inset-0 top-10 bg-zinc-50 dark:bg-zinc-900">
            <Image
              src="/hero-dashboard.png"
              alt="Tasky Dashboard Preview"
              fill
              className="object-cover object-top opacity-90 dark:opacity-80 hover:opacity-100 transition-opacity duration-500"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-zinc-950 dark:via-transparent dark:to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
