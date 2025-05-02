import { cn } from '@/lib/utils';
import * as React from 'react';

interface EditableInputProps extends React.ComponentProps<'input'> {
  isEditable: boolean;
}

const EditableInput = React.forwardRef<HTMLInputElement, EditableInputProps>(
  ({ className, type, isEditable, ...props }, ref) => {
    return (
      <div className="w-full relative">
        <input
          type={type}
          className={cn(
            `file:text-foreground placeholder:text-muted-foreground selection:bg-primary placeholder:text-xs lg:placeholder:text-sm selection:text-primary-foreground dark:bg-EditableInput/30 border-muted-foreground/40 flex w-full min-w-0  border bg-transparent py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive rounded-none px-0 shadow-none focus:outline-none focus:ring-0 focus-visible:ring-0 ${
              isEditable
                ? 'focus:border-b-2 py-1 border-0 border-b border-input'
                : 'focus:border-b-0 py-1 border-none'
            }`,
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  }
);
EditableInput.displayName = 'EditableInput';

export { EditableInput };
