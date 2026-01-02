import Link from 'next/link';
import { CheckCircle2, Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm">
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-amber-500 rounded-lg p-1">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Tasky
              </span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
              A crafted workspace designed to bring clarity, focus, and joy to your daily planning.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-zinc-400 hover:text-amber-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-amber-500 transition-colors">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-amber-500 transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/#features" className="hover:text-amber-500 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-amber-500 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="hover:text-amber-500 transition-colors">
                  Changelog
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-amber-500 transition-colors">
                  Docs
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/about" className="hover:text-amber-500 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-amber-500 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-amber-500 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-zinc-900 dark:text-zinc-50">Stay Updated</h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Join our newsletter for tips and productivity hacks.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
              />
              <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-sm text-zinc-500 dark:text-zinc-400">
          © {new Date().getFullYear()} Tasky Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
