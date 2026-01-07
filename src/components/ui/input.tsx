import * as React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "children"> {
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
  children?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, children, ...props }, ref) => {
    const StartIcon = startIcon;
    const EndIcon = endIcon;

    return (
      <div className="relative w-full">
        {StartIcon && (
          <div className="absolute top-1/2 left-4 -translate-y-1/2 transform">
            <StartIcon size={24} className="text-muted-foreground" />
          </div>
        )}
        <input
          type={type}
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-muted-foreground/40 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-xs shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-xs disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm lg:text-sm lg:placeholder:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            startIcon ? "py-6 pl-12" : "",
            endIcon ? "pr-8" : "",
            className,
          )}
          ref={ref}
          {...props}
        />
        {EndIcon && (
          <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
            <EndIcon className="text-muted-foreground" size={18} />
          </div>
        )}

        {/* render error icon or warning message */}
        {children && (
          <div className="absolute top-1/2 right-10 -translate-y-1/2 transform">
            {children}
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
