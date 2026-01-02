'use client';

import { Greeting } from '@/components/dashboard/Greeting';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { DailyQuote } from '@/components/dashboard/DailyQuote';
import { WeeklyProgressChart } from '@/components/dashboard/WeeklyProgressChart';
import { ActivityHeatmap } from '@/components/dashboard/ActivityHeatmap';

import { useUserStore } from '@/store/user.store';

export default function DashboardPage() {
  const { currentUser } = useUserStore();
  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-16">
      <section className="max-w-4xl">
        <Greeting name={currentUser?.displayName || 'Friend'} />
      </section>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        <div className="lg:col-span-8 space-y-12">
          <section>
            <h2 className="font-serif text-xl italic text-zinc-400 mb-6">Overview</h2>
            <DashboardStats />
          </section>

          <section>
            <h2 className="font-serif text-xl italic text-zinc-400 mb-6">Productivity Flow</h2>
            <div className="space-y-6">
              <WeeklyProgressChart />
              <ActivityHeatmap />
            </div>
          </section>
        </div>
        <div className="lg:col-span-4 space-y-12">
          <section>
            <h2 className="font-serif text-xl italic text-zinc-400 mb-6">Quick Actions</h2>
            <QuickActions />
          </section>

          <section>
            <h2 className="font-serif text-xl italic text-zinc-400 mb-6">Daily Wisdom</h2>
            <DailyQuote />
          </section>
        </div>
      </div>
    </div>
  );
}
