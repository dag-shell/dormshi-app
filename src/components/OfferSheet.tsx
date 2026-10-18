import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BottomSheet } from './BottomSheet';
import { MoneyField } from './MoneyField';

interface OfferSheetProps {
  request?: { id?: string; food?: string } | null;
  onClose: () => void;
}

const etaPresets = [10, 15, 20, 30];

export function OfferSheet({ request, onClose }: OfferSheetProps) {
  const [foodPrice, setFoodPrice] = useState('12.50');
  const [deliveryFee, setDeliveryFee] = useState('2.50');
  const [eta, setEta] = useState('15');
  const [note, setNote] = useState('Already at the dining hall, can grab it right away!');

  const food = parseFloat(foodPrice) || 0;
  const fee = parseFloat(deliveryFee) || 0;
  const total = (food + fee).toFixed(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <BottomSheet
      open={!!request}
      onClose={onClose}
      title="Make an offer"
      description={request?.food ?? '2 large taro milk teas, 50% sugar, with boba'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <MoneyField id="offer-food" label="Food cost" value={foodPrice} onChange={setFoodPrice} placeholder="0.00" />
          <MoneyField id="offer-fee" label="Delivery fee" value={deliveryFee} onChange={setDeliveryFee} placeholder="0.00" />
        </div>

        <fieldset>
          <legend className="text-sm font-medium">Estimated delivery time</legend>
          <div className="mt-2 flex gap-2">
            {etaPresets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setEta(String(p))}
                aria-pressed={eta === String(p)}
                className={`h-9 flex-1 rounded-lg border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  eta === String(p) ? 'border-primary bg-primary-soft text-primary' : 'bg-card hover:bg-secondary'
                }`}
              >
                {p} min
              </button>
            ))}
            <Input
              aria-label="Custom minutes"
              inputMode="numeric"
              value={eta}
              onChange={(e) => setEta(e.target.value.replace(/\D/g, ''))}
              className="h-9 w-16 text-center"
            />
          </div>
        </fieldset>

        <div className="space-y-2">
          <Label htmlFor="offer-note">Note (optional)</Label>
          <Textarea
            id="offer-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. I’m already at the store"
            rows={2}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg bg-secondary px-4 py-3 text-sm">
          <span className="text-muted-foreground">Requester pays</span>
          <span className="font-mono font-semibold">{total} DC</span>
        </div>

        <Button type="submit" size="lg" className="h-11 w-full text-sm">
          Send offer
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          The requester chooses which offer to accept. Terms lock once accepted.
        </p>
      </form>
    </BottomSheet>
  );
}