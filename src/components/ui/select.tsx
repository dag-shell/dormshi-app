import * as React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelectContext = React.createContext<SelectContextValue>({
  open: false,
  setOpen: () => undefined,
});

interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function Select({ value: controlledValue, defaultValue, onValueChange, open: controlledOpen, onOpenChange, children }: SelectProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue || '');
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);

  const isControlledValue = controlledValue !== undefined;
  const isControlledOpen = controlledOpen !== undefined;

  const value = isControlledValue ? controlledValue : uncontrolledValue;
  const open = isControlledOpen ? controlledOpen : uncontrolledOpen;

  const handleOpenChange: React.Dispatch<React.SetStateAction<boolean>> = React.useCallback(
    (nextAction) => {
      const resolved = typeof nextAction === 'function' ? nextAction(open) : nextAction;
      if (!isControlledOpen) {
        setUncontrolledOpen(resolved);
      }
      onOpenChange?.(resolved);
    },
    [isControlledOpen, onOpenChange, open]
  );

  const handleValueChange = React.useCallback(
    (nextVal: string) => {
      if (!isControlledValue) {
        setUncontrolledValue(nextVal);
      }
      onValueChange?.(nextVal);
      handleOpenChange(false);
    },
    [handleOpenChange, isControlledValue, onValueChange]
  );

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange: handleValueChange,
        open,
        setOpen: handleOpenChange,
      }}
    >
      <div className="relative inline-block w-full">{children}</div>
    </SelectContext.Provider>
  );
}

const SelectGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('p-1', className)} {...props} />
);
SelectGroup.displayName = 'SelectGroup';

interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
}

const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className, placeholder, children, ...props }, ref) => {
    const { value } = React.useContext(SelectContext);
    return (
      <span ref={ref} className={cn('block truncate', className)} {...props}>
        {children || value || placeholder}
      </span>
    );
  }
);
SelectValue.displayName = 'SelectValue';

const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = React.useContext(SelectContext);

    return (
      <button
        ref={ref}
        type="button"
        role="combobox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-card px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
    );
  }
);
SelectTrigger.displayName = 'SelectTrigger';

const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { open, setOpen } = React.useContext(SelectContext);
    const contentRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      if (!open) return;
      const handleClickOutside = (e: MouseEvent) => {
        if (contentRef.current && !contentRef.current.parentElement?.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open, setOpen]);

    if (!open) return null;

    return (
      <div
        ref={ref || contentRef}
        className={cn(
          'absolute left-0 top-full z-50 mt-1 max-h-60 w-full min-w-[8rem] overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
SelectContent.displayName = 'SelectContent';

const SelectLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('px-2 py-1.5 text-xs font-semibold text-muted-foreground', className)} {...props} />
  )
);
SelectLabel.displayName = 'SelectLabel';

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = React.useContext(SelectContext);
    const isSelected = selectedValue === value;

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={isSelected}
        onClick={() => onValueChange?.(value)}
        className={cn(
          'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-secondary hover:text-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          isSelected && 'bg-secondary font-medium',
          className
        )}
        {...props}
      >
        <span className="truncate">{children}</span>
        {isSelected && (
          <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
            <Check className="h-4 w-4 text-primary" />
          </span>
        )}
      </div>
    );
  }
);
SelectItem.displayName = 'SelectItem';

const SelectSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('-mx-1 my-1 h-px bg-muted', className)} {...props} />
  )
);
SelectSeparator.displayName = 'SelectSeparator';

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
};
