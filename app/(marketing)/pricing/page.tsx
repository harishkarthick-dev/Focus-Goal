import { PageHeader } from '@/components/ui/page-header';
import { MotionButton } from '@/components/ui/motion-button';
import { Check } from 'lucide-react';

export const metadata = {
  title: 'Pricing | Tasky',
  description: 'Simple, transparent pricing for everyone.',
};

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    features: ['Unlimited Tasks', '3 Projects', 'Basic Notes', 'Sync 1 Device'],
  },
  {
    name: 'Pro',
    price: '$9',
    description: 'For power users',
    features: [
      'Unlimited Everything',
      'Advanced Analytics',
      'Priority Support',
      'Sync Unlimited Devices',
      'Collaborative Lists',
    ],
    popular: true,
  },
];

export default function PricingPage() {
  return (
    <div className="container px-4 mx-auto pb-24">
      <PageHeader title="Simple Pricing" description="Start for free, upgrade when you need to." />

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {tiers.map(tier => (
          <div
            key={tier.name}
            className={`relative p-8 rounded-3xl border ${tier.popular ? 'border-amber-500 bg-amber-500/5' : 'border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50'} backdrop-blur-sm`}
          >
            {tier.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                Most Popular
              </span>
            )}
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">{tier.name}</h3>
            <div className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              {tier.price}
              <span className="text-lg font-normal text-zinc-500">/mo</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">{tier.description}</p>

            <ul className="space-y-3 mb-8">
              {tier.features.map(feature => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300"
                >
                  <Check className="w-5 h-5 text-amber-500" />
                  {feature}
                </li>
              ))}
            </ul>

            <MotionButton className="w-full justify-center">
              {tier.name === 'Free' ? 'Get Started' : 'Upgrade to Pro'}
            </MotionButton>
          </div>
        ))}
      </div>
    </div>
  );
}
