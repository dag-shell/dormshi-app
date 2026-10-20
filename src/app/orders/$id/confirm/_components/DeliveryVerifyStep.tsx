import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faStar } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/ui/button';
import { TermsBreakdown } from '@/ui/custom/TermsBreakdown';
import { UserAvatar } from '@/ui/custom/UserAvatar';

export interface DeliveryVerifyStepProps {
  courierName?: string;
  courierInitials?: string;
  rating?: number | string;
  dorm?: string;
  totalAmount?: string;
  foodPrice?: number;
  deliveryFee?: number;
  onConfirmRelease: () => void;
  onBack: () => void;
}

export function DeliveryVerifyStep({
  courierName = 'Sam Whitaker',
  courierInitials = 'SW',
  rating = '4.7',
  dorm = 'Brooks Hall',
  totalAmount = '14.50 DC',
  foodPrice = 11.5,
  deliveryFee = 3.0,
  onConfirmRelease,
  onBack
}: DeliveryVerifyStepProps) {
  return (
    <div className="space-y-4">
      <section className="flex flex-col items-center rounded-xl border bg-card p-5 text-center">
        <p className="text-xs text-muted-foreground">Paying</p>
        <div className="mt-3">
          <UserAvatar initials={courierInitials} size="xl" />
        </div>
        <p className="mt-3 text-lg font-semibold tracking-tight">{courierName}</p>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <FontAwesomeIcon icon={faStar} className="size-3.5" aria-hidden="true" /> {rating} · {dorm}
        </p>
        <p className="mt-3 inline-flex items-center gap-2 rounded-md bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
          <FontAwesomeIcon icon={faCircleCheck} className="size-3.5" aria-hidden="true" /> Matches the fulfiller on this request
        </p>
        <p className="mt-5 text-xs text-muted-foreground">Amount</p>
        <p className="font-mono text-3xl font-semibold tracking-tight">{totalAmount}</p>
      </section>
      <div className="rounded-xl border bg-card p-4">
        <TermsBreakdown foodPrice={foodPrice} deliveryFee={deliveryFee} />
      </div>
      <Button size="lg" className="h-12 w-full" onClick={onConfirmRelease}>
        I have my food. Release {totalAmount}
      </Button>
      <Button variant="ghost" className="w-full" onClick={onBack}>
        Back
      </Button>
    </div>
  );
}
