import { PageHeader } from '@/components/ui/page-header';
import { Mail } from 'lucide-react';

export const metadata = {
  title: 'Contact | Tasky',
  description: 'Get in touch with the Tasky team.',
};

export default function ContactPage() {
  return (
    <div className="container px-4 mx-auto pb-24 text-center">
      <PageHeader
        title="Get in Touch"
        description="Questions? Feedback? Just want to say hi? We'd love to hear from you."
      />

      <div className="inline-flex items-center gap-3 p-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
          <Mail className="w-6 h-6 text-amber-600 dark:text-amber-500" />
        </div>
        <div className="text-left">
          <div className="text-sm text-zinc-500 dark:text-zinc-400">Email us at</div>
          <a
            href="mailto:hello@tasky.app"
            className="text-xl font-bold text-zinc-900 dark:text-zinc-50 hover:text-amber-500 transition-colors"
          >
            hello@tasky.app
          </a>
        </div>
      </div>
    </div>
  );
}
