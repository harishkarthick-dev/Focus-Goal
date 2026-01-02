import { PageHeader } from '@/components/ui/page-header';
import { Book } from 'lucide-react';

export const metadata = {
  title: 'Documentation | Tasky',
  description: 'Learn how to use Tasky effectively.',
};

export default function DocsPage() {
  return (
    <div className="container px-4 mx-auto pb-24 text-center">
      <PageHeader title="Documentation" description="User guides and tutorials." />

      <div className="max-w-md mx-auto p-8 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center">
        <Book className="w-10 h-10 text-zinc-400 mb-4" />
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
          Docs are being written
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          We are compiling comprehensive guides to help you master Tasky.
        </p>
      </div>
    </div>
  );
}
