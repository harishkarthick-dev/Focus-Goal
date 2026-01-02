'use client';

import { CheckSquare, StickyNote, Target, Zap, Clock, Shield } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

const features = [
  {
    icon: CheckSquare,
    title: 'Smart Task Management',
    description:
      'Organize tasks with ease. Set priorities, due dates, and custom tags to keep your workflow fluid and efficient.',
    className: 'md:col-span-2 lg:col-span-2',
  },
  {
    icon: Zap,
    title: 'Focus Mode',
    description:
      'Eliminate distractions. A dedicated timer and streamlined interface help you stay in the flow state.',
    className: 'md:col-span-1 lg:col-span-1',
  },
  {
    icon: StickyNote,
    title: 'Rich Notes',
    description:
      'Capture ideas instantly. Our rich text editor supports formatting, checklists, and seamless organization.',
    className: 'md:col-span-1 lg:col-span-1',
  },
  {
    icon: Target,
    title: 'Goal Tracking',
    description:
      'Turn dreams into reality. Break down big goals into actionable steps and visualize your progress.',
    className: 'md:col-span-2 lg:col-span-2',
  },
  {
    icon: Clock,
    title: 'Smart Reminders',
    description:
      "Never miss a beat. Customizable notifications ensure you're always on top of your schedule.",
  },
  {
    icon: Shield,
    title: 'Local-First Privacy',
    description:
      'Your data stays yours. Tasky works offline and syncs securely only when you choose.',
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="py-24 relative overflow-hidden bg-zinc-50/50 dark:bg-zinc-950/50"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-zinc-100 dark:bg-zinc-800/30 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="container px-4 md:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Everything you need,
            <br />
            <span className="text-zinc-500 dark:text-zinc-400">nothing you don&apos;t.</span>
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            A suite of powerful tools designed to help you organize your life without the clutter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
              className={feature.className}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
