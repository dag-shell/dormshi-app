import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BottomSheet } from '@common/BottomSheet';
import { MoneyField } from '@common/MoneyField';
import { Switch } from '@/components/ui/switch';
import type { SentOfferData } from '@/components/home/SentOfferCard';

export interface RequestItem {
  name: string;
  quantity: number;
}

export interface OfferSheetProps {
  request?: {
    id?: string;
    food?: string;
    items?: RequestItem[];
    pickup?: string;
    destination?: string;
    requesterName?: string;
    requesterInitials?: string;
  } | null;
  onClose: () => void;
  onSubmitOffer?: (offer: SentOfferData) => void;
}

interface OfferItemState {
  name: string;
  quantity: number;
  price: string;
  available: boolean;
}

const etaPresets = [10, 15, 20, 30];

export function OfferSheet({ request, onClose, onSubmitOffer }: OfferSheetProps) {
  const [items, setItems] = useState<OfferItemState[]>([]);
  const [deliveryFee, setDeliveryFee] = useState('20.00');
  const [eta, setEta] = useState('15');
  const [note, setNote] = useState('Already at the counter, can pick it up right now!');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!request) return;
    if (request.items && request.items.length > 0) {
      setItems(
        request.items.map((i) => ({
          name: i.name,
          quantity: i.quantity || 1,
          price: '50',
          available: true
        }))
      );
    } else if (request.food) {
      setItems(
        request.food.split(',').map((part) => ({
          name: part.trim(),
          quantity: 1,
          price: '50',
          available: true
        }))
      );
    } else {
      setItems([
        { name: 'Iced oat latte', quantity: 1, price: '60', available: true },
        { name: 'Blueberry muffin', quantity: 1, price: '50', available: true }
      ]);
    }
  }, [request]);

  const handlePriceChange = (index: number, val: string) => {
    const clean = val.replace(/[^\d.]/g, '');
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, price: clean, available: true } : it))
    );
  };

  const handleToggleAvailable = (index: number) => {
    setItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, available: !it.available } : it))
    );
  };

  const foodTotal = items.reduce((sum, item) => {
    if (!item.available) return sum;
    const p = parseFloat(item.price) || 0;
    return sum + p * item.quantity;
  }, 0);

  const fee = parseFloat(deliveryFee) || 0;
  const total = (foodTotal + fee).toFixed(2);

  const availableItemsCount = items.filter((i) => i.available && parseFloat(i.price) > 0).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (foodTotal <= 0 && fee <= 0) {
      toast.error('Please enter a price for at least one available item.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (onSubmitOffer && request) {
        onSubmitOffer({
          id: `off_sent_${Date.now()}`,
          requestId: request.id || 'r0',
          food: request.food || 'Requested items',
          pickup: request.pickup || 'Campus vendor',
          destination: request.destination || 'Campus dorm',
          requesterName: request.requesterName || 'Student',
          requesterInitials: request.requesterInitials || 'ST',
          status: 'pending',
          availableItems: `${availableItemsCount} of ${items.length} in stock`,
          foodPrice: foodTotal,
          deliveryFee: fee,
          etaMinutes: parseInt(eta, 10) || 15,
          timeAgo: 'Just now',
          note: note.trim() || undefined
        });
      }
      toast.success(`Offer of ETB ${total} sent.`);
      onClose();
    }, 600);
  };

  return (
    <BottomSheet
      open={!!request}
      onClose={onClose}
      title="Make an offer"
      description={request?.food ?? 'Enter cafe pricing and availability'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Item Prices & Availability Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Item prices from cafe
            </Label>
            <span className="text-[11px] text-muted-foreground">
              Price per item
            </span>
          </div>

          <div className="space-y-2">
            {items.map((item, index) => {
              const itemTotal =
                item.available && item.price ? (parseFloat(item.price) || 0) * item.quantity : 0;

              return (
                <div
                  key={index}
                  className="rounded-lg border border-border bg-card p-3 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {item.quantity}x {item.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${item.available ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {item.available ? 'In stock' : 'Out of stock'}
                      </span>
                      <Switch
                        id={`item-stock-${index}`}
                        checked={item.available}
                        onCheckedChange={() => handleToggleAvailable(index)}
                        aria-label={`Toggle availability for ${item.name}`}
                      />
                    </div>
                  </div>

                  {item.available ? (
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Input
                          id={`item-price-${index}`}
                          type="text"
                          inputMode="decimal"
                          value={item.price}
                          placeholder="0.00"
                          onChange={(e) => handlePriceChange(index, e.target.value)}
                          className="h-9 pr-12 font-mono text-sm"
                        />
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                          ETB
                        </span>
                      </div>
                      {item.quantity > 1 && itemTotal > 0 && (
                        <span className="shrink-0 font-mono text-xs text-muted-foreground">
                          = ETB {itemTotal.toFixed(2)}
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      Marked out of stock · Excluded from total
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* General Delivery Fee */}
        <MoneyField
          id="offer-fee"
          label="Delivery fee"
          value={deliveryFee}
          onChange={setDeliveryFee}
          placeholder="0.00"
          unit="ETB"
        />

        {/* ETA Presets */}
        <fieldset>
          <legend className="text-xs font-semibold text-muted-foreground">
            Estimated arrival
          </legend>
          <div className="mt-2 flex gap-2">
            {etaPresets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setEta(String(p))}
                aria-pressed={eta === String(p)}
                className={`h-9 flex-1 rounded-full border text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  eta === String(p)
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'bg-card text-foreground hover:bg-secondary'
                }`}
              >
                {p} min
              </button>
            ))}
            <Input
              aria-label="Custom minutes"
              inputMode="numeric"
              value={eta}
              placeholder="Custom"
              onChange={(e) => setEta(e.target.value.replace(/\D/g, ''))}
              className="h-9 w-16 text-center rounded-full text-xs font-mono"
            />
          </div>
        </fieldset>

        {/* Note from deliverer */}
        <div className="space-y-1.5">
          <Label htmlFor="offer-note" className="text-xs font-semibold text-muted-foreground">
            Note (optional)
          </Label>
          <Textarea
            id="offer-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. I’m already at the counter"
            rows={2}
            className="text-xs"
          />
        </div>

        {/* Calculation Summary */}
        <div className="space-y-1.5 rounded-lg border border-border bg-secondary/40 p-3.5 text-xs">
          <div className="flex justify-between text-muted-foreground">
            <span>
              Food cost ({availableItemsCount} of {items.length} items)
            </span>
            <span className="font-mono font-medium text-foreground">
              ETB {foodTotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Delivery fee</span>
            <span className="font-mono font-medium text-foreground">
              ETB {fee.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between border-t border-border/50 pt-2 text-sm font-semibold text-foreground">
            <span>Total requester pays</span>
            <span className="font-mono font-bold text-primary">
              ETB {total}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="h-11 w-full rounded-full text-sm font-semibold"
        >
          {isSubmitting ? 'Sending offer…' : `Send offer · ETB ${total}`}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          The requester chooses which offer to accept. Terms lock once accepted.
        </p>
      </form>
    </BottomSheet>
  );
}