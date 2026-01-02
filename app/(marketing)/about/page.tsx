import { PageHeader } from '@/components/ui/page-header';

export const metadata = {
  title: 'About Us | Tasky',
  description: 'We are building the future of productivity.',
};

export default function AboutPage() {
  return (
    <div className="container px-4 mx-auto pb-24">
      <PageHeader
        title="About Tasky"
        description="Building the most elegant workspace for your mind."
      />

      <div className="max-w-2xl mx-auto prose dark:prose-invert">
        <p>
          Tasky was born from a simple frustration: productivity tools were becoming too complex. We
          wanted a tool that felt like a quiet room—a place where you could hear yourself think.
        </p>
        <p>
          We believe in <strong>local-first software</strong>. Your data belongs to you. That&apos;s
          why Tasky works completely offline and only syncs when you want it to.
        </p>
        <p>
          Our mission is to help you clear your mind, focus on what matters, and actually enjoy the
          process of planning your day.
        </p>
      </div>
    </div>
  );
}
