import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MoneyFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
  unit?: string;
}

export function MoneyField({ id, label, value, onChange, error, placeholder = '0.00', unit = 'DC' }: MoneyFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          inputMode="decimal"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ''))}
          aria-invalid={!!error}
          className="h-10 pr-11 font-mono" />
        
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">{unit}</span>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>);

}