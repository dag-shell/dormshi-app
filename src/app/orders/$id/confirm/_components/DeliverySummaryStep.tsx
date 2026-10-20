import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/ui/button';
import { TermsBreakdown } from '@/ui/custom/TermsBreakdown';

export interface DeliverySummaryStepProps {
  foodTitle?: string;
  routeLabel?: string;
  foodPrice?: number;
  deliveryFee?: number;
  courierName?: string;
  onProceed: () => void;
}

export function DeliverySummaryStep({
  foodTitle = 'Chicken shawarma wrap + garlic fries',
  routeLabel = 'Halal Cart, 5th & Main → Science Library, Room 204',
  foodPrice = 11.5,
  deliveryFee = 3.0,
  courierName = 'Sam Whitaker',
  onProceed
}: DeliverySummaryStepProps) {
  return (
    <div className="space-y-4">
      <section className="rounded-xl border bg-card p-4">
        <p className="text-xs text-muted-foreground">Request summary</p>
        <p className="mt-1 font-medium">{foodTitle}</p>
        <p className="mt-1 text-sm text-muted-foreground">{routeLabel}</p>
        <div className="mt-4 border-t pt-4">
          <TermsBreakdown foodPrice={foodPrice} deliveryFee={deliveryFee} />
        </div>
      </section>
      <p className="rounded-lg bg-primary-soft px-3 py-2 text-sm leading-6 text-primary">
        Agreed total is held in escrow. Confirm delivery receipt to release funds to {courierName}.
      </p>
      <Button size="lg" className="h-12 w-full" onClick={onProceed}>
        <FontAwesomeIcon icon={faCheckCircle} className="mr-2 size-4" aria-hidden="true" /> Verify delivery receipt
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Only confirm once you have your food in hand.
      </p>
    </div>
  );
}
