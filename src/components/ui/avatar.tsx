'use client';

import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ src, alt, fallback, size = 'md', className }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || 'Avatar'}
        className={cn('rounded-full object-cover border-2 border-[#1e2044]', sizeClasses[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-[#1a1b35] border-2 border-[#1e2044] flex items-center justify-center font-semibold text-slate-400',
        sizeClasses[size],
        className
      )}
    >
      {fallback ? (
        fallback.slice(0, 2).toUpperCase()
      ) : (
        <User className="w-1/2 h-1/2" />
      )}
    </div>
  );
}
