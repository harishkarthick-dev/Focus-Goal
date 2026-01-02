import { PageHeader } from '@/components/ui/page-header';
import { AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Blog | Tasky',
  description: 'Productivity tips and company news.',
};

export default function BlogPage() {
  return (
    <div className="container px-4 mx-auto pb-24 text-center">
      <PageHeader title="Blog" description="Thoughts on productivity, design, and flow." />

      <div className="max-w-md mx-auto p-8 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center">
        <AlertCircle className="w-10 h-10 text-zinc-400 mb-4" />
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">Coming Soon</h3>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          We&apos;re currently writing our first post. Stay tuned!
        </p>
      </div>
    </div>
  );
}
