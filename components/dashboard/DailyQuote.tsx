import { useMemo } from 'react';
import { Quote as QuoteIcon } from 'lucide-react';
import { quotes } from '@/data/quotes';

export function DailyQuote() {
  const quote = useMemo(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);

    const quoteIndex = dayOfYear % quotes.length;
    return quotes[quoteIndex];
  }, []);

  return (
    <div className="h-full min-h-[250px] relative rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-700 to-indigo-800 p-8 text-white flex flex-col justify-between shadow-xl shadow-indigo-900/20 overflow-hidden group hover:shadow-2xl hover:shadow-indigo-900/40 transition-shadow duration-500">
      <QuoteIcon className="absolute top-8 left-8 w-16 h-16 text-white/10 transform -scale-x-100 rotate-12" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-transparent to-black/20 pointer-events-none" />

      <div className="relative z-10 mt-6">
        <p className="text-2xl md:text-3xl font-serif leading-relaxed font-medium text-white/95 drop-shadow-sm line-clamp-4">
          &ldquo;{quote.text}&rdquo;
        </p>
      </div>

      <div className="relative z-10 flex items-center gap-3 mt-8">
        <div className="h-0.5 w-12 bg-indigo-300/50"></div>
        <span className="text-indigo-200 font-bold tracking-widest text-xs uppercase">
          {quote.author}
        </span>
      </div>
    </div>
  );
}
