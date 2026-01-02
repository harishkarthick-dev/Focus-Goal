import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { Footer } from '@/components/landing/Footer';
import { DotBackground } from '@/components/ui/dot-background';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 selection:bg-amber-500/30">
      <DotBackground className="fixed inset-0 pointer-events-none opacity-40" />
      <LandingNavbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
