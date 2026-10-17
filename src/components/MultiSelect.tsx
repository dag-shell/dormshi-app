import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown, Minus, Plus, X } from 'lucide-react';

interface MultiSelectProps {
  id: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  invalid?: boolean;
  describedBy?: string;
  /** Optional per-item quantities. When provided, each tag shows − / + controls. */
  quantities?: Record<string, number>;
  onQuantityChange?: (item: string, qty: number) => void;
  maxQuantity?: number;
}

export function MultiSelect({
  id,
  options,
  value,
  onChange,
  placeholder = 'Select…',
  invalid,
  describedBy,
  quantities,
  onQuantityChange,
  maxQuantity = 9
}: MultiSelectProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);

  const filtered = options.filter((o) => o.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  useEffect(() => setHighlight(0), [query]);

  const toggle = (option: string) => {
    onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);
    setQuery('');
    inputRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (open && filtered[highlight]) toggle(filtered[highlight]);else
      setOpen(true);
    } else if (e.key === 'Escape') {
      setOpen(false);
    } else if (e.key === 'Backspace' && !query && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <div
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
        className={`flex min-h-10 cursor-text flex-wrap items-center gap-1 rounded-md border bg-card py-1 pl-1 pr-8 focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring ${
        invalid ? 'border-destructive' : 'border-input'}`
        }>
        
        {value.map((v) => {
          const qty = quantities?.[v] ?? 1;
          return (
            <span key={v} className="inline-flex h-7 items-center gap-1 rounded-md bg-primary-soft pl-2 pr-1 text-sm font-medium text-primary">
            {v}
            {onQuantityChange &&
              <span className="ml-1 inline-flex items-center rounded bg-card text-foreground" role="group" aria-label={`Quantity for ${v}`}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuantityChange(v, qty - 1);
                  }}
                  disabled={qty <= 1}
                  aria-label={`Decrease ${v}`}
                  className="grid size-5 place-items-center rounded hover:bg-secondary disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  
                  <Minus className="size-3" />
                </button>
                <span className="w-4 text-center font-mono text-xs" aria-live="polite">{qty}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuantityChange(v, qty + 1);
                  }}
                  disabled={qty >= maxQuantity}
                  aria-label={`Increase ${v}`}
                  className="grid size-5 place-items-center rounded hover:bg-secondary disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  
                  <Plus className="size-3" />
                </button>
              </span>
              }
            <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(value.filter((x) => x !== v));
                }}
                aria-label={`Remove ${v}`}
                className="grid size-5 place-items-center rounded hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                
              <X className="size-3" />
            </button>
          </span>);

        })}
        <input
          ref={inputRef}
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-invalid={invalid}
          aria-describedby={describedBy}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={value.length ? '' : placeholder}
          className="h-7 min-w-24 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground" />
        
        <ChevronDown className="pointer-events-none absolute right-3 top-3 size-4 text-muted-foreground" aria-hidden="true" />
      </div>

      {open &&
      <ul
        id={listId}
        role="listbox"
        aria-multiselectable="true"
        className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-popover p-1 shadow-[0_1px_2px_rgba(31,27,22,0.06),0_16px_40px_rgba(31,27,22,0.12)]">
        
          {filtered.length === 0 ?
        <li className="px-3 py-2 text-sm text-muted-foreground">No matching items</li> :

        filtered.map((o, i) => {
          const selected = value.includes(o);
          return (
            <li
              key={o}
              role="option"
              aria-selected={selected}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => toggle(o)}
              onMouseEnter={() => setHighlight(i)}
              className={`flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm ${i === highlight ? 'bg-secondary' : ''}`}>
              
                  {o}
                  {selected && <Check className="size-4 text-primary" aria-hidden="true" />}
                </li>);

        })
        }
        </ul>
      }
    </div>);

}