import type { Metadata } from 'next';
import { Outfit, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { DotBackground } from '@/components/ui/dot-background';

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Tasky - Radiant Productivity',
    template: '%s | Tasky',
  },
  description:
    'A beautiful, local-first productivity app designed to bring clarity, focus, and joy to your daily planning.',
  keywords: [
    'productivity',
    'task manager',
    'to-do list',
    'notes app',
    'goal tracker',
    'local-first',
    'offline capable',
  ],
  authors: [{ name: 'Tasky Team' }],
  creator: 'Tasky',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tasky.app',
    title: 'Tasky - Radiant Productivity',
    description: 'Organize your life with elegance. A beautiful, local-first productivity app.',
    siteName: 'Tasky',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tasky - Radiant Productivity',
    description: 'Organize your life with elegance. A beautiful, local-first productivity app.',
    creator: '@taskyapp',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Tasky',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${playfair.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <DotBackground />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
