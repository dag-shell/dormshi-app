import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import { TermsBreakdown } from '@/components/common/TermsBreakdown';

export interface DeliveryReceiptStepProps {
  paidTo?: string;
  requestTitle?: string;
  date?: string;
  reference?: string;
  totalAmount?: string;
  foodPrice?: number;
  deliveryFee?: number;
  onDone: () => void;
}

export function DeliveryReceiptStep({
  paidTo = 'Sam Whitaker',
  requestTitle = 'Chicken shawarma wrap + garlic fries',
  date = 'Oct 18, 2026, 3:18 PM',
  reference = 'DMS-4HXP2M',
  totalAmount = '14.50 DC',
  foodPrice = 11.5,
  deliveryFee = 3.0,
  onDone
}: DeliveryReceiptStepProps) {
  return (
    <div className="space-y-4">
      <section className="flex flex-col items-center pt-2 text-center">
        <motion.span
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          className="grid size-14 place-items-center rounded-full bg-primary text-primary-foreground"
        >
          <FontAwesomeIcon icon={faCheck} className="size-7" aria-hidden="true" />
        </motion.span>
        <h2 className="mt-4 text-xl font-semibold tracking-tight">Delivery confirmed</h2>
        <p className="mt-1 text-sm text-muted-foreground">{totalAmount} sent to {paidTo}</p>
      </section>
      <section className="rounded-xl border bg-card p-4" aria-label="Transaction receipt">
        <dl className="space-y-2 text-sm">
          <div className="flex items-start justify-between gap-4">
            <dt className="shrink-0 text-muted-foreground">Paid to</dt>
            <dd className="text-right font-medium">{paidTo}</dd>
          </div>
          <div className="flex items-start justify-between gap-4">
            <dt className="shrink-0 text-muted-foreground">Request</dt>
            <dd className="text-right font-medium">{requestTitle}</dd>
          </div>
          <div className="flex items-start justify-between gap-4">
            <dt className="shrink-0 text-muted-foreground">Date</dt>
            <dd className="text-right font-medium">{date}</dd>
          </div>
          <div className="flex items-start justify-between gap-4">
            <dt className="shrink-0 text-muted-foreground">Reference</dt>
            <dd className="text-right font-medium font-mono">{reference}</dd>
          </div>
        </dl>
        <div className="mt-4 border-t pt-4">
          <TermsBreakdown foodPrice={foodPrice} deliveryFee={deliveryFee} />
        </div>
      </section>
      <Button size="lg" className="h-12 w-full" onClick={onDone}>
        Done
      </Button>
    </div>
  );
}
