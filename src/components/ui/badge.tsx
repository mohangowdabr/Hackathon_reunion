import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline';
  size?: 'default' | 'sm';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        {
          'bg-blue-500/15 text-blue-400 border border-blue-500/25': variant === 'default',
          'bg-violet-500/15 text-violet-400 border border-violet-500/25': variant === 'secondary',
          'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25': variant === 'success',
          'bg-amber-500/15 text-amber-400 border border-amber-500/25': variant === 'warning',
          'bg-red-500/15 text-red-400 border border-red-500/25': variant === 'destructive',
          'bg-transparent text-slate-400 border border-[#1e2044]': variant === 'outline',
        },
        {
          'px-3 py-1 text-xs': size === 'default',
          'px-2 py-0.5 text-[10px]': size === 'sm',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
