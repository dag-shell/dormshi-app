import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BottomSheet } from '@/components/common/BottomSheet';
import { MoneyField } from '@/components/common/MoneyField';

interface ChangeProposalSheetProps {
  open: boolean;
  onClose: () => void;
  request?: unknown;
  counterpartName?: string;
}

export function ChangeProposalSheet({ counterpartName = 'Jordan', open, onClose }: ChangeProposalSheetProps) {
  const [food, setFood] = useState('14.50');
  const [fee, setFee] = useState('3.00');
  const [eta, setEta] = useState('20');
  const [reason, setReason] = useState('Menu price was slightly higher at the counter.');

  const f = parseFloat(food) || 0;
  const d = parseFloat(fee) || 0;
  const newTotal = (f + d).toFixed(2);

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="Propose a change"
      description={`Both of you must agree. ${counterpartName} can approve or decline.`}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <MoneyField id="chg-food" label="Food cost" value={food} onChange={setFood} />
          <MoneyField id="chg-fee" label="Delivery fee" value={fee} onChange={setFee} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="chg-eta">Estimated time (minutes)</Label>
          <Input
            id="chg-eta"
            inputMode="numeric"
            value={eta}
            onChange={(e) => setEta(e.target.value.replace(/\D/g, ''))}
            className="h-10 font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="chg-reason">Reason</Label>
          <Textarea
            id="chg-reason"
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Menu price was higher than listed"
          />
        </div>
        <div className="flex items-center justify-between rounded-lg bg-secondary px-4 py-3 text-sm">
          <span className="text-muted-foreground">New total</span>
          <span className="font-mono font-semibold">{newTotal} DC</span>
        </div>
        <Button size="lg" className="h-11 w-full" onClick={onClose}>
          Send proposal
        </Button>
      </div>
    </BottomSheet>
  );
}