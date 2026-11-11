import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0b14] disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/25': variant === 'default',
            'bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-600/25': variant === 'secondary',
            'border border-[#1e2044] bg-transparent text-slate-300 hover:bg-[#1a1b35] hover:text-white hover:border-[#2e3064]': variant === 'outline',
            'text-slate-300 hover:bg-[#1a1b35] hover:text-white': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/25': variant === 'destructive',
            'text-blue-400 hover:text-blue-300 underline-offset-4 hover:underline p-0 h-auto': variant === 'link',
          },
          {
            'h-10 px-5 text-sm': size === 'default',
            'h-8 px-3 text-xs': size === 'sm',
            'h-12 px-8 text-base': size === 'lg',
            'h-10 w-10 p-0': size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
