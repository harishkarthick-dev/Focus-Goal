import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  className?: string;
}

export function PageHeader({
  title,
  description,
  subtitle,
  icon: Icon,
  iconColor,
  className,
}: PageHeaderProps) {
  const isAppVariant = !!Icon;

  if (isAppVariant) {
    return (
      <div className={cn('flex items-start gap-4 mb-8', className)}>
        {Icon && (
          <div
            className={cn(
              'p-3 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm border border-zinc-200 dark:border-zinc-700',
              iconColor
            )}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
        <div className="flex-1 pt-1">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
            {title}
          </h1>
          {(subtitle || description) && (
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-1">
              {subtitle || description}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('py-24 px-4 text-center', className)}>
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-zinc-900 dark:text-zinc-50 mb-6">
        {title}
      </h1>
      {description && (
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">{description}</p>
      )}
    </div>
  );
}
