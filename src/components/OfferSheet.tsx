import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from './Button';
import { Input } from './Input';
import { Label } from './Label';
import { Textarea } from './Textarea';
import { BottomSheet } from './BottomSheet';
import { MoneyField } from './MoneyField';
import { useDormshi } from '../contexts/DormshiContext';
import { formatDC, firstName, roundDC } from '../utils/format';
import type { FoodRequest } from '../types/dormshi';

interface OfferSheetProps {
  request: FoodRequest | null;
  onClose: () => void;
}

const etaPresets = [10, 15, 20, 30];

export function OfferSheet({ request, onClose }: OfferSheetProps) {
  const { submitOffer, getUser } = useDormshi();
  const [foodPrice, setFoodPrice] = useState('');
  const [deliveryFee, setDeliveryFee] = useState('2.50');
  const [eta, setEta] = useState('15');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (request) {
      setFoodPrice('');
      setDeliveryFee('2.50');
      setEta('15');
      setNote('');
      setErrors({});
    }
  }, [request?.id]);

  const food = parseFloat(foodPrice);
  const fee = parseFloat(deliveryFee);
  const minutes = parseInt(eta, 10);
  const total = roundDC((Number.isFinite(food) ? food : 0) + (Number.isFinite(fee) ? fee : 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!request) return;
    const next: Record<string, string> = {};
    if (!Number.isFinite(food) || food <= 0) next.foodPrice = 'Enter the food cost';
    if (!Number.isFinite(fee) || fee < 0) next.deliveryFee = 'Enter a delivery fee (0 or more)';
    if (!Number.isFinite(minutes) || minutes < 1 || minutes > 180) next.eta = 'Between 1 and 180 minutes';
    setErrors(next);
    if (Object.keys(next).length) return;
    submitOffer(request.id, { foodPrice: roundDC(food), deliveryFee: roundDC(fee), etaMinutes: minutes, note: note.trim() || undefined });
    toast.success(`Offer sent to ${firstName(getUser(request.requesterId).name)}`, {
      description: 'You’ll be notified if they accept.'
    });
    onClose();
  };

  return (
    <BottomSheet
      open={!!request}
      onClose={onClose}
      title="Make an offer"
      description={request ? request.food : undefined}>
      
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <MoneyField id="offer-food" label="Food cost" value={foodPrice} onChange={setFoodPrice} error={errors.foodPrice} placeholder="0.00" />
          <MoneyField id="offer-fee" label="Delivery fee" value={deliveryFee} onChange={setDeliveryFee} error={errors.deliveryFee} placeholder="0.00" />
        </div>

        <fieldset>
          <legend className="text-sm font-medium">Estimated delivery time</legend>
          <div className="mt-2 flex gap-2">
            {etaPresets.map((p) =>
            <button
              key={p}
              type="button"
              onClick={() => setEta(String(p))}
              aria-pressed={eta === String(p)}
              className={`h-9 flex-1 rounded-lg border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              eta === String(p) ? 'border-primary bg-primary-soft text-primary' : 'bg-card hover:bg-secondary'}`
              }>
              
                {p} min
              </button>
            )}
            <Input
              aria-label="Custom minutes"
              inputMode="numeric"
              value={eta}
              onChange={(e) => setEta(e.target.value.replace(/\D/g, ''))}
              className="h-9 w-16 text-center"
              aria-invalid={!!errors.eta} />
            
          </div>
          {errors.eta && <p className="mt-2 text-xs text-destructive">{errors.eta}</p>}
        </fieldset>

        <div className="space-y-2">
          <Label htmlFor="offer-note">Note (optional)</Label>
          <Textarea id="offer-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. I’m already at the store" rows={2} />
        </div>

        <div className="flex items-center justify-between rounded-lg bg-secondary px-4 py-3 text-sm">
          <span className="text-muted-foreground">Requester pays</span>
          <span className="font-mono font-semibold">{formatDC(total)}</span>
        </div>

        <Button type="submit" size="lg" className="h-11 w-full text-sm">
          Send offer
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          The requester chooses which offer to accept. Terms lock once accepted.
        </p>
      </form>
    </BottomSheet>);

}