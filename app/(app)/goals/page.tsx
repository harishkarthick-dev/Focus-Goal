'use client';

import { useGoalStore } from '@/store/goal.store';
import { GoalCard } from '@/components/goal/GoalCard';
import { Plus, Target } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { MotionButton } from '@/components/ui/motion-button';
import { EmptyState } from '@/components/ui/empty-state';
import { useState } from 'react';
import { GoalFormModal } from '@/components/goal/GoalFormModal';

export default function GoalsPage() {
  const { goals, isLoading } = useGoalStore();
  const [isAdding, setIsAdding] = useState(false);

  const activeGoals = Object.values(goals)
    .filter(g => !g.isDeleted)
    .sort((a, b) => {
      if (!!a.completedAt !== !!b.completedAt) return a.completedAt ? 1 : -1;
      return a.endDate - b.endDate;
    });

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      <div className="flex items-center justify-between mb-8 pr-4 lg:pr-48">
        <PageHeader
          title="Goals"
          subtitle="Stay focused on the big picture."
          icon={Target}
          iconColor="text-emerald-600"
        />
        {activeGoals.length > 0 && (
          <MotionButton
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            <Plus className="w-4 h-4" />
            New Goal
          </MotionButton>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeGoals.map(goal => (
          <GoalCard key={goal.id} goal={goal} />
        ))}
      </div>

      {activeGoals.length === 0 && !isLoading && (
        <EmptyState
          icon={Target}
          title="No goals yet"
          description="Set clear goals to track your progress and stay motivated."
          action={
            <MotionButton
              onClick={() => setIsAdding(true)}
              className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
            >
              Create your first goal
            </MotionButton>
          }
        />
      )}

      <GoalFormModal isOpen={isAdding} onClose={() => setIsAdding(false)} />
    </div>
  );
}
