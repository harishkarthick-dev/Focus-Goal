import { PageHeader } from '@/components/ui/page-header';
import { Briefcase } from 'lucide-react';

export const metadata = {
  title: 'Careers | Tasky',
  description: 'Join the team building the future of productivity.',
};

export default function CareersPage() {
  return (
    <div className="container px-4 mx-auto pb-24 text-center">
      <PageHeader title="Careers" description="Help us build the most elegant productivity tool." />

      <div className="max-w-md mx-auto p-8 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center">
        <Briefcase className="w-10 h-10 text-zinc-400 mb-4" />
        <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
          No Openings Right Now
        </h3>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
          We&apos;re a small team at the moment. improved but check back later!
        </p>
      </div>
    </div>
  );
}
