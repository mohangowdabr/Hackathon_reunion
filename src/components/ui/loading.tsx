import { cn } from '@/lib/utils';

export function Spinner({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };
  return (
    <div className={cn('animate-spin rounded-full border-2 border-[#1e2044] border-t-blue-500', sizeClasses[size], className)} />
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-slate-400">Loading...</p>
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-[#1e2044] bg-[#111225] p-6 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-[#1a1b35]" />
        <div className="flex-1">
          <div className="h-4 bg-[#1a1b35] rounded w-3/4 mb-2" />
          <div className="h-3 bg-[#1a1b35] rounded w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-[#1a1b35] rounded w-full mb-2" />
      <div className="h-3 bg-[#1a1b35] rounded w-5/6 mb-4" />
      <div className="flex gap-2">
        <div className="h-6 bg-[#1a1b35] rounded-full w-16" />
        <div className="h-6 bg-[#1a1b35] rounded-full w-20" />
      </div>
    </div>
  );
}
