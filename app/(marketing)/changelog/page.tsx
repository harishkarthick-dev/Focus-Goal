import { PageHeader } from '@/components/ui/page-header';
import { History } from 'lucide-react';

export const metadata = {
  title: 'Changelog | Tasky',
  description: "See what's new in Tasky.",
};

export default function ChangelogPage() {
  return (
    <div className="container px-4 mx-auto pb-24 text-center">
      <PageHeader title="Changelog" description="New features and improvements." />

      <div className="max-w-md mx-auto p-8 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center">
        <History className="w-10 h-10 text-zinc-400 mb-4" />
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">Version 1.0.0</h3>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          Initial release of Tasky - Local-first task manager.
        </p>
      </div>
    </div>
  );
}
