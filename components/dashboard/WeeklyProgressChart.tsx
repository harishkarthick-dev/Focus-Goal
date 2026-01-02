'use client';

import { useTaskStore } from '@/store/task.store';
import { getWeeklyCompletionData } from '@/lib/analytics';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useThemeStore } from '@/store/theme.store';
import { motion } from 'framer-motion';

export function WeeklyProgressChart() {
  const { tasks } = useTaskStore();
  const { theme } = useThemeStore();
  const data = getWeeklyCompletionData(Object.values(tasks));

  const isDark = theme === 'dark';
  const lineColor = isDark ? '#818cf8' : '#4f46e5';
  const gridColor = isDark ? '#27272a' : '#f4f4f5';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 p-6 rounded-3xl shadow-sm"
    >
      <div className="mb-6">
        <h3 className="text-zinc-900 dark:text-zinc-100 font-semibold text-lg">Weekly Momentum</h3>
        <p className="text-zinc-500 text-sm">Tasks completed over the last 7 days</p>
      </div>

      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? '#71717a' : '#a1a1aa', fontSize: 12 }}
              dy={10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#18181b' : '#ffffff',
                border: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}`,
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              itemStyle={{ color: isDark ? '#f4f4f5' : '#18181b' }}
              cursor={{ stroke: isDark ? '#3f3f46' : '#d4d4d8', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="tasks"
              stroke={lineColor}
              strokeWidth={4}
              dot={{
                r: 4,
                fill: lineColor,
                strokeWidth: 2,
                stroke: isDark ? '#18181b' : '#ffffff',
              }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
