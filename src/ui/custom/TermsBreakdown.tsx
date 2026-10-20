import React from 'react';
import { Separator } from '@/ui/separator';

interface TermsBreakdownProps {
  foodPrice: number | string;
  deliveryFee: number | string;
  etaLabel?: string;
  showPaymentMethod?: boolean;
}

export function TermsBreakdown({ foodPrice, deliveryFee, etaLabel, showPaymentMethod = true }: TermsBreakdownProps) {
  const f = typeof foodPrice === 'number' ? foodPrice : parseFloat(foodPrice) || 0;
  const d = typeof deliveryFee === 'number' ? deliveryFee : parseFloat(deliveryFee) || 0;
  const total = (f + d).toFixed(2);

  return (
    <dl className="space-y-2 text-sm">
      <Row label="Food cost" value={`${typeof foodPrice === 'number' ? foodPrice.toFixed(2) : foodPrice} DC`} mono />
      <Row label="Delivery fee" value={`${typeof deliveryFee === 'number' ? deliveryFee.toFixed(2) : deliveryFee} DC`} mono />
      {etaLabel && <Row label="Estimated arrival" value={etaLabel} />}
      {showPaymentMethod && <Row label="Payment method" value="DC wallet" />}
      <Separator className="my-2" />
      <div className="flex items-center justify-between pt-1">
        <dt className="font-medium">Total</dt>
        <dd className="font-mono text-base font-semibold">{total} DC</dd>
      </div>
    </dl>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={mono ? 'font-mono' : 'font-medium'}>{value}</dd>
    </div>
  );
}