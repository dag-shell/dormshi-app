import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';

interface SingleSelectProps {
  id: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  invalid?: boolean;
  describedBy?: string;
}

/** Searchable select that allows exactly one option. Matches MultiSelect styling. */
export function SingleSelect({ id, options, value, onChange, placeholder = 'Select…', invalid, describedBy }: SingleSelectProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);

  const filtered = options.filter((o) => o.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  useEffect(() => setHighlight(0), [query]);

  const select = (option: string) => {
    onChange(option);
    setQuery('');
    setOpen(false);
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
      if (open && filtered[highlight]) select(filtered[highlight]);else
      setOpen(true);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <div
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
        className={`flex h-10 cursor-text items-center rounded-md border bg-card pl-3 pr-16 focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring ${
        invalid ? 'border-destructive' : 'border-input'}`
        }>
        
        <input
          ref={inputRef}
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-invalid={invalid}
          aria-describedby={describedBy}
          value={open ? query : value}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={value && open ? value : placeholder}
          className={`h-full w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground ${value && !open ? 'font-medium' : ''}`} />
        
        {value &&
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChange('');
            setQuery('');
          }}
          aria-label="Clear selection"
          className="absolute right-8 grid size-6 place-items-center rounded text-muted-foreground hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          
            <X className="size-3" />
          </button>
        }
        <ChevronDown className="pointer-events-none absolute right-3 size-4 text-muted-foreground" aria-hidden="true" />
      </div>

      {open &&
      <ul
        id={listId}
        role="listbox"
        className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-popover p-1 shadow-[0_1px_2px_rgba(31,27,22,0.06),0_16px_40px_rgba(31,27,22,0.12)]">
        
          {filtered.length === 0 ?
        <li className="px-3 py-2 text-sm text-muted-foreground">No matching places</li> :

        filtered.map((o, i) => {
          const selected = value === o;
          return (
            <li
              key={o}
              role="option"
              aria-selected={selected}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => select(o)}
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