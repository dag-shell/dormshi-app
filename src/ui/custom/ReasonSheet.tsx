import React, { useEffect, useState } from 'react';
import { Button } from '@/ui/button';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/ui/radio-group';
import { BottomSheet } from '@/ui/custom/BottomSheet';
import { cn } from '@/lib/utils';

interface ReasonSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  reasons: string[];
  note: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: (reason: string) => void;
}

export function ReasonSheet({ open, onClose, title, description, reasons, note, confirmLabel, destructive, onConfirm }: ReasonSheetProps) {
  const [selected, setSelected] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setSelected('');
      setDetails('');
      setError('');
    }
  }, [open]);

  const submit = () => {
    if (!selected) {
      setError('Choose a reason to continue');
      return;
    }
    onConfirm(details.trim() ? `${selected}: ${details.trim()}` : selected);
  };

  return (
    <BottomSheet open={open} onClose={onClose} title={title} description={description}>
      <RadioGroup
        value={selected}
        onValueChange={(val) => {
          setSelected(val);
          setError('');
        }}
        className="space-y-2"
      >
        {reasons.map((r) => {
          const isSelected = selected === r;
          const id = `reason-${r.toLowerCase().replace(/\s+/g, '-')}`;
          return (
            <label
              key={r}
              htmlFor={id}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-colors',
                isSelected ? 'border-primary bg-primary-soft' : 'bg-card hover:bg-secondary'
              )}
            >
              <RadioGroupItem value={r} id={id} />
              <span className="font-medium text-foreground">{r}</span>
            </label>
          );
        })}
      </RadioGroup>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      <div className="mt-4 space-y-2">
        <Label htmlFor="reason-details">Details (optional)</Label>
        <Textarea id="reason-details" rows={2} value={details} onChange={(e) => setDetails(e.target.value)} />
      </div>
      <p className="mt-4 rounded-lg bg-secondary px-4 py-3 text-xs leading-5 text-muted-foreground">{note}</p>
      <Button variant={destructive ? 'destructive' : 'default'} size="lg" className="mt-4 h-11 w-full" onClick={submit}>
        {confirmLabel}
      </Button>
    </BottomSheet>
  );
}