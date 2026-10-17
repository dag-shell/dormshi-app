import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '../Button';
import { Input } from '../Input';
import { Label } from '../Label';
import { Textarea } from '../Textarea';
import { BottomSheet } from '../BottomSheet';
import { MoneyField } from '../MoneyField';
import { useDormshi } from '../../contexts/DormshiContext';
import { firstName, formatAmount, formatDC, roundDC } from '../../utils/format';
import { totalOf } from '../../utils/orders';
import type { FoodRequest } from '../../types/dormshi';

interface ChangeProposalSheetProps {
  request: FoodRequest;
  counterpartName: string;
  open: boolean;
  onClose: () => void;
}

export function ChangeProposalSheet({ request, counterpartName, open, onClose }: ChangeProposalSheetProps) {
  const { proposeChange } = useDormshi();
  const agreement = request.agreement;
  const [food, setFood] = useState('');
  const [fee, setFee] = useState('');
  const [eta, setEta] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && agreement) {
      setFood(formatAmount(agreement.foodPrice));
      setFee(formatAmount(agreement.deliveryFee));
      setEta(String(agreement.etaMinutes));
      setReason('');
      setError('');
    }
  }, [open]);

  if (!agreement) return null;
  const f = parseFloat(food);
  const d = parseFloat(fee);
  const m = parseInt(eta, 10);
  const newTotal = roundDC((f || 0) + (d || 0));
  const diff = roundDC(newTotal - totalOf(agreement));

  const submit = () => {
    if (!Number.isFinite(f) || f <= 0 || !Number.isFinite(d) || d < 0 || !Number.isFinite(m) || m < 1) {
      setError('Enter valid amounts and time.');
      return;
    }
    if (f === agreement.foodPrice && d === agreement.deliveryFee && m === agreement.etaMinutes) {
      setError('Change at least one term.');
      return;
    }
    if (!reason.trim()) {
      setError(`Tell ${firstName(counterpartName)} why the terms need to change.`);
      return;
    }
    proposeChange(request.id, { foodPrice: roundDC(f), deliveryFee: roundDC(d), etaMinutes: m, reason: reason.trim() });
    toast(`Change sent to ${firstName(counterpartName)}`, { description: 'Current terms stay locked until they approve.' });
    onClose();
  };

  return (
    <BottomSheet open={open} onClose={onClose} title="Propose a change" description={`Both of you must agree. ${firstName(counterpartName)} can approve or decline.`}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <MoneyField id="chg-food" label="Food cost" value={food} onChange={setFood} />
          <MoneyField id="chg-fee" label="Delivery fee" value={fee} onChange={setFee} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="chg-eta">Estimated time (minutes)</Label>
          <Input id="chg-eta" inputMode="numeric" value={eta} onChange={(e) => setEta(e.target.value.replace(/\D/g, ''))} className="h-10 font-mono" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="chg-reason">Reason</Label>
          <Textarea id="chg-reason" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Menu price was higher than listed" />
        </div>
        <div className="flex items-center justify-between rounded-lg bg-secondary px-4 py-3 text-sm">
          <span className="text-muted-foreground">New total</span>
          <span className="font-mono font-semibold">
            {formatDC(newTotal)}
            {diff !== 0 && <span className="ml-1 text-xs text-muted-foreground">({diff > 0 ? '+' : ''}{formatAmount(diff)})</span>}
          </span>
        </div>
        {error && <p className="text-xs text-destructive" role="alert">{error}</p>}
        <Button size="lg" className="h-11 w-full" onClick={submit}>Send proposal</Button>
      </div>
    </BottomSheet>);

}