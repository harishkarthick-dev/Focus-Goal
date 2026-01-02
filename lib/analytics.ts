import { Task } from '@/types';

export const getWeeklyCompletionData = (tasks: Task[]) => {
  const today = new Date();
  const data = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });

    const count = tasks.filter(t => {
      if (!t.completed || !t.completedAt) return false;
      const tDate = new Date(t.completedAt);
      return (
        tDate.getDate() === d.getDate() &&
        tDate.getMonth() === d.getMonth() &&
        tDate.getFullYear() === d.getFullYear()
      );
    }).length;

    data.push({ name: dayStr, tasks: count });
  }
  return data;
};
