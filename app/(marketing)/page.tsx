import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { LandingRedirect } from '@/components/landing/LandingRedirect';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tasky - Reclaim Your Focus',
  description:
    'Experience the most beautiful way to manage tasks, notes, and goals. Offline-capable, privacy-focused, and designed for flow.',
};

export default function LandingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Tasky',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'A beautiful, local-first productivity app designed to bring clarity, focus, and joy to your daily planning.',
    featureList: 'Task Management, Rich Text Notes, Goal Tracking, Focus Timer, Offline Capability',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingRedirect />
      <Hero />
      <Features />
    </>
  );
}
