import React from 'react';
import { formatDC, roundDC } from '../utils/format';

interface TermsBreakdownProps {
  foodPrice: number;
  deliveryFee: number;
  etaLabel?: string;
  showPaymentMethod?: boolean;
}

export function TermsBreakdown({ foodPrice, deliveryFee, etaLabel, showPaymentMethod = true }: TermsBreakdownProps) {
  return (
    <dl className="space-y-2 text-sm">
      <Row label="Food cost" value={formatDC(foodPrice)} mono />
      <Row label="Delivery fee" value={formatDC(deliveryFee)} mono />
      {etaLabel && <Row label="Estimated arrival" value={etaLabel} />}
      {showPaymentMethod && <Row label="Payment method" value="DC wallet" />}
      <div className="flex items-center justify-between border-t pt-3">
        <dt className="font-medium">Total</dt>
        <dd className="font-mono text-base font-semibold">{formatDC(roundDC(foodPrice + deliveryFee))}</dd>
      </div>
    </dl>);

}

function Row({ label, value, mono = false }: {label: string;value: string;mono?: boolean;}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={mono ? 'font-mono' : 'font-medium'}>{value}</dd>
    </div>);

}