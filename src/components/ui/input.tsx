import * as React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'children'> {
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
  children?: React.ReactNode; // manually allow children for the wrapper
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, children, ...props }, ref) => {
    const StartIcon = startIcon;
    const EndIcon = endIcon;

    return (
      <div className="w-full relative">
        {StartIcon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <StartIcon size={24} className="text-muted-foreground" />
          </div>
        )}
        <input
          type={type}
          className={cn(
            'file:text-foreground placeholder:text-muted-foreground selection:bg-primary placeholder:text-xs lg:placeholder:text-sm selection:text-primary-foreground dark:bg-input/30 border-muted-foreground/40 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            startIcon ? 'pl-12' : '',
            endIcon ? 'pr-8' : '',
            className
          )}
          ref={ref}
          {...props}
        />
        {EndIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <EndIcon className="text-muted-foreground" size={18} />
          </div>
        )}

        {/* render error icon or warning message */}
        {children && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            {children}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
